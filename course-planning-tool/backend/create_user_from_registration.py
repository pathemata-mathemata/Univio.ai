#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash
import uuid

def create_user_from_registration():
    """Create a user in the backend that matches the frontend registration"""
    db = next(get_db())
    
    try:
        # This should match your registration data
        email = "charleslee200607@gmail.com"  # Your personal email from registration
        edu_email = "20596019@fhda.edu"  # Your edu email from registration
        name = "Charles Lee"  # Your name from registration
        password = "demo123"  # You'll need to set a password
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            print(f'User {email} already exists in backend')
            return existing_user
        
        # Create user
        hashed_password = get_password_hash(password)
        user = User(
            email=email,
            name=name,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=True,
            edu_email=edu_email,
            edu_email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f'✅ User created successfully!')
        print(f'   ID: {user.id}')
        print(f'   Email: {user.email}')
        print(f'   Edu Email: {user.edu_email}')
        print(f'   Password: {password}')
        print(f'\n🎯 Now you can login with:')
        print(f'   Email: {email}')
        print(f'   Password: {password}')
        
        return user
        
    except Exception as e:
        print(f'❌ Error creating user: {e}')
        db.rollback()
        return None
    finally:
        db.close()

if __name__ == "__main__":
    create_user_from_registration() 