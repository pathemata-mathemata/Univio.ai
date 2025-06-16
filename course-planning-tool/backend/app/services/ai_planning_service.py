import json
import asyncio
from typing import Dict, Any, List
from datetime import datetime
import os
from openai import OpenAI
from app.core.config import settings

class AIPlanningService:
    def __init__(self):
        # Set Perplexity API key (you'll need to add this to your settings)
        self.api_key = getattr(settings, 'PERPLEXITY_API_KEY', os.getenv('PERPLEXITY_API_KEY'))
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.perplexity.ai"
        ) if self.api_key else None
    
    async def generate_quarter_schedule(self, planning_context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a quarterly course schedule using REAL ASSIST.org data ONLY"""
        
        print(f"🤖 Generating AI-powered quarterly schedule...")
        print(f"Context keys: {list(planning_context.keys())}")
        
        # Validate required context data - FAIL if missing
        required_keys = ['profile', 'completed_courses', 'transfer_requirements']
        for key in required_keys:
            if key not in planning_context:
                raise Exception(f"Missing required context key: {key}")
        
        profile = planning_context.get("profile", {})
        if not profile:
            raise Exception("Profile data is required")
        
        # Only use Perplexity API for real AI generation - no mock generation
        try:
            response = await self._generate_with_perplexity(planning_context)
            print(f"✅ Perplexity API successful")
            return response
        except Exception as e:
            print(f"❌ Perplexity API failed: {str(e)}")
            raise Exception(f"AI schedule generation failed: {str(e)} - No fallback data available")
    
    def _create_planning_prompt(self, context: Dict[str, Any]) -> str:
        """Create a detailed prompt for Perplexity to generate course schedules"""
        
        profile = context.get("profile", {})
        completed_courses = context.get("completed_courses", [])
        transfer_requirements = context.get("transfer_requirements", {})
        preferences = context.get("preferences", {})
        
        prompt = f"""
You are an expert academic advisor specializing in community college to university transfer planning. 
Create a course schedule for ONE SPECIFIC QUARTER for a student with the following information:

STUDENT PROFILE:
- Current Institution: {profile.get('current_institution')} (PLAN COURSES FROM HERE ONLY)
- Target Institution: {profile.get('target_institution')} (DO NOT plan courses from here)
- Current Major: {profile.get('current_major')}
- Target Major: {profile.get('target_major')}
- Planning Quarter: {profile.get('planning_quarter', 'Fall')} (ONLY plan for this quarter)
- Desired Units: {preferences.get('units_per_quarter', 15)} units

COMPLETED COURSES:
{self._format_completed_courses(completed_courses)}

AVAILABLE COURSES AT {profile.get('current_institution')} (choose from these only):
{self._format_transfer_requirements(transfer_requirements)}

CRITICAL INSTRUCTIONS:
1. Plan ONLY for the {profile.get('planning_quarter', 'Fall')} quarter
2. Select courses ONLY from {profile.get('current_institution')} (the current institution)
3. DO NOT select courses from {profile.get('target_institution')} (the target institution)
4. Select courses totaling approximately {preferences.get('units_per_quarter', 15)} units
5. Prioritize courses needed for transfer to {profile.get('target_institution')}
6. Consider prerequisite chains based on completed courses
7. Balance course difficulty for manageable workload
8. Use real course codes and titles from {profile.get('current_institution')}
9. Focus on major prerequisites and general education requirements
10. **SUBJECT DIVERSITY**: Avoid selecting multiple courses from the same major/subject area in one quarter (e.g., don't take MATH 1A and MATH 1B together). Mix different subjects for better balance and success.
11. Prioritize one major course per quarter and supplement with general education or electives
12. **HONORS COURSES**: Courses ending with "H" (like MATH 2AH, PHYS 4AH) are honors versions equivalent to regular courses (MATH 2A, PHYS 4A). Choose either the regular OR honors version, not both. Honors courses have same transfer value but are more rigorous.
13. **SPECIAL REQUIREMENTS**: If you encounter courses marked as "No Course Articulated" or "This course must be taken at the university after transfer", include these in your recommendations with appropriate warnings. These are important requirements that students need to be aware of for transfer planning.
14. **GENERAL EDUCATION FALLBACK**: If you have selected diverse courses but still need units and only same-major courses remain, suggest "GE" (General Education) courses instead of taking multiple courses from the same subject area. Include the remaining units needed and advise the student to choose any transferable GE course from the {profile.get('current_institution')} catalog.

REQUIRED OUTPUT FORMAT (JSON only, no additional text):
{{
    "quarter": {{
        "quarter_name": "{profile.get('planning_quarter', 'Fall')} 2024",
        "courses": [
            {{
                "course_code": "PHYS 4A",
                "course_name": "Physics I",
                "units": 4,
                "category": "Major Prerequisites",
                "reason": "Required for engineering transfer, builds on completed Math 1A-1C"
            }},
            {{
                "course_code": "ENGL 1A", 
                "course_name": "English Composition",
                "units": 4,
                "category": "General Education",
                "reason": "Transfer requirement for written communication"
            }},
            {{
                "course_code": "GE",
                "course_name": "General Education Course (3 units)",
                "units": 3,
                "category": "General Education",
                "reason": "Recommended to maintain subject diversity. Choose any transferable GE course from {profile.get('current_institution')} catalog."
            }}
        ],
        "total_units": 15,
        "notes": "Balanced schedule building on math foundation at {profile.get('current_institution')}",
        "warnings": [
            "COMPSCI 61A: No course articulated at {profile.get('current_institution')} - must be taken at {profile.get('target_institution')} after transfer",
            "COMPSCI 70: This course must be taken at the university after transfer"
        ]
    }},
    "recommendations": [
        "Register early for popular courses at {profile.get('current_institution')}",
        "Consider study groups for challenging subjects",
        "Plan to take non-articulated courses after transfer",
        "For GE courses, choose from areas like humanities, social sciences, or natural sciences to fulfill breadth requirements"
    ]
}}

Please respond with ONLY the JSON object, no additional explanation or text.
"""
        return prompt
    
    def _format_completed_courses(self, courses: List[Dict]) -> str:
        """Format completed courses for the prompt"""
        if not courses:
            return "No completed courses on record."
        
        formatted = []
        for course in courses:
            formatted.append(f"- {course.get('code', 'N/A')}: {course.get('title', 'N/A')} ({course.get('units', 0)} units, Grade: {course.get('grade', 'N/A')})")
        
        return "\n".join(formatted)
    
    def _format_transfer_requirements(self, requirements: Dict) -> str:
        """Format transfer requirements for the prompt, including all available courses"""
        if not requirements:
            return "No specific transfer requirements loaded."
        
        # Get source requirements (courses available at current institution)
        source_requirements = requirements.get('source_requirements', {})
        if not source_requirements:
            return "No source requirements found in transfer data."
        
        # Extract all available courses from source requirements
        all_courses = []
        for requirement_name, course_data in source_requirements.items():
            # Handle ASSIST.org data structure
            if isinstance(course_data, list):
                for option_group in course_data:
                    if isinstance(option_group, list):
                        for course in option_group:
                            if isinstance(course, dict):
                                all_courses.append(course)
                            elif isinstance(course, str):
                                all_courses.append({"code": course, "title": course})
                    elif isinstance(option_group, dict):
                        all_courses.append(option_group)
                    elif isinstance(option_group, str):
                        all_courses.append({"code": option_group, "title": option_group})
            elif isinstance(course_data, dict):
                if 'courses' in course_data:
                    courses_list = course_data['courses']
                    if isinstance(courses_list, list):
                        all_courses.extend(courses_list)
                elif 'code' in course_data or 'course_code' in course_data:
                    all_courses.append(course_data)
            elif isinstance(course_data, str):
                all_courses.append({"code": course_data, "title": course_data})
        
        if not all_courses:
            return "No courses found in transfer requirements."
        
        # Format courses for AI prompt
        formatted_courses = []
        for course_info in all_courses:
            if isinstance(course_info, dict):
                course_code = course_info.get('code') or course_info.get('course_code') or course_info.get('course_number')
                course_name = course_info.get('title') or course_info.get('course_name') or course_info.get('name')
                units = course_info.get('units') or course_info.get('credits')
                
                if not course_code:
                    continue
                
                # Parse units if it's a string
                if isinstance(units, str):
                    import re
                    units_match = re.search(r'(\d+\.?\d*)', units)
                    units = units_match.group(1) if units_match else "3"
                elif isinstance(units, (int, float)):
                    units = str(int(float(units)))
                else:
                    units = "3"  # Default
                
                formatted_courses.append(f"- {course_code}: {course_name or course_code} ({units} units)")
                
            elif isinstance(course_info, str):
                # Handle string format
                import re
                match = re.match(r'([A-Z]+\s*\d+[A-Z]*)\s*-?\s*([^(]+)?\s*\((\d+)\s*units?\)?', course_info)
                if match:
                    course_code = match.group(1).strip()
                    course_name = match.group(2).strip() if match.group(2) else course_code
                    units = match.group(3)
                    formatted_courses.append(f"- {course_code}: {course_name} ({units} units)")
                else:
                    code_match = re.match(r'([A-Z]+\s*\d+[A-Z]*)', course_info)
                    if code_match:
                        course_code = code_match.group(1).strip()
                        formatted_courses.append(f"- {course_code}: {course_code} (3 units)")
        
        if not formatted_courses:
            return "No valid courses could be parsed from transfer requirements."
        
        return f"Available transfer requirement courses:\n" + "\n".join(formatted_courses[:20]) + \
               (f"\n... and {len(formatted_courses) - 20} more courses" if len(formatted_courses) > 20 else "")
    
    async def _call_perplexity_api(self, prompt: str) -> Dict[str, Any]:
        """Call Perplexity API to generate schedule using OpenAI client"""
        try:
            messages = [
                {
                    "role": "system", 
                    "content": "You are an expert academic advisor. Always respond with valid JSON only, no additional text or explanations. Use current course catalogs and transfer requirements."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ]
            
            # Use OpenAI client with Perplexity base URL
            response = self.client.chat.completions.create(
                model="sonar-pro",
                messages=messages,
                temperature=0.2,  # Low temperature for consistent, structured output
                max_tokens=2000,
                top_p=0.9
            )
            
            content = response.choices[0].message.content
            
            # Clean up the content to extract just the JSON
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
            
            # Parse and return the JSON
            schedule_data = json.loads(content)
            return schedule_data
                
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse Perplexity API response as JSON: {e}")
        except Exception as e:
            raise Exception(f"Perplexity API call failed: {str(e)}")
    
    async def _generate_with_perplexity(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate schedule using Perplexity API with real ASSIST.org data"""
        
        # Prepare the prompt for the AI
        prompt = self._create_planning_prompt(context)
        
        # Call Perplexity API
        if not self.client:
            raise Exception("Perplexity API client not configured")
        
        response = await self._call_perplexity_api(prompt)
        return response