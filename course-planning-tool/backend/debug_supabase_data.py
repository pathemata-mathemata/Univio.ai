#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db
from sqlalchemy import text

def check_supabase_data():
    db = next(get_db())
    
    try:
        print("🔍 Checking Supabase academic_profiles table...")
        
        # Check table structure
        structure_query = text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'academic_profiles'
            ORDER BY ordinal_position
        """)
        
        structure_result = db.execute(structure_query)
        columns = structure_result.fetchall()
        
        print(f"\n📋 Table Structure (academic_profiles):")
        for col in columns:
            print(f"  - {col.column_name}: {col.data_type} ({'NULL' if col.is_nullable == 'YES' else 'NOT NULL'})")
        
        # Check for data
        data_query = text("""
            SELECT 
                id,
                user_id,
                current_institution_name,
                current_major_name,
                target_institution_name,
                target_major_name,
                created_at
            FROM academic_profiles 
            ORDER BY created_at DESC
            LIMIT 5
        """)
        
        data_result = db.execute(data_query)
        profiles = data_result.fetchall()
        
        print(f"\n📊 Data in academic_profiles ({len(profiles)} rows found):")
        for profile in profiles:
            print(f"  - ID: {profile.id}")
            print(f"    User ID: {profile.user_id}")
            print(f"    Current: {profile.current_institution_name} - {profile.current_major_name}")
            print(f"    Target: {profile.target_institution_name} - {profile.target_major_name}")
            print(f"    Created: {profile.created_at}")
            print()
        
        # Check users table
        print("👥 Checking users table...")
        users_query = text("SELECT id, email, name, edu_email FROM users LIMIT 5")
        users_result = db.execute(users_query)
        users = users_result.fetchall()
        
        print(f"📊 Data in users table ({len(users)} rows found):")
        for user in users:
            print(f"  - ID: {user.id}, Email: {user.email}, Name: {user.name}")
        
        if len(profiles) > 0 and len(users) == 0:
            print("\n⚠️  ISSUE IDENTIFIED:")
            print("   - Academic profiles exist in Supabase")
            print("   - But no corresponding users in users table")
            print("   - This is why authentication fails")
            print("\n💡 SOLUTION: Need to create users from academic_profiles data")
        
    except Exception as e:
        print(f"❌ Error checking data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_supabase_data() 