from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from app.api.api import api_router
from app.core.config import settings
from app.core.database import create_tables
from app.core.logging import setup_logging

# Setup logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Note: Skipping table creation - using existing Supabase tables
    import logging
    logger = logging.getLogger(__name__)
    logger.info("🚀 Using existing Supabase database tables")
    
    # Uncomment this if you need to create new tables:
    # try:
    #     await create_tables()
    # except Exception as e:
    #     logger.error(f"❌ Failed to create database tables during startup: {e}")
    #     logger.warning("⚠️ Application will start but database features may not work")
    
    yield
    # Shutdown
    pass

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Course Planning Tool API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",")]
    print(f"🔗 CORS allowed origins: {origins}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Course Planning Tool API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with database status"""
    import logging
    from app.core.database import engine
    
    logger = logging.getLogger(__name__)
    
    health_status = {
        "status": "healthy",
        "version": settings.VERSION,
        "database": "unknown"
    }
    
    # Test database connection
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            health_status["database"] = "connected"
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        health_status["database"] = "disconnected"
        health_status["database_error"] = str(e)
        
    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 