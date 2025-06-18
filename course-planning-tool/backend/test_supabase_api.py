#!/usr/bin/env python3
"""
Test backend connection using Supabase API (like frontend)
"""
import requests
import json

# Your Supabase credentials
SUPABASE_URL = "https://wascvncgqbrifujnrfu.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2N2bmNncWJyaWZ1aGpucmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDA1MDUsImV4cCI6MjA1MDI3NjUwNX0.evJbGCi0iJTu1IN1IaInR5C6I6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2N2bmNncWJyaWZ1aGpucmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDA1MDUsImV4cCI6MjA1MDI3NjUwNX0.evJbGCi0iJTu1IN1IaInR5C6I6IkpXVCJ9"

def test_supabase_api():
    """Test Supabase API connection (same as frontend)"""
    print("🔍 Testing Supabase API Connection (Same as Frontend)")
    print("=" * 60)
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    # Test 1: Check users table
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/users?select=count",
            headers=headers
        )
        if response.status_code == 200:
            print("✅ Users table access: SUCCESS")
            print(f"   Status: {response.status_code}")
        else:
            print(f"❌ Users table access: FAILED - {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Users table access: FAILED - {e}")
    
    # Test 2: Check academic_profiles table
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/academic_profiles?select=count",
            headers=headers
        )
        if response.status_code == 200:
            print("✅ Academic profiles access: SUCCESS")
        else:
            print(f"❌ Academic profiles access: FAILED - {response.status_code}")
    except Exception as e:
        print(f"❌ Academic profiles access: FAILED - {e}")
    
    # Test 3: Check dashboard_metrics table
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/dashboard_metrics?select=count",
            headers=headers
        )
        if response.status_code == 200:
            print("✅ Dashboard metrics access: SUCCESS")
        else:
            print(f"❌ Dashboard metrics access: FAILED - {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard metrics access: FAILED - {e}")
    
    print("\n" + "=" * 60)
    print("💡 If these work, your backend should use Supabase API instead of direct PostgreSQL!")
    print("🔧 This is the same method your frontend uses successfully.")

if __name__ == "__main__":
    test_supabase_api() 