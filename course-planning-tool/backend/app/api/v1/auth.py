from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserCreateExtended, UserLogin, 
    TokenResponse, TokenResponseExtended, UserResponse, UserResponseExtended,
    EduEmailVerificationRequest, EduEmailVerificationResponse, EduEmailVerifyCode
)
from app.services.auth_service import AuthService

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user (original endpoint for backwards compatibility)"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/register-extended", response_model=TokenResponseExtended)
async def register_extended(
    user_data: UserCreateExtended,
    db: Session = Depends(get_db)
):
    """Register a new user with extended profile information"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Check if edu email is already used
    if user_data.eduEmail:
        existing_edu_user = db.query(User).filter(User.edu_email == user_data.eduEmail).first()
        if existing_edu_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This educational email is already registered"
            )
    
    # Create new user with extended data
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        edu_email=user_data.eduEmail,
        edu_email_verified=user_data.eduEmailVerified
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create student profile if provided
    if user_data.profile:
        from app.models.student_profile import StudentProfile, Quarter
        profile = StudentProfile(
            user_id=user.id,
            current_institution=user_data.profile.currentInstitution,
            current_major=user_data.profile.currentMajor,
            current_quarter=Quarter(user_data.profile.currentQuarter),
            current_year=user_data.profile.currentYear,
            expected_transfer_year=user_data.profile.expectedTransferYear,
            expected_transfer_quarter=Quarter(user_data.profile.expectedTransferQuarter),
            target_institution=user_data.profile.targetInstitution,
            target_major=user_data.profile.targetMajor,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return TokenResponseExtended(
        access_token=access_token,
        user=UserResponseExtended.from_orm(user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access token"""
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/logout")
async def logout():
    """Logout user (token invalidation handled on frontend)"""
    return {"message": "Successfully logged out"}

@router.post("/send-edu-verification", response_model=EduEmailVerificationResponse)
async def send_edu_verification(
    request: EduEmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """Send verification code to educational email"""
    # Validate .edu email format
    import re
    edu_email_pattern = r'^[^@]+@[^@]+\.edu$'
    if not re.match(edu_email_pattern, request.eduEmail):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid .edu email address"
        )
    
    # Check if edu email is already registered
    existing_user = db.query(User).filter(User.edu_email == request.eduEmail).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This educational email is already registered"
        )
    
    # TODO: Implement actual email sending logic
    # For now, we'll simulate sending a verification code
    # In production, you would:
    # 1. Generate a 6-digit verification code
    # 2. Store it in Redis or database with expiration
    # 3. Send email using your email service (SendGrid, AWS SES, etc.)
    
    return EduEmailVerificationResponse(
        message=f"Verification code sent to {request.eduEmail}",
        verification_sent=True
    )

@router.post("/verify-edu-email")
async def verify_edu_email(
    request: EduEmailVerifyCode,
    db: Session = Depends(get_db)
):
    """Verify educational email with code"""
    # TODO: Implement actual code verification
    # For now, accept any 6-digit code for demo purposes
    if len(request.code) != 6 or not request.code.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # In production, you would:
    # 1. Check if the code matches what was sent
    # 2. Check if the code hasn't expired
    # 3. Mark the email as verified
    
    return {"message": "Educational email verified successfully", "verified": True}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(AuthService.get_current_user)
):
    """Get current user information"""
    return UserResponse.from_orm(current_user) 