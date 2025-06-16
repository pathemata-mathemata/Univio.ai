from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.student_profile import Quarter

# Profile creation/update
class StudentProfileCreate(BaseModel):
    current_institution: str
    current_major: str
    current_quarter: Quarter
    current_year: int
    target_institution: str
    target_major: str
    expected_transfer_year: int
    expected_transfer_quarter: Quarter

class StudentProfileUpdate(BaseModel):
    current_institution: Optional[str] = None
    current_major: Optional[str] = None
    current_quarter: Optional[Quarter] = None
    current_year: Optional[int] = None
    target_institution: Optional[str] = None
    target_major: Optional[str] = None
    expected_transfer_year: Optional[int] = None
    expected_transfer_quarter: Optional[Quarter] = None

# Profile response
class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    current_institution: str
    current_major: str
    current_quarter: Quarter
    current_year: int
    target_institution: str
    target_major: str
    expected_transfer_year: int
    expected_transfer_quarter: Quarter
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True 