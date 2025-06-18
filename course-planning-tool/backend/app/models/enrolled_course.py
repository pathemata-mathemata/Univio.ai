from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class CourseStatus(PyEnum):
    PLANNED = "planned"
    ENROLLED = "enrolled"
    COMPLETED = "completed"
    DROPPED = "dropped"

class EnrolledCourse(Base):
    __tablename__ = "enrolled_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    # Reference to Supabase auth.users.id (UUID)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    
    # Academic term information
    quarter = Column(String, nullable=False)  # e.g., "Fall 2024"
    year = Column(Integer, nullable=False)
    
    # Course completion information
    grade = Column(String)  # e.g., "A", "B+", "Pass"
    status = Column(Enum(CourseStatus), nullable=False, default=CourseStatus.PLANNED)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    # Note: No relationship to auth.users since it's managed by Supabase
    course = relationship("Course", back_populates="enrolled_courses") 