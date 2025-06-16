#!/usr/bin/env python3
"""
Simple script to test database connection
Run this to verify your database credentials are working
"""

import os
import sys
from sqlalchemy import create_engine, text

def test_db_connection():
    """Test database connection with current environment variables"""
    
    # Get environment variables
    supabase_url = os.getenv('SUPABASE_URL')
    postgres_user = os.getenv('POSTGRES_USER')
    postgres_password = os.getenv('POSTGRES_PASSWORD')
    postgres_host = os.getenv('POSTGRES_HOST', 'aws-0-us-east-1.pooler.supabase.com')
    postgres_port = os.getenv('POSTGRES_PORT', '6543')
    postgres_db = os.getenv('POSTGRES_DB', 'postgres')
    
    print("🔍 Database Connection Test")
    print("=" * 50)
    print(f"Supabase URL: {supabase_url}")
    print(f"Postgres User: {postgres_user}")
    print(f"Postgres Host: {postgres_host}")
    print(f"Postgres Port: {postgres_port}")
    print(f"Postgres DB: {postgres_db}")
    print(f"Password: {'***' if postgres_password else 'NOT SET'}")
    print("=" * 50)
    
    # Check if we have required credentials
    if not all([supabase_url, postgres_user, postgres_password]):
        print("❌ Missing required environment variables:")
        if not supabase_url: print("  - SUPABASE_URL")
        if not postgres_user: print("  - POSTGRES_USER")
        if not postgres_password: print("  - POSTGRES_PASSWORD")
        return False
    
    # Construct connection string
    connection_string = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"
    print(f"Connection string: postgresql://{postgres_user}:****@{postgres_host}:{postgres_port}/{postgres_db}")
    
    try:
        # Create engine and test connection
        engine = create_engine(connection_string)
        
        print("\n🔄 Testing connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.scalar()
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version}")
            
            # Test a simple query
            result = conn.execute(text("SELECT current_database(), current_user;"))
            db_info = result.fetchone()
            print(f"Database: {db_info[0]}")
            print(f"User: {db_info[1]}")
            
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check if your Supabase project is active")
        print("2. Verify the database password is correct")
        print("3. Ensure your IP is allowed (Supabase allows all by default)")
        print("4. Check if the project ID in POSTGRES_USER matches your Supabase URL")
        return False

if __name__ == "__main__":
    success = test_db_connection()
    sys.exit(0 if success else 1) 