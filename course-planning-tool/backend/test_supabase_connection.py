#!/usr/bin/env python3
"""
Test Supabase database connections locally
"""
import psycopg2
from sqlalchemy import create_engine
import os

# Your Supabase credentials
SUPABASE_PROJECT_ID = "wascvncgqbrifuhjnrfu"
POSTGRES_USER = f"postgres.{SUPABASE_PROJECT_ID}"

# You'll need to set this - get it from your Supabase dashboard
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "YOUR_ACTUAL_PASSWORD_HERE")

def test_connection(host, port, description):
    """Test a database connection"""
    print(f"\n🔍 Testing {description}")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   User: {POSTGRES_USER}")
    
    # Test with psycopg2 (direct)
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database="postgres",
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"   ✅ psycopg2 connection: SUCCESS")
    except Exception as e:
        print(f"   ❌ psycopg2 connection: FAILED - {e}")
    
    # Test with SQLAlchemy (like the backend)
    try:
        connection_string = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{host}:{port}/postgres"
        engine = create_engine(connection_string)
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
        print(f"   ✅ SQLAlchemy connection: SUCCESS")
    except Exception as e:
        print(f"   ❌ SQLAlchemy connection: FAILED - {e}")

def main():
    print("🚀 Supabase Connection Test")
    print("=" * 50)
    
    if POSTGRES_PASSWORD == "YOUR_ACTUAL_PASSWORD_HERE":
        print("❌ Please set your POSTGRES_PASSWORD!")
        print("   Export it: export POSTGRES_PASSWORD='your-actual-password'")
        print("   Or update the script with your password")
        return
    
    # Test 1: Pooler connection (what's currently failing)
    test_connection(
        host="aws-0-us-west-1.pooler.supabase.com",
        port=6543,
        description="Pooler Connection (Current - Failing)"
    )
    
    # Test 2: Direct connection (alternative)
    test_connection(
        host=f"db.{SUPABASE_PROJECT_ID}.supabase.co",
        port=5432,
        description="Direct Connection (Alternative)"
    )
    
    print("\n" + "=" * 50)
    print("🎯 Recommendation:")
    print("   Use whichever connection method shows ✅ SUCCESS")
    print("   Update your Render environment variables accordingly")

if __name__ == "__main__":
    main() 