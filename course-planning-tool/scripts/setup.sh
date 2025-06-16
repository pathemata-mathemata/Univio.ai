#!/bin/bash

# AI-Powered Course Planning Tool - Setup Script

set -e

echo "🚀 Setting up AI-Powered Course Planning Tool..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker is not installed. Docker setup will be skipped."
        SKIP_DOCKER=true
    fi
    
    echo "✅ Requirements check passed!"
}

# Setup environment variables
setup_env() {
    echo "📝 Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        echo "✅ Created .env file from template"
        echo "⚠️  Please update .env with your actual configuration"
    else
        echo "ℹ️  .env file already exists"
    fi
    
    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
EOF
        echo "✅ Created frontend/.env.local"
    else
        echo "ℹ️  frontend/.env.local already exists"
    fi
}

# Setup backend
setup_backend() {
    echo "🐍 Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
        echo "✅ Created Python virtual environment"
    fi
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    echo "✅ Installed Python dependencies"
    
    # Create __init__.py files
    touch app/__init__.py
    find app -type d -exec touch {}/__init__.py \;
    echo "✅ Created __init__.py files"
    
    cd ..
}

# Setup frontend
setup_frontend() {
    echo "⚛️  Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    npm install
    echo "✅ Installed Node.js dependencies"
    
    cd ..
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    if [ "$SKIP_DOCKER" != true ]; then
        echo "🐳 Starting database with Docker..."
        docker-compose up -d db redis
        echo "✅ Database and Redis started"
        
        # Wait for database to be ready
        echo "⏳ Waiting for database to be ready..."
        sleep 10
    else
        echo "⚠️  Skipping Docker database setup"
        echo "📝 Please make sure PostgreSQL and Redis are running manually"
    fi
}

# Run database migrations
run_migrations() {
    echo "📊 Running database migrations..."
    
    cd backend
    source .venv/bin/activate
    
    # Initialize Alembic if not already done
    if [ ! -f alembic.ini ]; then
        alembic init alembic
        echo "✅ Initialized Alembic"
    fi
    
    # Run migrations
    alembic upgrade head || echo "⚠️  No migrations to run yet"
    
    cd ..
}

# Create sample configuration files
create_configs() {
    echo "⚙️  Creating configuration files..."
    
    # Create backend config
    cat > backend/app/config.py << 'EOF'
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Course Planning Tool"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://courseplan_user:courseplan_password@localhost:5432/course_planning"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    class Config:
        env_file = ".env"

settings = Settings()
EOF
    
    echo "✅ Created backend configuration"
    
    # Create basic API router
    mkdir -p backend/app/api/v1
    cat > backend/app/api/api.py << 'EOF'
from fastapi import APIRouter
from app.api.v1 import auth, users, institutions, courses, transfer, planning

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(institutions.router, prefix="/institutions", tags=["institutions"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(transfer.router, prefix="/transfer", tags=["transfer"])
api_router.include_router(planning.router, prefix="/planning", tags=["planning"])
EOF
    
    echo "✅ Created API router structure"
}

# Create basic component files
create_basic_files() {
    echo "📁 Creating basic component files..."
    
    # Create placeholder API routes
    for route in auth users institutions courses transfer planning; do
        cat > backend/app/api/v1/${route}.py << EOF
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_${route}():
    return {"message": "${route} endpoint"}
EOF
    done
    
    # Create basic logging setup
    cat > backend/app/core/logging.py << 'EOF'
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
EOF
    
    # Create database setup
    cat > backend/app/core/database.py << 'EOF'
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

async def create_tables():
    pass  # Will be implemented with actual models
EOF
    
    echo "✅ Created basic backend files"
}

# Main setup function
main() {
    check_requirements
    setup_env
    setup_backend
    setup_frontend
    create_configs
    create_basic_files
    
    if [ "$SKIP_DOCKER" != true ]; then
        setup_database
        run_migrations
    fi
    
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update .env and frontend/.env.local with your configuration"
    echo "2. Start the development servers:"
    echo "   - Backend: cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
    echo "   - Frontend: cd frontend && npm run dev"
    echo "3. Visit http://localhost:3000 for frontend and http://localhost:8000/docs for API docs"
    echo ""
    echo "🐳 Or use Docker:"
    echo "   docker-compose up -d"
}

# Run main function
main "$@" 