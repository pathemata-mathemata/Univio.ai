#!/usr/bin/env python3
"""
Test Supabase database connections using exact dashboard parameters
"""
import psycopg2
from sqlalchemy import create_engine
import os

# Your exact Supabase credentials from dashboard
SUPABASE_PROJECT_ID = "wascvncgqbrifuhjnrfu"
POSTGRES_USER = f"postgres.{SUPABASE_PROJECT_ID}"
POSTGRES_PASSWORD = "sejjyg-purwoh-8foWko"  # From your previous message
POSTGRES_DB = "postgres"

def test_connection(connection_string, description):
    """Test a database connection using connection string"""
    print(f"\n🔍 Testing {description}")
    print(f"   Connection: {connection_string.replace(POSTGRES_PASSWORD, '****')}")
    
    # Test with psycopg2 (direct)
    try:
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"   ✅ psycopg2 connection: SUCCESS")
        print(f"   📝 Database version: {result[0][:50]}...")
        return True
    except Exception as e:
        print(f"   ❌ psycopg2 connection: FAILED - {e}")
        return False

def main():
    print("🚀 Supabase Connection Test v2 (Using Dashboard Parameters)")
    print("=" * 70)
    
    # From your dashboard screenshot - Transaction pooler connection
    transaction_pooler = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/{POSTGRES_DB}"
    
    # Session pooler (direct) - extracting from your dashboard
    session_pooler = f"postgresql://postgres:{POSTGRES_PASSWORD}@db.{SUPABASE_PROJECT_ID}.supabase.co:5432/{POSTGRES_DB}"
    
    # Test both methods
    success_count = 0
    
    if test_connection(transaction_pooler, "Transaction Pooler (From Dashboard)"):
        success_count += 1
        print("   🎯 USE THIS FOR RENDER: aws-0-us-west-1.pooler.supabase.com:6543")
    
    if test_connection(session_pooler, "Session Pooler (Direct Connection)"):
        success_count += 1
        print("   🎯 USE THIS FOR RENDER: db.wascvncgqbrifuhjnrfu.supabase.co:5432")
    
    print("\n" + "=" * 70)
    if success_count > 0:
        print("🎉 SUCCESS! At least one connection method works!")
        print("🔧 Update your Render environment variables with the working connection.")
    else:
        print("❌ Both connections failed. There might be a project-level issue.")
        print("💡 Check if your Supabase project is active and not paused.")
    
    print("\n📋 For Render, set these environment variables:")
    print("   POSTGRES_USER=postgres.wascvncgqbrifuhjnrfu")
    print("   POSTGRES_PASSWORD=sejjyg-purwoh-8foWko")
    print("   POSTGRES_DB=postgres")
    print("   POSTGRES_HOST=[use the successful host above]")
    print("   POSTGRES_PORT=[use the successful port above]")

if __name__ == "__main__":
    main() 