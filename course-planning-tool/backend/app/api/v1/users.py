from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.services.auth_service import AuthService
from app.schemas.common import ApiResponse
from app.schemas.user import UserResponse
from app.schemas.student_profile import StudentProfileResponse

router = APIRouter()

@router.get("/")
async def get_users():
    return {"message": "users endpoint"}

@router.get("/profile", response_model=ApiResponse[dict])
async def get_user_profile(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive user profile including academic information"""
    try:
        # Get user's academic profile
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        # Build response data
        profile_data = {
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "name": current_user.name,
                "edu_email": current_user.edu_email,
                "edu_email_verified": current_user.edu_email_verified,
                "is_verified": current_user.is_verified,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
                "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
            },
            "academic_profile": None
        }
        
        if profile:
            profile_data["academic_profile"] = {
                "id": profile.id,
                "current_institution": profile.current_institution,
                "current_major": profile.current_major,
                "current_quarter": profile.current_quarter.value if profile.current_quarter else None,
                "current_year": profile.current_year,
                "target_institution": profile.target_institution,
                "target_major": profile.target_major,
                "expected_transfer_year": profile.expected_transfer_year,
                "expected_transfer_quarter": profile.expected_transfer_quarter.value if profile.expected_transfer_quarter else None,
                "max_credits_per_quarter": profile.max_credits_per_quarter,
                "created_at": profile.created_at.isoformat() if profile.created_at else None,
                "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
            }
        
        return ApiResponse(
            success=True,
            data=profile_data,
            message="Profile retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving profile: {str(e)}"
        ) 