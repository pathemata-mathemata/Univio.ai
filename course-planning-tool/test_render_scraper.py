#!/usr/bin/env python3
"""
Test script for the ASSIST.org scraper on Render deployment
"""

import requests
import json
import time

# Render backend URL
BASE_URL = "https://univio-ai-backend.onrender.com"

def test_health():
    """Test if the backend is responding"""
    try:
        print("🔍 Testing backend health...")
        response = requests.get(f"{BASE_URL}/health", timeout=30)
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check error: {e}")
        return False

def test_chrome_status():
    """Test Chrome/Chromium installation status"""
    try:
        print("🔍 Testing Chrome/Chromium status...")
        response = requests.get(f"{BASE_URL}/api/v1/debug/chrome-status", timeout=30)
        if response.status_code == 200:
            data = response.json()
            print("✅ Chrome status retrieved!")
            print(f"📊 Chrome Status:")
            print(json.dumps(data, indent=2))
            return True
        else:
            print(f"❌ Chrome status check failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chrome status check error: {e}")
        return False

def test_transfer_analysis():
    """Test the transfer analysis endpoint"""
    try:
        print("🔍 Testing transfer analysis...")
        
        # Test data
        test_payload = {
            "currentCollege": "De Anza College",
            "targetUniversity": "University of California, Berkeley", 
            "major": "Applied Math",
            "academicYear": "2024-2025"
        }
        
        print(f"📤 Sending request with payload:")
        print(json.dumps(test_payload, indent=2))
        
        response = requests.post(
            f"{BASE_URL}/api/v1/transfer/analyze",
            json=test_payload,
            timeout=120  # Longer timeout for scraping
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Transfer analysis successful!")
            print(f"📊 Analysis Result:")
            print(f"   Success: {data.get('success', 'Unknown')}")
            print(f"   Has fallback: {data.get('has_fallback', 'Unknown')}")
            print(f"   Sections: {len(data.get('sections', []))}")
            
            # Print first few requirements if available
            sections = data.get('sections', [])
            if sections:
                print(f"📋 First requirement section:")
                first_section = sections[0]
                print(f"   Number: {first_section.get('number', 'N/A')}")
                print(f"   Title: {first_section.get('title', 'N/A')}")
                print(f"   Structure: {first_section.get('structure', 'N/A')}")
            
            return True
        else:
            print(f"❌ Transfer analysis failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Transfer analysis error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Render Scraper Deployment")
    print("=" * 50)
    
    # Test 1: Health check
    if not test_health():
        print("💥 Backend not responding. Deployment might still be building...")
        return
    
    print("\n" + "=" * 50)
    
    # Test 2: Chrome status  
    chrome_ok = test_chrome_status()
    
    print("\n" + "=" * 50)
    
    # Test 3: Transfer analysis (run regardless of Chrome status)
    transfer_ok = test_transfer_analysis()
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"   Health: ✅")
    print(f"   Chrome: {'✅' if chrome_ok else '❌'}")
    print(f"   Transfer: {'✅' if transfer_ok else '❌'}")
    
    if transfer_ok:
        print("\n🎉 Scraper is working on Render!")
    else:
        print("\n🔧 Scraper needs debugging on Render")

if __name__ == "__main__":
    main() 