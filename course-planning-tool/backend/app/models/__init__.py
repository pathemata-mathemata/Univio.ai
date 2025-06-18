# Note: User model removed - using Supabase Auth instead
from .student_profile import StudentProfile, Quarter
from .course import Course
from .enrolled_course import EnrolledCourse, CourseStatus
from .transfer_requirement import TransferRequirement, RequirementStatus
from .deadline import UserDeadline, DeadlineType, DeadlinePriority

__all__ = [
    "StudentProfile",
    "Quarter",
    "Course",
    "EnrolledCourse",
    "CourseStatus",
    "TransferRequirement",
    "RequirementStatus",
    "UserDeadline",
    "DeadlineType",
    "DeadlinePriority",
]
