# Updated AI-Powered Course Planning Tool - Workflow & Architecture

## User Input Flow

### 1. Initial User Information
Users provide the following key information:
- **Year of Transfer**: When they plan to transfer (e.g., "Fall 2025", "Spring 2026")
- **Planning Quarter**: Current quarter they're planning for (e.g., "Fall 2024", "Winter 2025")
- **Current Major**: Their current/intended major
- **Current Institution**: Community college they're currently attending
- **Intended Transfer Institution**: Target university for transfer

### 2. System Workflow

```
User Input → Transfer Analysis → Course Planning → Schedule Optimization → Results
```

#### Step 1: User Input Collection
```javascript
const userInput = {
  transferYear: "Fall 2025",
  planningQuarter: "Fall 2024", 
  currentMajor: "Computer Science",
  currentInstitution: "De Anza College",
  intendedTransferInstitution: "UC Berkeley"
}
```

#### Step 2: Transfer Requirement Analysis
- Scrape ASSIST.org for transfer requirements
- Analyze current progress vs requirements
- Identify missing courses needed for transfer

#### Step 3: Course Planning & Optimization
- Generate semester-by-semester plan from current quarter to transfer
- Optimize for prerequisites, course availability, and transfer deadlines
- Suggest alternative pathways if needed

#### Step 4: Schedule Generation
- Create detailed schedules for each semester
- Include course sections, times, and locations
- Handle waitlists and backup options

## Updated Data Models

### User Profile Model
```json
{
  "id": "uuid",
  "email": "string",
  "profile": {
    "first_name": "string",
    "last_name": "string",
    "current_institution": "string",
    "intended_transfer_institution": "string",
    "current_major": "string",
    "transfer_timeline": {
      "target_transfer_year": "string",    # "Fall 2025"
      "current_planning_quarter": "string", # "Fall 2024"
      "quarters_until_transfer": "integer"  # Calculated field
    },
    "academic_status": {
      "completed_courses": ["array"],
      "in_progress_courses": ["array"],
      "total_units_completed": "number",
      "gpa": "number"
    }
  },
  "preferences": {
    "max_credits_per_quarter": "integer",
    "preferred_times": ["array"],
    "avoid_times": ["array"],
    "preferred_days": ["array"],
    "prioritize_transfer_requirements": "boolean"
  }
}
```

### Transfer Plan Model
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "transfer_analysis": {
    "source_institution": "string",
    "target_institution": "string",
    "major": "string",
    "target_transfer_quarter": "string",
    "requirements_analysis": {
      "total_requirements": "integer",
      "completed_requirements": "integer",
      "remaining_requirements": "integer",
      "completion_percentage": "number"
    }
  },
  "quarterly_plan": [
    {
      "quarter": "string",           # "Fall 2024"
      "year": "integer",
      "courses": [
        {
          "course_code": "string",
          "course_title": "string",
          "units": "number",
          "requirement_type": "string", # "major_prep", "igetc", "elective"
          "priority": "string",         # "required", "recommended", "optional"
          "prerequisite_for": ["array"]
        }
      ],
      "total_units": "number",
      "quarter_goals": ["array"]
    }
  ],
  "transfer_readiness": {
    "on_track": "boolean",
    "projected_transfer_date": "string",
    "risks": ["array"],
    "recommendations": ["array"]
  }
}
```

## Updated API Endpoints

### Transfer Planning Endpoints
```http
POST   /transfer/analyze                # Analyze transfer requirements
GET    /transfer/plan/{user_id}         # Get user's transfer plan
PUT    /transfer/plan/{user_id}         # Update transfer plan
POST   /transfer/optimize               # Optimize transfer pathway
GET    /transfer/progress/{user_id}     # Get transfer progress
POST   /transfer/validate               # Validate transfer plan
```

### Course Planning Endpoints
```http
POST   /planning/generate               # Generate quarterly course plan
GET    /planning/quarters/{user_id}     # Get quarterly schedules
PUT    /planning/quarters/{quarter_id}  # Update specific quarter
POST   /planning/alternatives           # Get alternative course options
GET    /planning/prerequisites/{course} # Get prerequisite chains
```

## Updated Request/Response Examples

### Transfer Analysis Request
```http
POST /transfer/analyze
```

Request Body:
```json
{
  "current_institution": "De Anza College",
  "intended_transfer_institution": "UC Berkeley", 
  "major": "Computer Science",
  "target_transfer_quarter": "Fall 2025",
  "current_planning_quarter": "Fall 2024",
  "completed_courses": [
    {
      "course_code": "CS 1A",
      "course_title": "Object-Oriented Programming",
      "units": 4.5,
      "grade": "A",
      "quarter_completed": "Spring 2024"
    }
  ],
  "in_progress_courses": [
    {
      "course_code": "MATH 1A", 
      "course_title": "Calculus I",
      "units": 5.0,
      "quarter": "Fall 2024"
    }
  ]
}
```

Response:
```json
{
  "transfer_analysis": {
    "requirements_summary": {
      "total_units_needed": 60,
      "completed_units": 15,
      "remaining_units": 45,
      "quarters_remaining": 3
    },
    "requirement_categories": [
      {
        "category": "Major Preparation",
        "total_courses": 8,
        "completed_courses": 1,
        "remaining_courses": 7,
        "courses": [
          {
            "requirement": "CS 1A - Object-Oriented Programming",
            "status": "completed",
            "course_taken": "CS 1A"
          },
          {
            "requirement": "CS 1B - Advanced Programming",
            "status": "needed",
            "available_at_current_school": true,
            "prerequisite_for": ["CS 2A", "CS 2B"]
          }
        ]
      }
    ],
    "quarterly_plan": [
      {
        "quarter": "Winter 2025",
        "recommended_courses": [
          {
            "course_code": "CS 1B",
            "priority": "high",
            "reason": "Required for major, prerequisite for upper-division courses"
          },
          {
            "course_code": "MATH 1B", 
            "priority": "high",
            "reason": "Required for major preparation"
          }
        ],
        "total_units": 9.5
      }
    ],
    "transfer_readiness": {
      "on_track": true,
      "projected_transfer_date": "Fall 2025",
      "confidence_score": 0.85,
      "risks": [],
      "recommendations": [
        "Consider taking summer courses to reduce course load",
        "Apply for TAG (Transfer Admission Guarantee) in September 2024"
      ]
    }
  }
}
```

### Course Planning Generation
```http
POST /planning/generate
```

Request Body:
```json
{
  "user_id": "uuid",
  "start_quarter": "Fall 2024",
  "target_transfer_quarter": "Fall 2025", 
  "courses_needed": [
    {
      "course_code": "CS 1B",
      "priority": 5,
      "latest_quarter": "Spring 2025"
    },
    {
      "course_code": "MATH 1B",
      "priority": 5,
      "latest_quarter": "Winter 2025"
    }
  ],
  "constraints": {
    "max_units_per_quarter": 16,
    "preferred_schedule": "morning_classes",
    "avoid_summer": false
  }
}
```

Response:
```json
{
  "quarterly_plans": [
    {
      "quarter": "Fall 2024",
      "courses": [
        {
          "course": {
            "code": "MATH 1A",
            "title": "Calculus I", 
            "units": 5.0
          },
          "sections": [
            {
              "section_id": "0001",
              "instructor": "Dr. Smith",
              "schedule": [
                {
                  "day": "Monday",
                  "start_time": "09:30",
                  "end_time": "11:20",
                  "location": "SC1-109"
                }
              ],
              "seats_available": 5,
              "waitlist": 0
            }
          ]
        }
      ],
      "total_units": 15.0,
      "quarter_goals": [
        "Complete Calculus I for CS prerequisites",
        "Maintain GPA above 3.0 for transfer eligibility"
      ]
    }
  ],
  "transfer_timeline": {
    "completion_date": "Spring 2025",
    "buffer_quarters": 1,
    "alternative_paths": [
      {
        "path_name": "Accelerated Path",
        "completion_date": "Winter 2025", 
        "requires_summer": true
      }
    ]
  }
}
```

## Frontend Components Update

### Input Form Component
```javascript
const TransferPlanningForm = () => {
  const [formData, setFormData] = useState({
    transferYear: '',
    planningQuarter: '',
    currentMajor: '',
    currentInstitution: '',
    intendedTransferInstitution: '',
    completedCourses: [],
    currentCourses: []
  });

  const quarterOptions = [
    'Fall 2024', 'Winter 2025', 'Spring 2025', 'Summer 2025',
    'Fall 2025', 'Winter 2026', 'Spring 2026'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <InstitutionSelector 
        label="Current Institution"
        value={formData.currentInstitution}
        onChange={(value) => setFormData({...formData, currentInstitution: value})}
      />
      
      <InstitutionSelector 
        label="Intended Transfer Institution"
        value={formData.intendedTransferInstitution}
        onChange={(value) => setFormData({...formData, intendedTransferInstitution: value})}
      />
      
      <MajorSelector 
        institution={formData.intendedTransferInstitution}
        value={formData.currentMajor}
        onChange={(value) => setFormData({...formData, currentMajor: value})}
      />
      
      <QuarterSelector 
        label="Target Transfer Quarter"
        options={quarterOptions}
        value={formData.transferYear}
        onChange={(value) => setFormData({...formData, transferYear: value})}
      />
      
      <QuarterSelector 
        label="Current Planning Quarter"
        options={quarterOptions}
        value={formData.planningQuarter} 
        onChange={(value) => setFormData({...formData, planningQuarter: value})}
      />
      
      <CompletedCoursesSection 
        courses={formData.completedCourses}
        onChange={(courses) => setFormData({...formData, completedCourses: courses})}
      />
    </form>
  );
};
```

### Transfer Progress Dashboard
```javascript
const TransferProgressDashboard = ({ transferPlan }) => {
  return (
    <div className="dashboard">
      <TransferTimelineProgress 
        currentQuarter={transferPlan.current_quarter}
        targetTransfer={transferPlan.target_transfer}
        progressPercentage={transferPlan.completion_percentage}
      />
      
      <RequirementsBreakdown 
        categories={transferPlan.requirement_categories}
      />
      
      <QuarterlyPlanOverview 
        quarters={transferPlan.quarterly_plan}
      />
      
      <TransferReadinessIndicator 
        onTrack={transferPlan.on_track}
        risks={transferPlan.risks}
        recommendations={transferPlan.recommendations}
      />
    </div>
  );
};
```

## Updated Scraper Integration

The `assist_scraper.py` will be called with the user's specific inputs:

```python
# In the backend service
transfer_data = scrape_assist_data(
    academic_year=determine_academic_year(user_input.target_transfer_quarter),
    institution=user_input.current_institution,
    target_institution=user_input.intended_transfer_institution,
    major_filter=user_input.current_major
)
```

This updated architecture now properly reflects the user journey of planning their transfer timeline from their current institution to their target university. 