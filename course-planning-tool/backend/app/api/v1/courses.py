from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.course import Course
from app.models.enrolled_course import EnrolledCourse, CourseStatus
from app.schemas.course import CourseResponse, CourseSearchParams
from app.schemas.enrolled_course import (
    EnrolledCourseCreate, 
    EnrolledCourseResponse, 
    CourseCompletionItem,
    BulkCourseCompletion
)
from app.services.auth_service import AuthService
from app.schemas.common import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[CourseResponse])
async def get_courses(
    institution: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    transferable: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get courses with filtering and pagination"""
    query = db.query(Course)
    
    # Apply filters
    if institution:
        query = query.filter(Course.institution.ilike(f"%{institution}%"))
    if search:
        query = query.filter(
            Course.code.ilike(f"%{search}%") | 
            Course.title.ilike(f"%{search}%")
        )
    if category:
        query = query.filter(Course.category == category)
    if transferable is not None:
        query = query.filter(Course.transferable == transferable)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    courses = query.offset(offset).limit(limit).all()
    
    return PaginatedResponse(
        items=[CourseResponse.from_orm(course) for course in courses],
        total=total,
        page=page,
        limit=limit,
        has_next=offset + limit < total,
        has_prev=page > 1
    )

@router.get("/completed", response_model=List[EnrolledCourseResponse])
async def get_completed_courses(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's completed courses"""
    completed_courses = db.query(EnrolledCourse).filter(
        EnrolledCourse.user_id == current_user.id,
        EnrolledCourse.status == CourseStatus.COMPLETED
    ).all()
    
    return [EnrolledCourseResponse.from_orm(course) for course in completed_courses]

@router.post("/completed", response_model=List[EnrolledCourseResponse])
async def add_completed_courses(
    courses_data: List[CourseCompletionItem],
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Add multiple completed courses"""
    enrolled_courses = []
    
    for course_item in courses_data:
        # Find or create course
        course = db.query(Course).filter(
            Course.code == course_item.course_code
        ).first()
        
        if not course:
            # Create new course entry (basic info)
            course = Course(
                code=course_item.course_code,
                title=f"Course {course_item.course_code}",
                units=course_item.credits,
                institution=current_user.profile.current_institution if current_user.profile else "Unknown",
                transferable=True
            )
            db.add(course)
            db.flush()  # Get the course ID
        
        # Create enrolled course record
        enrolled_course = EnrolledCourse(
            user_id=current_user.id,
            course_id=course.id,
            quarter=course_item.quarter,
            year=course_item.year,
            grade=course_item.grade,
            status=CourseStatus.COMPLETED
        )
        
        db.add(enrolled_course)
        enrolled_courses.append(enrolled_course)
    
    db.commit()
    
    # Refresh all objects to get relationships
    for enrolled_course in enrolled_courses:
        db.refresh(enrolled_course)
    
    return [EnrolledCourseResponse.from_orm(course) for course in enrolled_courses]

@router.delete("/completed/{course_id}")
async def remove_completed_course(
    course_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a completed course"""
    enrolled_course = db.query(EnrolledCourse).filter(
        EnrolledCourse.id == course_id,
        EnrolledCourse.user_id == current_user.id
    ).first()
    
    if not enrolled_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(enrolled_course)
    db.commit()
    
    return {"message": "Course removed successfully"} 