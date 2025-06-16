from sqlalchemy import Column, Integer, String, Text, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False, index=True)  # e.g., "MATH 1A"
    title = Column(String, nullable=False)
    description = Column(Text)
    units = Column(Float, nullable=False)
    institution = Column(String, nullable=False, index=True)
    
    # Course metadata
    transferable = Column(Boolean, default=True)
    category = Column(String)  # e.g., "General Education", "Major Prerequisites"
    prerequisites = Column(JSON)  # Store as list of prerequisite course codes
    
    # Relationships
    enrolled_courses = relationship("EnrolledCourse", back_populates="course") 