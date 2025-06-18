from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class Quarter(PyEnum):
    FALL = "fall"
    WINTER = "winter"
    SPRING = "spring"
    SUMMER = "summer"

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    # Reference to Supabase auth.users.id (UUID)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False, index=True)
    
    # Current academic information
    current_institution = Column(String, nullable=False)
    current_major = Column(String, nullable=False)
    current_quarter = Column(Enum(Quarter), nullable=False)
    current_year = Column(Integer, nullable=False)
    
    # Transfer planning information
    target_institution = Column(String, nullable=False)
    target_major = Column(String, nullable=False)
    expected_transfer_year = Column(Integer, nullable=False)
    expected_transfer_quarter = Column(Enum(Quarter), nullable=False)
    
    # Academic preferences
    max_credits_per_quarter = Column(Integer, default=15, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Note: No SQLAlchemy relationship to auth.users since it's managed by Supabase
    transfer_requirements = relationship("TransferRequirement", back_populates="profile") 