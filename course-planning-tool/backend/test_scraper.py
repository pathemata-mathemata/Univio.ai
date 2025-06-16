import sys
sys.path.append('.')
from app.scrapers.assist_scraper import scrape_assist_data
import json

def test_scraper():
    print("=== TESTING ASSIST.ORG SCRAPER ===")
    
    # Test parameters - using correct full institution names
    academic_year = "2024-2025"
    source_institution = "De Anza College"
    target_institution = "University of California, Berkeley"  # Full official name
    major = "Computer Science"
    
    print(f"Academic Year: {academic_year}")
    print(f"Source Institution: {source_institution}")
    print(f"Target Institution: {target_institution}")
    print(f"Major: {major}")
    print()
    
    try:
        print("🔄 Starting scraper...")
        result = scrape_assist_data(
            academic_year=academic_year,
            institution=source_institution,
            target_institution=target_institution,
            major_filter=major
        )
        
        print(f"\n=== SCRAPER RESULTS ===")
        print(f"Success: {result.get('success', False)}")
        
        if result.get('success'):
            data = result.get('data', {})
            print(f"Data keys: {list(data.keys())}")
            
            # Examine source requirements (courses at current institution)
            source_requirements = data.get('source_requirements', {})
            print(f"\n📚 SOURCE REQUIREMENTS ({source_institution}):")
            print(f"Categories found: {len(source_requirements)}")
            
            for category, courses in source_requirements.items():
                print(f"\n  📖 {category}:")
                print(f"    Type: {type(courses)}")
                print(f"    Content preview: {str(courses)[:200]}...")
                
                # Try to count courses in this category
                course_count = 0
                if isinstance(courses, list):
                    for option_group in courses:
                        if isinstance(option_group, list):
                            course_count += len(option_group)
                        elif isinstance(option_group, dict):
                            course_count += 1
                elif isinstance(courses, dict):
                    if 'courses' in courses:
                        course_count = len(courses['courses'])
                    else:
                        course_count = 1
                
                print(f"    Estimated courses: {course_count}")
            
            # Examine target requirements (courses at target institution)
            target_requirements = data.get('target_requirements', {})
            print(f"\n🎯 TARGET REQUIREMENTS ({target_institution}):")
            print(f"Categories found: {len(target_requirements)}")
            
            for category, courses in list(target_requirements.items())[:3]:  # Show first 3 categories
                print(f"\n  📖 {category}:")
                print(f"    Type: {type(courses)}")
                print(f"    Content preview: {str(courses)[:200]}...")
            
            # Show full JSON structure (truncated)
            print(f"\n=== FULL DATA STRUCTURE (first 1000 chars) ===")
            json_str = json.dumps(result, indent=2)
            print(json_str[:1000] + "..." if len(json_str) > 1000 else json_str)
            
        else:
            error = result.get('error', 'Unknown error')
            print(f"❌ Scraper failed: {error}")
            
            # Show any partial data
            if 'data' in result:
                print(f"Partial data keys: {list(result['data'].keys())}")
    
    except Exception as e:
        print(f"❌ Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_scraper() 