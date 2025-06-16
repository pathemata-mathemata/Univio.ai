from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Course Planning Tool"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database - Support both SQLite and PostgreSQL (Supabase)
    DATABASE_URL: str = "sqlite:///./course_planning.db"
    
    # Supabase Configuration (for production deployment)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_HOST: Optional[str] = None
    POSTGRES_PORT: Optional[str] = "5432"
    POSTGRES_DB: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Services
    PERPLEXITY_API_KEY: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*"]
    
    # Chrome Driver for Selenium
    CHROME_DRIVER_PATH: str = "/usr/bin/chromedriver"
    HEADLESS_BROWSER: bool = True
    
    def get_database_url(self) -> str:
        """
        Get database URL, prioritizing Supabase configuration for production
        """
        # If Supabase is configured (production), use Supabase
        if self.SUPABASE_URL and self.SUPABASE_SERVICE_ROLE_KEY:
            # Extract project reference from Supabase URL
            # Format: https://PROJECT_REF.supabase.co -> postgresql://postgres:[PASSWORD]@db.PROJECT_REF.supabase.com:5432/postgres
            project_ref = self.SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
            postgres_url = f"postgresql://postgres.{project_ref}:{self.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
            return postgres_url
        
        # Fallback to local DATABASE_URL for development
        return self.DATABASE_URL
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 