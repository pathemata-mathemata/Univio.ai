from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
import uuid

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile, Quarter
from app.services.auth_service import AuthService
from app.schemas.api_response import ApiResponse
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
    """Get comprehensive user profile including academic information from Supabase"""
    try:
        # Query the academic_profiles table directly from Supabase
        # Since we're using Supabase, query the actual table structure
        academic_profile_query = text("""
            SELECT 
                id,
                user_id,
                current_institution_name,
                current_major_name,
                current_gpa,
                current_quarter,
                current_year,
                target_institution_name,
                target_major_name,
                expected_transfer_year,
                expected_transfer_quarter,
                max_units_per_quarter,
                preferred_study_intensity,
                created_at,
                updated_at
            FROM academic_profiles 
            WHERE user_id = :user_id
            LIMIT 1
        """)
        
        # Execute the query
        result = db.execute(academic_profile_query, {"user_id": str(current_user.id)})
        academic_profile_row = result.fetchone()
        
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
        
        # Add academic profile data if found
        if academic_profile_row:
            profile_data["academic_profile"] = {
                "id": academic_profile_row.id,
                "current_institution": academic_profile_row.current_institution_name,
                "current_major": academic_profile_row.current_major_name,
                "current_gpa": academic_profile_row.current_gpa,
                "current_quarter": academic_profile_row.current_quarter,
                "current_year": academic_profile_row.current_year,
                "target_institution": academic_profile_row.target_institution_name,
                "target_major": academic_profile_row.target_major_name,
                "expected_transfer_year": academic_profile_row.expected_transfer_year,
                "expected_transfer_quarter": academic_profile_row.expected_transfer_quarter,
                "max_credits_per_quarter": academic_profile_row.max_units_per_quarter or 15,
                "created_at": academic_profile_row.created_at.isoformat() if academic_profile_row.created_at else None,
                "updated_at": academic_profile_row.updated_at.isoformat() if academic_profile_row.updated_at else None
            }
        
        return ApiResponse[dict](
            success=True,
            data=profile_data,
            message="Profile retrieved successfully"
        )
        
    except Exception as e:
        print(f"❌ Error getting profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve profile: {str(e)}"
        )

@router.put("/profile", response_model=ApiResponse[dict])
async def update_user_profile(
    profile_update: dict,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user academic profile information in Supabase"""
    try:
        # Update the academic_profiles table directly in Supabase
        update_query = text("""
            UPDATE academic_profiles 
            SET 
                current_institution_name = :current_institution,
                current_major_name = :current_major,
                current_year = :current_year,
                target_institution_name = :target_institution,
                target_major_name = :target_major,
                expected_transfer_year = :expected_transfer_year,
                expected_transfer_quarter = :expected_transfer_quarter,
                max_units_per_quarter = :max_units_per_quarter,
                updated_at = NOW()
            WHERE user_id = :user_id
            RETURNING *
        """)
        
        # Execute the update
        result = db.execute(update_query, {
            "user_id": str(current_user.id),
            "current_institution": profile_update.get("current_institution"),
            "current_major": profile_update.get("current_major"),
            "current_year": profile_update.get("current_year"),
            "target_institution": profile_update.get("target_institution"),
            "target_major": profile_update.get("target_major"),
            "expected_transfer_year": profile_update.get("expected_transfer_year"),
            "expected_transfer_quarter": profile_update.get("expected_transfer_quarter"),
            "max_units_per_quarter": profile_update.get("max_credits_per_quarter", 15)
        })
        
        updated_row = result.fetchone()
        
        if not updated_row:
            # If no row was updated, try to create one
            insert_query = text("""
                INSERT INTO academic_profiles (
                    id, user_id, current_institution_name, current_major_name, 
                    current_year, target_institution_name, target_major_name,
                    expected_transfer_year, expected_transfer_quarter, max_units_per_quarter,
                    created_at, updated_at
                ) VALUES (
                    :id, :user_id, :current_institution, :current_major,
                    :current_year, :target_institution, :target_major,
                    :expected_transfer_year, :expected_transfer_quarter, :max_units_per_quarter,
                    NOW(), NOW()
                )
                RETURNING *
            """)
            
            result = db.execute(insert_query, {
                "id": str(uuid.uuid4()),
                "user_id": str(current_user.id),
                "current_institution": profile_update.get("current_institution"),
                "current_major": profile_update.get("current_major"),
                "current_year": profile_update.get("current_year"),
                "target_institution": profile_update.get("target_institution"),
                "target_major": profile_update.get("target_major"),
                "expected_transfer_year": profile_update.get("expected_transfer_year"),
                "expected_transfer_quarter": profile_update.get("expected_transfer_quarter"),
                "max_units_per_quarter": profile_update.get("max_credits_per_quarter", 15)
            })
            updated_row = result.fetchone()
        
        db.commit()
        
        return ApiResponse[dict](
            success=True,
            data={"message": "Profile updated successfully"},
            message="Academic profile updated successfully"
        )
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        ) 