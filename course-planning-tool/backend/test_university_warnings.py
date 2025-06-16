import asyncio
import sys
sys.path.append('.')
from app.services.ai_planning_service import AIPlanningService

# Test data with university-only requirements
test_context = {
    'profile': {
        'current_institution': 'De Anza College',
        'target_institution': 'University of California, Berkeley', 
        'current_major': 'Computer Science',
        'target_major': 'Computer Science',
        'current_quarter': 'Fall',
        'current_year': '2024'
    },
    'completed_courses': [],
    'transfer_requirements': {
        'source_requirements': {
            'COMPSCI 61A': [  # No course articulated
                [
                    {'code': 'NO_COURSE', 'title': 'No Course Articulated', 'units': ''}
                ]
            ],
            'COMPSCI 70': [  # Must be taken at university
                [
                    {'code': 'COMPSCI 70', 'title': 'This course must be taken at the university after transfer', 'units': '4'}
                ]
            ],
            'COMPSCI 61B': [  # Has articulation options
                [
                    {'code': 'CIS 22C', 'title': 'Data Abstraction and Structures', 'units': 4.5}
                ],
                [
                    {'code': 'CIS 22CH', 'title': 'Data Abstraction and Structures - HONORS', 'units': 4.5}
                ]
            ],
            'MATH 1B': [  # Regular course available
                [
                    {'code': 'MATH 1B', 'title': 'Calculus II', 'units': 5}
                ]
            ]
        }
    },
    'preferences': {
        'units_per_quarter': 15
    }
}

async def test_university_warnings():
    print('=== TESTING UNIVERSITY-ONLY REQUIREMENTS ===')
    print('Expected: COMPSCI 61A and COMPSCI 70 should generate warnings')
    print('Expected: CIS 22C/22CH and MATH 1B should be available for selection')
    print()
    
    service = AIPlanningService()
    result = await service.generate_quarter_schedule(test_context)
    
    print('=== RESULTS ===')
    print(f'Quarter: {result["quarter"]["quarter_name"]}')
    print(f'Total Units: {result["quarter"]["total_units"]}')
    
    print('\nSelected Courses:')
    for course in result['quarter']['courses']:
        print(f'  • {course["course_code"]}: {course["course_name"]} ({course["units"]} units)')
    
    print('\nWarnings:')
    warnings = result['quarter'].get('warnings', [])
    if warnings:
        for warning in warnings:
            print(f'  ⚠️ {warning}')
    else:
        print('  No warnings found')
    
    print('\nRecommendations:')
    for rec in result['recommendations']:
        print(f'  - {rec}')
    
    print('\n=== VERIFICATION ===')
    if warnings:
        print(f'✅ Found {len(warnings)} warning(s) about university-only requirements')
        
        # Check for specific warnings
        has_no_articulation = any('No course articulated' in w for w in warnings)
        has_university_only = any('must be taken at' in w for w in warnings)
        
        if has_no_articulation:
            print('✅ Warning about "No Course Articulated" found')
        if has_university_only:
            print('✅ Warning about "must be taken at university" found')
    else:
        print('❌ No warnings found - university-only requirements not detected')
    
    # Check that available courses were still selected
    selected_codes = [c['course_code'] for c in result['quarter']['courses']]
    if any('CIS' in code for code in selected_codes):
        print('✅ Available CIS courses were selected')
    if 'MATH 1B' in selected_codes:
        print('✅ MATH 1B was selected')

if __name__ == "__main__":
    asyncio.run(test_university_warnings()) 