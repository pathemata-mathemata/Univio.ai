from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Extended user creation/registration with profile data
class UserCreateExtended(BaseModel):
    # Account credentials
    email: EmailStr
    password: str
    name: str
    
    # Educational verification
    eduEmail: Optional[EmailStr] = None
    eduEmailVerified: bool = False
    
    # Academic profile
    profile: Optional['StudentProfileCreate'] = None

# Original user creation (for backwards compatibility)
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

# User login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User update
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

# User response (what gets returned to frontend)
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Extended user response with profile
class UserResponseExtended(BaseModel):
    id: int
    email: str
    name: str
    is_active: bool
    is_verified: bool
    edu_email: Optional[str] = None
    edu_email_verified: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    profile: Optional['StudentProfileResponse'] = None
    
    class Config:
        from_attributes = True

# Token response for authentication
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Extended token response with profile
class TokenResponseExtended(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseExtended

# Edu email verification schemas
class EduEmailVerificationRequest(BaseModel):
    eduEmail: EmailStr

class EduEmailVerificationResponse(BaseModel):
    message: str
    verification_sent: bool

class EduEmailVerifyCode(BaseModel):
    eduEmail: EmailStr
    code: str

# Forward reference resolution
from app.schemas.student_profile import StudentProfileCreate, StudentProfileResponse
UserCreateExtended.model_rebuild()
UserResponseExtended.model_rebuild() 