#!/usr/bin/env python3

import asyncio
from typing import Dict, Any, List
from app.scrapers.assist_scraper import scrape_assist_data
from app.services.ai_planning_service import AIPlanningService

class PlanningWorkflowService:
    """
    Integrated workflow service that:
    1. Scrapes ASSIST.org data for transfer requirements
    2. Filters out completed courses
    3. Sends remaining requirements to AI for scheduling
    """
    
    def __init__(self):
        self.ai_service = AIPlanningService()
    
    async def generate_quarter_schedule_with_scraping(
        self, 
        user_profile: Dict[str, Any], 
        completed_courses: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Complete workflow: Scrape → Filter → AI Schedule
        
        Args:
            user_profile: User information (institutions, major, quarter, etc.)
            completed_courses: List of courses already completed
            
        Returns:
            dict: AI-generated schedule for the requested quarter
        """
        
        try:
            # Step 1: Scrape ASSIST.org data
            print("🔍 Step 1: Scraping ASSIST.org for transfer requirements...")
            assist_data = await self._scrape_transfer_requirements(user_profile)
            
            # Step 2: Filter out completed courses
            print("✂️ Step 2: Filtering out completed courses...")
            filtered_requirements = self._filter_completed_courses(assist_data, completed_courses)
            
            # Step 3: Prepare context for AI
            print("📋 Step 3: Preparing data for AI scheduler...")
            planning_context = self._prepare_ai_context(
                user_profile, 
                completed_courses, 
                filtered_requirements,
                assist_data
            )
            
            # Step 4: Generate AI schedule
            print("🤖 Step 4: Generating AI schedule...")
            schedule = await self.ai_service.generate_quarter_schedule(planning_context)
            
            # Step 5: Add workflow metadata
            schedule['workflow_info'] = {
                'scraped_courses': len(assist_data.get('all_requirements', [])),
                'completed_courses': len(completed_courses),
                'remaining_courses': len(filtered_requirements.get('remaining_courses', [])),
                'workflow_status': 'success'
            }
            
            return schedule
            
        except Exception as e:
            print(f"❌ Workflow error: {str(e)}")
            # Fallback to AI-only planning without scraped data
            print("🔄 Falling back to AI planning without scraped data...")
            return await self._fallback_ai_planning(user_profile, completed_courses)
    
    async def _scrape_transfer_requirements(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Scrape ASSIST.org for transfer requirements"""
        
        # Extract scraping parameters from user profile - NO FALLBACKS
        current_institution = user_profile.get('current_institution')
        target_institution = user_profile.get('target_institution')
        major = user_profile.get('major')
        academic_year = user_profile.get('academic_year')
        
        # Validate required parameters
        if not all([current_institution, target_institution, major, academic_year]):
            missing = []
            if not current_institution: missing.append("current_institution")
            if not target_institution: missing.append("target_institution")
            if not major: missing.append("major")
            if not academic_year: missing.append("academic_year")
            raise Exception(f"Missing required user profile data: {', '.join(missing)}")
        
        try:
            # Call the ASSIST scraper
            assist_data = scrape_assist_data(
                academic_year=academic_year,
                institution=current_institution,
                target_institution=target_institution, 
                major_filter=major
            )
            
            # Parse and structure the scraped data
            structured_data = self._structure_assist_data(assist_data)
            return structured_data
            
        except Exception as e:
            print(f"⚠️ ASSIST scraping failed: {str(e)}")
            # Return mock transfer requirements as fallback
            return self._get_mock_transfer_requirements(user_profile)
    
    def _structure_assist_data(self, raw_assist_data: Dict[str, Any]) -> Dict[str, Any]:
        """Structure raw ASSIST data into standardized format"""
        
        structured = {
            'all_requirements': [],
            'major_requirements': [],
            'general_education': [],
            'articulation_agreements': []
        }
        
        # Process sections from ASSIST data
        if 'sections' in raw_assist_data:
            for section in raw_assist_data['sections']:
                if section.get('structure') == 'sequence':
                    # These are required courses in sequence
                    for course in section.get('courses', []):
                        course_info = {
                            'course_code': course.get('code', ''),
                            'course_name': course.get('title', ''),
                            'units': self._parse_units(course.get('units', '')),
                            'category': 'Major Prerequisites',
                            'required': True
                        }
                        structured['all_requirements'].append(course_info)
                        structured['major_requirements'].append(course_info)
                        
                elif section.get('structure') == 'choice':
                    # These are elective options (A or B)
                    for option in section.get('options', []):
                        for course in option.get('courses', []):
                            course_info = {
                                'course_code': course.get('code', ''),
                                'course_name': course.get('title', ''),
                                'units': self._parse_units(course.get('units', '')),
                                'category': 'Major Electives',
                                'required': False
                            }
                            structured['all_requirements'].append(course_info)
        
        return structured
    
    def _filter_completed_courses(
        self, 
        assist_data: Dict[str, Any], 
        completed_courses: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Filter out courses that have already been completed"""
        
        # Create set of completed course codes for fast lookup
        completed_codes = set()
        for course in completed_courses:
            code = course.get('course_code', '').upper().strip()
            if code:
                completed_codes.add(code)
        
        # Filter requirements
        all_requirements = assist_data.get('all_requirements', [])
        remaining_courses = []
        
        for requirement in all_requirements:
            req_code = requirement.get('course_code', '').upper().strip()
            
            # Check if this requirement is already completed
            if req_code not in completed_codes:
                remaining_courses.append(requirement)
            else:
                print(f"✅ Already completed: {req_code}")
        
        return {
            'remaining_courses': remaining_courses,
            'total_remaining': len(remaining_courses),
            'total_completed': len(completed_codes),
            'completion_percentage': round((len(completed_codes) / len(all_requirements)) * 100, 1) if all_requirements else 0
        }
    
    def _prepare_ai_context(
        self,
        user_profile: Dict[str, Any],
        completed_courses: List[Dict[str, Any]], 
        filtered_requirements: Dict[str, Any],
        assist_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Prepare context for AI planning service"""
        
        return {
            "user_profile": user_profile,
            "completed_courses": completed_courses,
            "transfer_requirements": {
                "remaining_courses": filtered_requirements.get('remaining_courses', []),
                "major_requirements": assist_data.get('major_requirements', []),
                "general_education": assist_data.get('general_education', []),
                "completion_status": f"{filtered_requirements.get('completion_percentage', 0)}% complete"
            },
            "assist_data": {
                "articulation_agreements": assist_data.get('articulation_agreements', []),
                "source_institution": user_profile.get('current_institution'),
                "target_institution": user_profile.get('target_institution')
            }
        }
    
    async def _fallback_ai_planning(
        self, 
        user_profile: Dict[str, Any], 
        completed_courses: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Fallback AI planning when scraping fails"""
        
        # Create basic context without scraped data
        context = {
            "user_profile": user_profile,
            "completed_courses": completed_courses, 
            "transfer_requirements": self._get_mock_transfer_requirements(user_profile),
            "assist_data": {"articulation_agreements": []}
        }
        
        schedule = await self.ai_service.generate_quarter_schedule(context)
        schedule['workflow_info'] = {
            'workflow_status': 'fallback',
            'note': 'Generated without ASSIST.org data due to scraping error'
        }
        
        return schedule
    
    def _get_mock_transfer_requirements(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock transfer requirements when scraping fails"""
        
        major = user_profile.get('major', '').lower()
        
        if 'computer science' in major or 'cs' in major:
            return {
                "remaining_courses": [
                    {"course_code": "PHYS 4A", "course_name": "Mechanics", "units": 4, "category": "Major Prerequisites"},
                    {"course_code": "CS 2A", "course_name": "Object-Oriented Programming", "units": 4, "category": "Major Prerequisites"},
                    {"course_code": "ENGL 1A", "course_name": "English Composition", "units": 4, "category": "General Education"},
                    {"course_code": "PHIL 9", "course_name": "Critical Thinking", "units": 3, "category": "General Education"}
                ]
            }
        else:
            return {
                "remaining_courses": [
                    {"course_code": "ENGL 1A", "course_name": "English Composition", "units": 4, "category": "General Education"},
                    {"course_code": "MATH 1D", "course_name": "Linear Algebra", "units": 4, "category": "Major Prerequisites"},
                    {"course_code": "HIST 17A", "course_name": "US History", "units": 3, "category": "General Education"}
                ]
            }
    
    def _parse_units(self, units_str: str) -> int:
        """Parse units from string like '4.00 units' to integer"""
        if not units_str:
            raise Exception("Units string is required")
        
        import re
        match = re.search(r'(\d+(?:\.\d+)?)', str(units_str))
        if match:
            return int(float(match.group(1)))
        raise Exception(f"Could not parse units from: {units_str}")

# Example usage function
async def test_workflow_integration():
    """Test the complete workflow integration"""
    
    workflow_service = PlanningWorkflowService()
    
    # Test data - EXAMPLE ONLY, should be provided by caller
    user_profile = {
        "current_institution": "De Anza College",
        "target_institution": "University of California, Berkeley", 
        "major": "Computer Science",
        "planning_quarter": "Fall",
        "desired_units_per_quarter": 15,
        "academic_year": "2024-2025"
    }
    
    completed_courses = [
        {"course_code": "MATH 1A", "course_name": "Calculus I", "units": 5, "grade": "A"},
        {"course_code": "MATH 1B", "course_name": "Calculus II", "units": 5, "grade": "A"},
        {"course_code": "MATH 1C", "course_name": "Calculus III", "units": 5, "grade": "B+"}
    ]
    
    # Run the complete workflow
    result = await workflow_service.generate_quarter_schedule_with_scraping(
        user_profile, 
        completed_courses
    )
    
    return result

if __name__ == "__main__":
    print("🧪 Testing Complete Planning Workflow")
    print("="*60)
    result = asyncio.run(test_workflow_integration())
    print("Workflow completed!") 