from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile, Quarter
from app.services.auth_service import AuthService
from app.schemas.common import ApiResponse
from app.schemas.user import UserResponse
from app.schemas.student_profile import StudentProfileResponse, StudentProfileUpdate

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

@router.put("/profile", response_model=ApiResponse[dict])
async def update_user_profile(
    profile_update: dict,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user academic profile information"""
    try:
        # Get or create student profile
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not profile:
            # Create new profile if it doesn't exist
            profile = StudentProfile(
                user_id=current_user.id,
                current_institution=profile_update.get("current_institution", ""),
                current_major=profile_update.get("current_major", ""),
                current_quarter=Quarter.fall,  # Default value
                current_year=profile_update.get("current_year", 2024),
                target_institution=profile_update.get("target_institution", ""),
                target_major=profile_update.get("target_major", ""),
                expected_transfer_year=profile_update.get("expected_transfer_year", 2025),
                expected_transfer_quarter=Quarter.fall  # Default value
            )
            db.add(profile)
        else:
            # Update existing profile
            if "current_institution" in profile_update:
                profile.current_institution = profile_update["current_institution"]
            if "current_major" in profile_update:
                profile.current_major = profile_update["current_major"]
            if "target_institution" in profile_update:
                profile.target_institution = profile_update["target_institution"]
            if "target_major" in profile_update:
                profile.target_major = profile_update["target_major"]
            if "expected_transfer_year" in profile_update:
                profile.expected_transfer_year = profile_update["expected_transfer_year"]
            if "expected_transfer_quarter" in profile_update:
                # Convert string to Quarter enum
                quarter_str = profile_update["expected_transfer_quarter"].lower()
                if quarter_str in ["fall", "winter", "spring", "summer"]:
                    profile.expected_transfer_quarter = Quarter(quarter_str)
        
        db.commit()
        db.refresh(profile)
        
        # Return updated profile data
        updated_profile_data = {
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
            "academic_profile": {
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
        }
        
        return ApiResponse(
            success=True,
            data=updated_profile_data,
            message="Profile updated successfully"
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating profile: {str(e)}"
        ) 