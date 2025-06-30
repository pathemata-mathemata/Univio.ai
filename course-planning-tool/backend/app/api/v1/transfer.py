from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.transfer_requirement import TransferRequirement, RequirementStatus
from app.services.auth_service import AuthService
from app.scrapers.assist_scraper import scrape_assist_data
from app.schemas.common import ApiResponse

router = APIRouter()

def normalize_major_name(raw_major: str) -> str:
    """
    Normalize major names to match ASSIST.org format
    Maps common abbreviations and variations to full major names
    """
    if not raw_major:
        return raw_major
    
    # Convert to lowercase for matching
    major_lower = raw_major.lower().strip()
    
    # Major name mapping dictionary
    major_mappings = {
        # Computer Science variations
        "cs": "Computer Science",
        "computer science": "Computer Science",
        "comp sci": "Computer Science",
        "computer sci": "Computer Science",
        "csc": "Computer Science",
        
        # Mathematics variations
        "math": "Mathematics",
        "mathematics": "Mathematics",
        "applied math": "Applied Mathematics",
        "applied mathematics": "Applied Mathematics",
        "pure math": "Pure Mathematics",
        "pure mathematics": "Pure Mathematics",
        
        # Engineering variations
        "ee": "Electrical Engineering",
        "electrical engineering": "Electrical Engineering",
        "computer engineering": "Computer Engineering",
        "comp eng": "Computer Engineering",
        "cpe": "Computer Engineering",
        "me": "Mechanical Engineering",
        "mechanical engineering": "Mechanical Engineering",
        "ce": "Civil Engineering",
        "civil engineering": "Civil Engineering",
        "chemical engineering": "Chemical Engineering",
        "chem eng": "Chemical Engineering",
        "bioengineering": "Bioengineering",
        "bio eng": "Bioengineering",
        
        # Business variations
        "business": "Business Administration",
        "business admin": "Business Administration",
        "business administration": "Business Administration",
        "econ": "Economics",
        "economics": "Economics",
        
        # Biology variations
        "bio": "Biology",
        "biology": "Biology",
        "biochemistry": "Biochemistry",
        "biochem": "Biochemistry",
        "molecular biology": "Molecular Biology",
        
        # Chemistry variations
        "chem": "Chemistry",
        "chemistry": "Chemistry",
        
        # Physics variations
        "physics": "Physics",
        "astrophysics": "Astrophysics",
        
        # Psychology variations
        "psych": "Psychology",
        "psychology": "Psychology",
        
        # English variations
        "english": "English",
        "english lit": "English Literature",
        "english literature": "English Literature",
        
        # History variations
        "history": "History",
        "hist": "History",
        
        # Political Science variations
        "poli sci": "Political Science",
        "political science": "Political Science",
        "polisci": "Political Science",
        
        # Art variations
        "art": "Art",
        "fine art": "Fine Arts",
        "fine arts": "Fine Arts",
        "art history": "Art History",
        
        # Communication variations
        "comm": "Communication Studies",
        "communication": "Communication Studies",
        "communications": "Communication Studies",
        "communication studies": "Communication Studies",
        
        # Sociology variations
        "soc": "Sociology",
        "sociology": "Sociology",
        
        # Anthropology variations
        "anthro": "Anthropology",
        "anthropology": "Anthropology",
        
        # Philosophy variations
        "phil": "Philosophy",
        "philosophy": "Philosophy",
    }
    
    # Check for exact matches first
    if major_lower in major_mappings:
        return major_mappings[major_lower]
    
    # Check for partial matches (for cases like "Applied Math" -> "Applied Mathematics")
    # Only do partial matching for longer, more specific terms to avoid false positives
    for key, value in major_mappings.items():
        if len(key) > 3:  # Only check longer keys to avoid short abbreviations causing false matches
            if key in major_lower:
                return value
    
    # If no mapping found, return the original with proper capitalization
    return raw_major.title()

def normalize_institution_name(raw_institution: str) -> str:
    """
    Normalize institution names to match ASSIST.org format
    """
    if not raw_institution:
        return raw_institution
    
    institution_lower = raw_institution.lower().strip()
    
    # Institution name mappings
    institution_mappings = {
        # Community Colleges
        "de anza": "De Anza College",
        "de anza college": "De Anza College",
        "foothill": "Foothill College",
        "foothill college": "Foothill College",
        "diablo valley": "Diablo Valley College",
        "diablo valley college": "Diablo Valley College",
        "city college of san francisco": "City College of San Francisco",
        "ccsf": "City College of San Francisco",
        
        # UC System
        "uc berkeley": "University of California, Berkeley",
        "ucb": "University of California, Berkeley",
        "berkeley": "University of California, Berkeley",
        "university of california berkeley": "University of California, Berkeley",
        "university of california, berkeley": "University of California, Berkeley",
        
        "uc davis": "University of California, Davis",
        "ucd": "University of California, Davis",
        "davis": "University of California, Davis",
        
        "uc irvine": "University of California, Irvine",
        "uci": "University of California, Irvine",
        "irvine": "University of California, Irvine",
        
        "uc los angeles": "University of California, Los Angeles",
        "ucla": "University of California, Los Angeles",
        "los angeles": "University of California, Los Angeles",
        
        "uc san diego": "University of California, San Diego",
        "ucsd": "University of California, San Diego",
        "san diego": "University of California, San Diego",
        
        "uc santa barbara": "University of California, Santa Barbara",
        "ucsb": "University of California, Santa Barbara",
        "santa barbara": "University of California, Santa Barbara",
        
        # CSU System
        "san jose state": "San Jose State University",
        "sjsu": "San Jose State University",
        "san francisco state": "San Francisco State University",
        "sfsu": "San Francisco State University",
    }
    
    # Check for exact matches
    if institution_lower in institution_mappings:
        return institution_mappings[institution_lower]
    
    # Check for partial matches
    for key, value in institution_mappings.items():
        if key in institution_lower:
            return value
    
    # Return original with proper capitalization
    return raw_institution.title()

class TransferAnalysisRequest:
    def __init__(
        self,
        current_institution: str,
        target_institution: str, 
        major: str,
        academic_year: str
    ):
        self.current_institution = current_institution
        self.target_institution = target_institution
        self.major = major
        self.academic_year = academic_year

@router.post("/analyze", response_model=ApiResponse[Dict[str, Any]])
async def analyze_transfer_requirements(
    request: Dict[str, str],
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze transfer requirements using ASSIST.org data"""
    try:
        # Extract request parameters
        current_institution = request.get("current_institution")
        target_institution = request.get("target_institution") 
        major = request.get("major")
        academic_year = request.get("academic_year", "2024-25")
        
        if not all([current_institution, target_institution, major]):
            raise HTTPException(
                status_code=400,
                detail="Missing required parameters: current_institution, target_institution, major"
            )
        
        # Use the ASSIST scraper to get transfer requirements
        scraper_result = scrape_assist_data(
            academic_year=academic_year,
            institution=current_institution,
            target_institution=target_institution,
            major_filter=major
        )
        
        if not scraper_result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=f"Failed to scrape ASSIST data: {scraper_result.get('error', 'Unknown error')}"
            )
        
        # Process the scraped data and create/update transfer requirements
        requirements_data = scraper_result.get("data", {})
        processed_requirements = []
        
        # Get or create user profile
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not profile:
            raise HTTPException(
                status_code=400,
                detail="User profile not found. Please complete your profile setup first."
            )
        
        # Clear existing requirements for this profile
        db.query(TransferRequirement).filter(
            TransferRequirement.profile_id == profile.id
        ).delete()
        
        # Create new requirements based on ASSIST data
        for category, details in requirements_data.items():
            if isinstance(details, dict) and details.get("courses"):
                requirement = TransferRequirement(
                    profile_id=profile.id,
                    category=category,
                    description=details.get("description", f"{category} requirements"),
                    required_units=details.get("units"),
                    required_courses=details.get("courses", []),
                    status=RequirementStatus.NOT_STARTED,
                    completed_units=0.0,
                    completed_courses=[]
                )
                
                db.add(requirement)
                processed_requirements.append({
                    "category": category,
                    "description": requirement.description,
                    "required_units": requirement.required_units,
                    "required_courses": requirement.required_courses,
                    "status": requirement.status.value
                })
        
        db.commit()
        
        return ApiResponse(
            success=True,
            data={
                "requirements": processed_requirements,
                "source": "ASSIST.org",
                "academic_year": academic_year,
                "institutions": {
                    "from": current_institution,
                    "to": target_institution
                },
                "major": major
            },
            message="Transfer requirements analyzed successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing transfer requirements: {str(e)}"
        )

@router.get("/progress", response_model=ApiResponse[Dict[str, Any]])
async def get_transfer_progress(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's transfer progress"""
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        return ApiResponse(
            success=True,
            data={
                "overall_progress": 0,
                "requirements": [],
                "message": "No profile found. Please complete your profile setup."
            }
        )
    
    # Get all requirements for this profile
    requirements = db.query(TransferRequirement).filter(
        TransferRequirement.profile_id == profile.id
    ).all()
    
    if not requirements:
        return ApiResponse(
            success=True,
            data={
                "overall_progress": 0,
                "requirements": [],
                "message": "No transfer requirements found. Run transfer analysis first."
            }
        )
    
    # Calculate progress
    total_completed = sum(req.completed_units for req in requirements)
    total_required = sum(req.required_units or 0 for req in requirements)
    overall_progress = int((total_completed / total_required * 100)) if total_required > 0 else 0
    
    requirements_data = []
    for req in requirements:
        req_progress = 0
        if req.required_units and req.required_units > 0:
            req_progress = int((req.completed_units / req.required_units) * 100)
        
        requirements_data.append({
            "category": req.category,
            "description": req.description,
            "completed": req.completed_units,
            "total": req.required_units,
            "progress": req_progress,
            "status": req.status.value
        })
    
    return ApiResponse(
        success=True,
        data={
            "overall_progress": overall_progress,
            "requirements": requirements_data,
            "profile": {
                "current_institution": profile.current_institution,
                "target_institution": profile.target_institution,
                "major": profile.target_major
            }
        }
    )

@router.post("/analyze-public", response_model=ApiResponse[Dict[str, Any]])
async def analyze_transfer_requirements_public(
    request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Public endpoint for analyzing transfer requirements (for testing without auth)"""
    try:
        # Log what we received from frontend
        print("=== BACKEND RECEIVED DATA ===")
        print("Full request:", request)
        
        # Map frontend parameters to backend expected format
        raw_current_institution = request.get("current_institution")
        raw_target_institution = request.get("intended_transfer_institution") 
        raw_major = request.get("current_major")
        raw_year = request.get("target_transfer_quarter")  # This contains the year like "2025"
        completed_courses = request.get("completed_courses", [])
        
        # Process the data to match ASSIST.org format
        # Convert year to academic year format (e.g., "2025" -> "2024-2025")
        if raw_year and raw_year.isdigit():
            year = int(raw_year)
            academic_year = f"{year-1}-{year}"
        else:
            raise HTTPException(status_code=400, detail="target_transfer_quarter must be a valid year (e.g., '2025')")
        
        # Normalize institution names to match ASSIST.org exactly
        current_institution = normalize_institution_name(raw_current_institution)
        target_institution = normalize_institution_name(raw_target_institution)
        
        # Normalize major name with comprehensive mapping
        major = normalize_major_name(raw_major)
        
        print(f"Raw frontend data:")
        print(f"  raw_current_institution: {raw_current_institution}")
        print(f"  raw_target_institution: {raw_target_institution}")
        print(f"  raw_major: {raw_major}")
        print(f"  raw_year: {raw_year}")
        
        print(f"Processed parameters for ASSIST.org:")
        print(f"  current_institution: {current_institution}")
        print(f"  target_institution: {target_institution}")
        print(f"  major: {major}")
        print(f"  academic_year: {academic_year}")
        print(f"  completed_courses: {completed_courses}")
        
        if not all([current_institution, target_institution, major]):
            raise HTTPException(
                status_code=400,
                detail="Missing required parameters: current_institution, intended_transfer_institution, current_major"
            )
        
        # Use the ASSIST scraper to get transfer requirements
        print(f"Calling ASSIST scraper with:")
        print(f"  academic_year: {academic_year}")
        print(f"  institution: {current_institution}")
        print(f"  target_institution: {target_institution}")
        print(f"  major_filter: {major}")
        
        scraper_result = scrape_assist_data(
            academic_year=academic_year,
            institution=current_institution,
            target_institution=target_institution,
            major_filter=major
        )
        
        print(f"Scraper result type: {type(scraper_result)}")
        print(f"Scraper result: {scraper_result}")
        
        # Handle case where scraper returns None or fails
        if scraper_result is None:
            print("❌ Scraper returned None")
            scraper_result = {"success": False, "error": "Scraper returned None", "data": {}}
        
        if not isinstance(scraper_result, dict):
            print(f"❌ Scraper returned unexpected type: {type(scraper_result)}")
            scraper_result = {"success": False, "error": f"Scraper returned {type(scraper_result)}", "data": {}}
        
        if not scraper_result.get("success", False):
            error_msg = scraper_result.get("error", "Unknown scraping error")
            print(f"❌ Scraper failed: {error_msg}")
            
            # Return error response - NO FALLBACK DATA
            raise HTTPException(
                status_code=503,
                detail=f"Transfer analysis unavailable: ASSIST.org scraping failed - {error_msg}. Please try again later or check if the institution/major combination exists on ASSIST.org."
            )
        
        # Process the scraped data
        requirements_data = scraper_result.get("data", {})
        print(f"Requirements data: {requirements_data}")
        
        # Now use AI to generate a course schedule based on the scraped data
        print("🤖 Generating AI-powered course schedule...")
        
        # Prepare context for AI planning - USE ONLY REAL DATA
        current_planning_quarter = request.get("current_planning_quarter")
        target_transfer_quarter = request.get("target_transfer_quarter")
        
        # Validate required data
        if not current_planning_quarter:
            raise HTTPException(status_code=400, detail="current_planning_quarter is required")
        if not target_transfer_quarter:
            raise HTTPException(status_code=400, detail="target_transfer_quarter is required")
        
        # Extract year from target_transfer_quarter if it's a year string
        transfer_year = None
        if target_transfer_quarter and target_transfer_quarter.isdigit():
            transfer_year = int(target_transfer_quarter)
        
        planning_context = {
            "profile": {
                "current_institution": current_institution,
                "target_institution": target_institution,
                "current_major": major,
                "target_major": major,
                "current_quarter": current_planning_quarter,
                "current_year": transfer_year - 1 if transfer_year else None,  # Extract from transfer year
                "transfer_quarter": target_transfer_quarter,
                "transfer_year": transfer_year
            },
            "completed_courses": [
                {
                    "code": course.get("courseNumber", ""),
                    "title": f"Course {course.get('courseNumber', '')}",
                    "units": float(course.get("credits", 0)),  # No fallback to 3
                    "grade": course.get("grade", ""),
                    "quarter": "Previous",
                    "year": transfer_year - 1 if transfer_year else None
                }
                for course in completed_courses if course.get("courseNumber")  # Only include courses with valid data
            ],
            "transfer_requirements": requirements_data,
            "preferences": {
                "units_per_quarter": request.get("units_per_quarter", 15),  # Get from request or reasonable default
                "max_units_per_quarter": 18,
                "min_units_per_quarter": 12
            }
        }
        
        print(f"Planning context: {planning_context}")
        
        # Import and use AI planning service
        from app.services.ai_planning_service import AIPlanningService
        ai_service = AIPlanningService()
        
        try:
            # Generate AI schedule
            ai_schedule = await ai_service.generate_quarter_schedule(planning_context)
            print(f"AI Schedule generated: {ai_schedule}")
            
            # Format response to match what frontend expects
            return ApiResponse(
                success=True,
                data={
                    "academic_year": academic_year,
                    "source_institution": current_institution,
                    "target_institution": target_institution,
                    "major": major,
                    "target_requirements": requirements_data.get("target_requirements", []),
                    "source_requirements": requirements_data.get("source_requirements", {}),
                    "ai_schedule": ai_schedule,  # Add the AI-generated schedule
                    "user_timeline": {
                        "target_transfer_quarter": request.get("target_transfer_quarter"),
                        "current_planning_quarter": request.get("current_planning_quarter")
                    },
                    "analysis_metadata": {
                        "quarters_until_transfer": 2,
                        "analysis_date": None,  # Use real date if needed
                        "requirements_source": "ASSIST.org + AI Planning"
                    }
                },
                message="Transfer requirements analyzed and AI schedule generated successfully"
            )
            
        except Exception as ai_error:
            print(f"❌ AI scheduling failed: {ai_error}")
            # Fail with proper error - NO FALLBACK DATA
            raise HTTPException(
                status_code=503,
                detail=f"AI schedule generation failed: {str(ai_error)}. ASSIST.org data was retrieved but schedule generation is unavailable."
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing transfer requirements: {str(e)}"
        ) 