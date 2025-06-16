from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile, Quarter
from app.models.enrolled_course import EnrolledCourse, CourseStatus
from app.models.transfer_requirement import TransferRequirement
from app.services.auth_service import AuthService
from app.services.ai_planning_service import AIPlanningService
from app.scrapers.assist_scraper import scrape_assist_data
from app.schemas.common import ApiResponse
from app.schemas.student_profile import StudentProfileCreate
from app.api.v1.transfer import normalize_institution_name  # Import normalization function

router = APIRouter()

class PlanningRequest(BaseModel):
    # For new users - all required
    current_institution: Optional[str] = None
    target_institution: Optional[str] = None
    current_major: Optional[str] = None
    target_major: Optional[str] = None
    current_quarter: Optional[Quarter] = None
    current_year: Optional[int] = None
    expected_transfer_year: Optional[int] = None
    expected_transfer_quarter: Optional[Quarter] = None
    
    # Planning preferences
    units_per_quarter: int = 12
    completed_courses: List[Dict[str, Any]] = []
    
    # For existing users, these will be loaded from database
    update_profile: bool = False

class QuarterPlan(BaseModel):
    quarter: str
    year: int
    courses: List[Dict[str, Any]]
    total_units: float
    notes: str

class PlanningResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

@router.post("/generate", response_model=ApiResponse[Dict[str, Any]])
async def generate_ai_schedule(
    request: PlanningRequest,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered quarter-by-quarter course schedule"""
    try:
        # Step 1: Get or create user profile
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not profile:
            # New user - validate required fields
            required_fields = [
                'current_institution', 'target_institution', 'current_major', 
                'target_major', 'current_quarter', 'current_year', 
                'expected_transfer_year', 'expected_transfer_quarter'
            ]
            
            missing_fields = [field for field in required_fields if getattr(request, field) is None]
            if missing_fields:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required fields for new user: {', '.join(missing_fields)}"
                )
            
            # Create new profile
            profile = StudentProfile(
                user_id=current_user.id,
                current_institution=request.current_institution,
                current_major=request.current_major,
                current_quarter=request.current_quarter,
                current_year=request.current_year,
                target_institution=request.target_institution,
                target_major=request.target_major,
                expected_transfer_year=request.expected_transfer_year,
                expected_transfer_quarter=request.expected_transfer_quarter
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            
            # Add completed courses if provided
            if request.completed_courses:
                await _add_completed_courses(request.completed_courses, current_user.id, db)
        
        elif request.update_profile:
            # Update existing profile with new information
            if request.current_institution:
                profile.current_institution = request.current_institution
            if request.target_institution:
                profile.target_institution = request.target_institution
            if request.current_major:
                profile.current_major = request.current_major
            if request.target_major:
                profile.target_major = request.target_major
            if request.current_quarter:
                profile.current_quarter = request.current_quarter
            if request.current_year:
                profile.current_year = request.current_year
            if request.expected_transfer_year:
                profile.expected_transfer_year = request.expected_transfer_year
            if request.expected_transfer_quarter:
                profile.expected_transfer_quarter = request.expected_transfer_quarter
            
            db.commit()
        
        # Step 2: Get user's completed courses
        completed_courses = db.query(EnrolledCourse).filter(
            EnrolledCourse.user_id == current_user.id,
            EnrolledCourse.status == CourseStatus.COMPLETED
        ).all()
        
        # Step 3: Scrape transfer requirements from ASSIST.org
        # Normalize institution names for ASSIST.org compatibility
        normalized_current_institution = normalize_institution_name(profile.current_institution)
        normalized_target_institution = normalize_institution_name(profile.target_institution)
        
        transfer_data = scrape_assist_data(
            academic_year=f"{profile.expected_transfer_year-1}-{str(profile.expected_transfer_year)[2:]}",
            institution=normalized_current_institution,
            target_institution=normalized_target_institution,
            major_filter=profile.target_major
        )
        
        if not transfer_data.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to scrape transfer requirements: {transfer_data.get('error', 'Unknown error')}"
            )
        
        # Step 4: Prepare data for AI planning
        planning_context = {
            "profile": {
                "current_institution": profile.current_institution,
                "target_institution": profile.target_institution,
                "current_major": profile.current_major,
                "target_major": profile.target_major,
                "current_quarter": profile.current_quarter.value,
                "current_year": profile.current_year,
                "transfer_quarter": profile.expected_transfer_quarter.value,
                "transfer_year": profile.expected_transfer_year
            },
            "completed_courses": [
                {
                    "code": course.course.code,
                    "title": course.course.title,
                    "units": course.course.units,
                    "grade": course.grade,
                    "quarter": course.quarter,
                    "year": course.year
                }
                for course in completed_courses
            ],
            "transfer_requirements": transfer_data.get("data", {}),
            "preferences": {
                "units_per_quarter": profile.max_credits_per_quarter,
                "max_units_per_quarter": min(profile.max_credits_per_quarter + 3, 20),  # Some flexibility
                "min_units_per_quarter": max(profile.max_credits_per_quarter - 3, 6)
            }
        }
        
        # Step 5: Generate AI schedule
        ai_service = AIPlanningService()
        schedule = await ai_service.generate_quarter_schedule(planning_context)
        
        # Step 6: Save planned courses to database (as PLANNED status)
        await _save_planned_courses(schedule, current_user.id, db)
        
        return ApiResponse(
            success=True,
            data={
                "schedule": schedule,
                "profile": {
                    "current_institution": profile.current_institution,
                    "target_institution": profile.target_institution,
                    "current_major": profile.current_major,
                    "target_major": profile.target_major,
                    "transfer_timeline": f"{profile.expected_transfer_quarter.value} {profile.expected_transfer_year}"
                },
                "completed_courses_count": len(completed_courses),
                "quarters_until_transfer": _calculate_quarters_until_transfer(
                    profile.current_quarter.value, 
                    profile.current_year,
                    profile.expected_transfer_quarter.value,
                    profile.expected_transfer_year
                )
            },
            message="AI course schedule generated successfully!"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating schedule: {str(e)}"
        )

@router.get("/schedule", response_model=ApiResponse[Dict[str, Any]])
async def get_current_schedule(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current planned schedule"""
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        return ApiResponse(
            success=False,
            message="No profile found. Please complete your profile setup first.",
            data={}
        )
    
    # Get all planned courses
    planned_courses = db.query(EnrolledCourse).filter(
        EnrolledCourse.user_id == current_user.id,
        EnrolledCourse.status.in_([CourseStatus.PLANNED, CourseStatus.ENROLLED])
    ).all()
    
    # Group by quarter and year
    schedule_by_quarter = {}
    for course in planned_courses:
        quarter_key = f"{course.quarter} {course.year}"
        if quarter_key not in schedule_by_quarter:
            schedule_by_quarter[quarter_key] = {
                "quarter": course.quarter,
                "year": course.year,
                "courses": [],
                "total_units": 0
            }
        
        schedule_by_quarter[quarter_key]["courses"].append({
            "id": course.id,
            "code": course.course.code,
            "title": course.course.title,
            "units": course.course.units,
            "status": course.status.value,
            "grade": course.grade
        })
        schedule_by_quarter[quarter_key]["total_units"] += course.course.units
    
    return ApiResponse(
        success=True,
        data={
            "schedule": list(schedule_by_quarter.values()),
            "profile": {
                "current_institution": profile.current_institution,
                "target_institution": profile.target_institution,
                "transfer_timeline": f"{profile.expected_transfer_quarter.value} {profile.expected_transfer_year}"
            }
        },
        message="Current schedule retrieved successfully"
    )

async def _add_completed_courses(courses_data: List[Dict], user_id: int, db: Session):
    """Helper function to add completed courses"""
    from app.models.course import Course
    
    for course_data in courses_data:
        # Find or create course
        course = db.query(Course).filter(
            Course.code == course_data.get("course_code")
        ).first()
        
        if not course:
            course = Course(
                code=course_data.get("course_code"),
                title=course_data.get("course_title", f"Course {course_data.get('course_code')}"),
                units=float(course_data.get("credits", 3)),
                institution=course_data.get("institution", "Unknown"),
                transferable=True
            )
            db.add(course)
            db.flush()
        
        # Add enrolled course
        enrolled_course = EnrolledCourse(
            user_id=user_id,
            course_id=course.id,
            quarter=course_data.get("quarter"),
            year=int(course_data.get("year")),
            grade=course_data.get("grade"),
            status=CourseStatus.COMPLETED
        )
        db.add(enrolled_course)

async def _save_planned_courses(schedule: Dict, user_id: int, db: Session):
    """Helper function to save AI-generated planned courses"""
    from app.models.course import Course
    
    # Clear existing planned courses
    db.query(EnrolledCourse).filter(
        EnrolledCourse.user_id == user_id,
        EnrolledCourse.status == CourseStatus.PLANNED
    ).delete()
    
    for quarter_data in schedule.get("quarters", []):
        for course_data in quarter_data.get("courses", []):
            # Find or create course
            course = db.query(Course).filter(
                Course.code == course_data.get("code")
            ).first()
            
            if not course:
                course = Course(
                    code=course_data.get("code"),
                    title=course_data.get("title"),
                    units=float(course_data.get("units", 3)),
                    institution=course_data.get("institution", "Unknown"),
                    transferable=True,
                    category=course_data.get("category")
                )
                db.add(course)
                db.flush()
            
            # Add planned course
            planned_course = EnrolledCourse(
                user_id=user_id,
                course_id=course.id,
                quarter=quarter_data.get("quarter"),
                year=int(quarter_data.get("year")),
                status=CourseStatus.PLANNED
            )
            db.add(planned_course)
    
    db.commit()

def _calculate_quarters_until_transfer(current_quarter: str, current_year: int, transfer_quarter: str, transfer_year: int) -> int:
    """Calculate number of quarters until transfer"""
    quarter_order = {"fall": 0, "winter": 1, "spring": 2, "summer": 3}
    
    current_total = current_year * 4 + quarter_order.get(current_quarter.lower(), 0)
    transfer_total = transfer_year * 4 + quarter_order.get(transfer_quarter.lower(), 0)
    
    return max(0, transfer_total - current_total) 