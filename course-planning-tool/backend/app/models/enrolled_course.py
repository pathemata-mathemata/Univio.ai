from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
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
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
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
    user = relationship("User", back_populates="enrolled_courses")
    course = relationship("Course", back_populates="enrolled_courses") 