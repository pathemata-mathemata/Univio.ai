from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class DeadlineType(PyEnum):
    APPLICATION = "application"
    REGISTRATION = "registration"
    DEADLINE = "deadline"
    EXAM = "exam"

class DeadlinePriority(PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class UserDeadline(Base):
    __tablename__ = "user_deadlines"
    
    id = Column(Integer, primary_key=True, index=True)
    # Reference to Supabase auth.users.id (UUID)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Deadline information
    title = Column(String, nullable=False)
    description = Column(Text)
    deadline_date = Column(Date, nullable=False)
    deadline_type = Column(Enum(DeadlineType), nullable=False)
    priority = Column(Enum(DeadlinePriority), default=DeadlinePriority.MEDIUM)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Note: No relationship to auth.users since it's managed by Supabase 