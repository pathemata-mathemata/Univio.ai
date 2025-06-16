#!/usr/bin/env python3

from app.core.database import get_db
from app.models.user import User
from app.models.student_profile import StudentProfile, Quarter
from app.core.security import get_password_hash

def create_demo_user():
    db = next(get_db())
    
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.email == 'demo@univio.ai').first()
        
        if demo_user:
            print('Demo user already exists')
            return
        
        # Create demo user
        hashed_password = get_password_hash('demo123')
        demo_user = User(
            email='demo@univio.ai',
            name='Demo User',
            hashed_password=hashed_password,
            is_active=True,
            is_verified=True,
            edu_email='demo@student.edu',
            edu_email_verified=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        # Create academic profile
        profile = StudentProfile(
            user_id=demo_user.id,
            current_institution='De Anza College',
            current_major='Applied Mathematics',
            current_quarter=Quarter.FALL,
            current_year=2025,
            target_institution='University of California, Berkeley',
            target_major='Applied Mathematics',
            expected_transfer_year=2026,
            expected_transfer_quarter=Quarter.FALL
        )
        db.add(profile)
        db.commit()
        
        print('Demo user created successfully!')
        print('Email: demo@univio.ai')
        print('Password: demo123')
        
    except Exception as e:
        print(f'Error creating demo user: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    create_demo_user() 