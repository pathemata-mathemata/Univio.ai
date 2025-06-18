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
        Get database URL - Use Supabase PostgreSQL for production, SQLite for local dev
        """
        # Check if we have Supabase credentials
        if self.SUPABASE_URL and self.POSTGRES_USER and self.POSTGRES_PASSWORD:
            # Debug information
            print(f"🔍 Supabase URL: {self.SUPABASE_URL}")
            print(f"🔍 Postgres User: {self.POSTGRES_USER}")
            print(f"🔍 Postgres Host: {self.POSTGRES_HOST}")
            print(f"🔍 Postgres Port: {self.POSTGRES_PORT}")
            print(f"🔍 Postgres DB: {self.POSTGRES_DB or 'postgres'}")
            
            # Use the environment variables directly - MUST have POSTGRES_HOST set
            if not self.POSTGRES_HOST:
                print("❌ POSTGRES_HOST environment variable is required!")
                print("❌ Set POSTGRES_HOST=aws-0-us-west-1.pooler.supabase.com")
                raise ValueError("POSTGRES_HOST environment variable is required")
            
            host = self.POSTGRES_HOST
            port = self.POSTGRES_PORT or "6543"
            database = self.POSTGRES_DB or "postgres"
            
            # Construct the PostgreSQL connection string using the provided credentials
            postgres_url = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{host}:{port}/{database}"
            
            print(f"🔗 Using Supabase PostgreSQL: postgresql://{self.POSTGRES_USER}:****@{host}:{port}/{database}")
            return postgres_url
        else:
            # Missing credentials - show what's missing
            missing = []
            if not self.SUPABASE_URL: missing.append("SUPABASE_URL")
            if not self.POSTGRES_USER: missing.append("POSTGRES_USER") 
            if not self.POSTGRES_PASSWORD: missing.append("POSTGRES_PASSWORD")
            if not self.POSTGRES_HOST: missing.append("POSTGRES_HOST")
            print(f"❌ Missing Supabase credentials: {', '.join(missing)}")
            
            # Fallback to SQLite for local development
            sqlite_url = "sqlite:///./course_planning.db"
            print(f"🔗 Using SQLite database (local dev): {sqlite_url}")
            return sqlite_url
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 