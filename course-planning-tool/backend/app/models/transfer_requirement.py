from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class RequirementStatus(PyEnum):
    NOT_STARTED = "not-started"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"

class TransferRequirement(Base):
    __tablename__ = "transfer_requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    
    # Requirement information
    category = Column(String, nullable=False)  # e.g., "General Education", "Major Prerequisites"
    description = Column(Text, nullable=False)
    required_units = Column(Float)
    required_courses = Column(JSON)  # List of required course codes
    
    # Progress tracking
    status = Column(Enum(RequirementStatus), default=RequirementStatus.NOT_STARTED)
    completed_units = Column(Float, default=0.0)
    completed_courses = Column(JSON)  # List of completed course codes
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("StudentProfile", back_populates="transfer_requirements") 