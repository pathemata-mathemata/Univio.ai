# AI-Powered Course Planning Tool - Project Structure

## Root Directory Structure
```
course-planning-app/
├── frontend/                          # React/Next.js Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── assets/
│   │       ├── images/
│   │       └── icons/
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── forms/
│   │   │   │   ├── InstitutionSelector.jsx
│   │   │   │   ├── CourseSelector.jsx
│   │   │   │   └── PreferencesForm.jsx
│   │   │   ├── schedule/
│   │   │   │   ├── ScheduleGrid.jsx
│   │   │   │   ├── CourseCard.jsx
│   │   │   │   ├── TimeSlot.jsx
│   │   │   │   └── ScheduleExport.jsx
│   │   │   └── planning/
│   │   │       ├── TransferMap.jsx
│   │   │       ├── PrerequisiteTree.jsx
│   │   │       └── ProgressTracker.jsx
│   │   ├── pages/                    # Main application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CoursePlanning.jsx
│   │   │   ├── ScheduleView.jsx
│   │   │   ├── TransferRequirements.jsx
│   │   │   └── Profile.jsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCourseData.js
│   │   │   ├── useScheduleOptimizer.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/                 # API communication
│   │   │   ├── api.js
│   │   │   ├── courseService.js
│   │   │   ├── authService.js
│   │   │   └── schedulingService.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── dateHelpers.js
│   │   │   ├── courseValidation.js
│   │   │   ├── scheduleConflicts.js
│   │   │   └── exportHelpers.js
│   │   ├── contexts/                 # React contexts
│   │   │   ├── AuthContext.js
│   │   │   ├── CourseContext.js
│   │   │   └── ThemeContext.js
│   │   ├── styles/                   # Styling files
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   └── themes.css
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                          # Python/FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI application entry
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   ├── settings.py           # Environment configuration
│   │   │   └── database.py           # Database configuration
│   │   ├── api/                      # API routes
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── courses.py
│   │   │   │   │   ├── institutions.py
│   │   │   │   │   ├── schedules.py
│   │   │   │   │   ├── transfers.py
│   │   │   │   │   └── ai_optimization.py
│   │   │   │   └── api.py
│   │   │   └── dependencies.py
│   │   ├── models/                   # Database models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── institution.py
│   │   │   ├── course.py
│   │   │   ├── schedule.py
│   │   │   └── transfer_requirement.py
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── course.py
│   │   │   ├── schedule.py
│   │   │   └── transfer.py
│   │   ├── services/                 # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── course_service.py
│   │   │   ├── scraping_service.py
│   │   │   ├── ai_service.py
│   │   │   └── schedule_service.py
│   │   ├── scrapers/                 # Web scraping modules
│   │   │   ├── __init__.py
│   │   │   ├── assist_scraper.py     # Our existing scraper
│   │   │   ├── college_scrapers/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── de_anza_scraper.py
│   │   │   │   ├── smc_scraper.py
│   │   │   │   └── base_scraper.py
│   │   │   └── schedule_scrapers/
│   │   │       ├── __init__.py
│   │   │       ├── class_schedule_scraper.py
│   │   │       └── prerequisite_scraper.py
│   │   ├── ai/                       # AI/ML modules
│   │   │   ├── __init__.py
│   │   │   ├── course_recommender.py
│   │   │   ├── schedule_optimizer.py
│   │   │   ├── conflict_resolver.py
│   │   │   └── transfer_mapper.py
│   │   ├── utils/                    # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── cache.py
│   │   │   ├── validators.py
│   │   │   ├── formatters.py
│   │   │   └── notifications.py
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── __init__.py
│   │   │   ├── auth_middleware.py
│   │   │   ├── rate_limiting.py
│   │   │   └── cors_middleware.py
│   │   └── tests/                    # Test files
│   │       ├── __init__.py
│   │       ├── test_api/
│   │       ├── test_services/
│   │       ├── test_scrapers/
│   │       └── test_ai/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── database/                         # Database files
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_courses.sql
│   │   └── 003_add_transfers.sql
│   ├── seeders/
│   │   ├── institutions.sql
│   │   ├── sample_courses.sql
│   │   └── transfer_requirements.sql
│   └── schema.sql
│
├── ai-models/                        # ML model files
│   ├── course_recommender/
│   │   ├── model.pkl
│   │   ├── vectorizer.pkl
│   │   └── training_data.csv
│   ├── schedule_optimizer/
│   │   ├── optimizer_model.pkl
│   │   └── constraints.json
│   └── transfer_mapper/
│       ├── mapping_model.pkl
│       └── institution_mappings.json
│
├── docs/                            # Documentation
│   ├── api/
│   │   ├── README.md
│   │   ├── endpoints.md
│   │   └── authentication.md
│   ├── frontend/
│   │   ├── components.md
│   │   ├── styling-guide.md
│   │   └── deployment.md
│   ├── deployment/
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   └── production-setup.md
│   └── README.md
│
├── scripts/                         # Utility scripts
│   ├── data_migration.py
│   ├── scraper_scheduler.py
│   ├── model_training.py
│   └── backup_database.sh
│
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand or React Query
- **Calendar**: React Big Calendar or FullCalendar
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis
- **Queue**: Celery with Redis broker
- **Authentication**: JWT with OAuth2
- **Documentation**: Automatic OpenAPI/Swagger

### AI/ML
- **Optimization**: OR-Tools (Google) for schedule optimization
- **Recommendations**: scikit-learn for course recommendations
- **NLP**: spaCy for course description analysis
- **Data Processing**: pandas, numpy

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Database**: PostgreSQL 15
- **Caching**: Redis 7
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Key Features Implementation

### 1. Course Data Pipeline
```python
# Scheduled scraping every 6 hours
scraper_service.update_course_data()
ai_service.retrain_models()
cache_service.invalidate_course_cache()
```

### 2. AI Schedule Optimization
```python
# Multi-objective optimization
optimizer = ScheduleOptimizer()
optimal_schedule = optimizer.optimize(
    desired_courses=user_courses,
    constraints=user_preferences,
    transfer_requirements=transfer_data
)
```

### 3. Real-time Updates
```javascript
// WebSocket connection for live updates
const { data: scheduleData } = useWebSocket('/ws/schedule-updates')
```

### 4. Transfer Requirement Mapping
```python
# Integration with existing assist_scraper.py
transfer_data = scrape_assist_data(
    institution=user.current_college,
    target_institution=user.target_university,
    major_filter=user.major
)
``` 