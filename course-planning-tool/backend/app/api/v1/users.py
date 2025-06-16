from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.services.auth_service import AuthService
from app.schemas.common import ApiResponse
from typing import Dict, Any
import uuid
import httpx
import os

router = APIRouter()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

@router.get("/")
async def get_users():
    return {"message": "users endpoint"}

@router.get("/profile", response_model=ApiResponse[dict])
async def get_user_profile(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive user profile including academic information from Supabase via REST API"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise Exception("Supabase configuration not found")
        
        # Query the academic_profiles table via Supabase REST API
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        # Make request to Supabase REST API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/academic_profiles?user_id=eq.{current_user.id}&select=*",
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"❌ Supabase API error: {response.status_code} - {response.text}")
                academic_profiles = []
            else:
                academic_profiles = response.json()
        
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
        if academic_profiles and len(academic_profiles) > 0:
            profile = academic_profiles[0]  # Get first profile
            profile_data["academic_profile"] = {
                "id": profile.get("id"),
                "current_institution": profile.get("current_institution_name"),
                "current_major": profile.get("current_major_name"),
                "current_gpa": profile.get("current_gpa"),
                "current_quarter": profile.get("current_quarter"),
                "current_year": profile.get("current_year"),
                "target_institution": profile.get("target_institution_name"),
                "target_major": profile.get("target_major_name"),
                "expected_transfer_year": profile.get("expected_transfer_year"),
                "expected_transfer_quarter": profile.get("expected_transfer_quarter"),
                "max_credits_per_quarter": profile.get("max_units_per_quarter", 15),
                "created_at": profile.get("created_at"),
                "updated_at": profile.get("updated_at")
            }
        
        print(f"✅ Profile retrieved for user {current_user.id}: found {len(academic_profiles)} academic profiles")
        
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
    """Update user academic profile information in Supabase via REST API"""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise Exception("Supabase configuration not found")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Update data
        update_data = {
            "current_institution_name": profile_update.get("current_institution"),
            "current_major_name": profile_update.get("current_major"),
            "current_year": profile_update.get("current_year"),
            "target_institution_name": profile_update.get("target_institution"),
            "target_major_name": profile_update.get("target_major"),
            "expected_transfer_year": profile_update.get("expected_transfer_year"),
            "expected_transfer_quarter": profile_update.get("expected_transfer_quarter"),
            "max_units_per_quarter": profile_update.get("max_credits_per_quarter", 15),
            "updated_at": "now()"
        }
        
        # Make request to Supabase REST API to update
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{SUPABASE_URL}/rest/v1/academic_profiles?user_id=eq.{current_user.id}",
                headers=headers,
                json=update_data
            )
            
            if response.status_code == 200:
                print(f"✅ Profile updated for user {current_user.id}")
            elif response.status_code == 406:  # No rows updated
                # Try to create a new profile
                create_data = {
                    "id": str(uuid.uuid4()),
                    "user_id": str(current_user.id),
                    **update_data
                }
                
                create_response = await client.post(
                    f"{SUPABASE_URL}/rest/v1/academic_profiles",
                    headers=headers,
                    json=create_data
                )
                
                if create_response.status_code not in [200, 201]:
                    raise Exception(f"Failed to create profile: {create_response.text}")
                    
                print(f"✅ Profile created for user {current_user.id}")
            else:
                raise Exception(f"Failed to update profile: {response.text}")
        
        return ApiResponse[dict](
            success=True,
            data={"message": "Profile updated successfully"},
            message="Academic profile updated successfully"
        )
        
    except Exception as e:
        print(f"❌ Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        ) 