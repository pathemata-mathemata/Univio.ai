from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.enrolled_course import CourseStatus
from app.schemas.course import CourseResponse

# Enrolled course creation
class EnrolledCourseCreate(BaseModel):
    course_id: int
    quarter: str
    year: int
    grade: Optional[str] = None
    status: CourseStatus = CourseStatus.PLANNED

# Enrolled course update
class EnrolledCourseUpdate(BaseModel):
    quarter: Optional[str] = None
    year: Optional[int] = None
    grade: Optional[str] = None
    status: Optional[CourseStatus] = None

# Enrolled course response
class EnrolledCourseResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    quarter: str
    year: int
    grade: Optional[str] = None
    status: CourseStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    course: CourseResponse
    
    class Config:
        from_attributes = True

# Bulk course completion (for the "Add Completed Courses" feature)
class BulkCourseCompletion(BaseModel):
    courses: list[dict]  # List of {course_code, credits, grade, quarter, year}
    
class CourseCompletionItem(BaseModel):
    course_code: str
    credits: float
    grade: str
    quarter: str
    year: int 