#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path to import assist_scraper
sys.path.append(os.path.dirname(__file__))

from assist_scraper import scrape_assist_data

def test_scraper_only():
    """Test only the ASSIST.org scraper with user's exact parameters"""
    
    print("🔍 TESTING ASSIST.ORG SCRAPER ONLY")
    print("="*50)
    print("📋 Parameters:")
    print("   • Academic Year: 2024-2025")
    print("   • Institution: De Anza College")
    print("   • Target: University of California, Berkeley")
    print("   • Major: Applied Math")
    print("="*50)
    
    try:
        # Test the scraper with exact parameters
        result = scrape_assist_data(
            academic_year="2024-2025",
            institution="De Anza College", 
            target_institution="University of California, Berkeley",
            major_filter="Applied Math"
        )
        
        if result:
            print("\n✅ SCRAPER SUCCESS!")
            print(f"📊 Result keys: {list(result.keys())}")
            
            if 'source_requirements' in result:
                source_reqs = result['source_requirements']
                print(f"📚 Source requirements found: {len(source_reqs)} sections")
                for key, value in source_reqs.items():
                    print(f"   • {key}: {len(value) if isinstance(value, list) else 'N/A'} options")
            
            if 'target_requirements' in result:
                target_reqs = result['target_requirements']
                print(f"🎯 Target requirements found: {len(target_reqs)} sections")
                for section in target_reqs:
                    print(f"   • Section {section.get('number', '?')}: {section.get('title', 'Unknown')}")
            
            print(f"\n📋 Academic Year: {result.get('academic_year', 'N/A')}")
            print(f"🏫 Source: {result.get('source_institution', 'N/A')}")
            print(f"🎓 Target: {result.get('target_institution', 'N/A')}")
            print(f"📖 Major: {result.get('major', 'N/A')}")
            
        else:
            print("\n❌ SCRAPER FAILED!")
            print("No data returned from scraper")
            
    except Exception as e:
        print(f"\n❌ SCRAPER ERROR: {str(e)}")
        print("The scraper encountered an error during execution")

if __name__ == "__main__":
    test_scraper_only() 