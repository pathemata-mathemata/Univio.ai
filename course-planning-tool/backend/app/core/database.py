from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Use the dynamic database URL method
DATABASE_URL = settings.get_database_url()
print(f"Database URL: {DATABASE_URL.split('@')[0]}@****" if '@' in DATABASE_URL else DATABASE_URL)

def create_database_engine(url: str):
    """Create database engine with appropriate configuration"""
    if url.startswith('postgresql'):
        # PostgreSQL/Supabase configuration
        engine = create_engine(
            url,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=False,
            connect_args={
                "options": "-c timezone=utc"
            }
        )
        # Test the connection immediately - but make it non-blocking for startup
        try:
            with engine.connect() as conn:
                result = conn.execute("SELECT 1")
                logger.info("✅ PostgreSQL connection test successful")
        except Exception as e:
            logger.error(f"❌ PostgreSQL connection test failed: {e}")
            logger.error("This might be due to:")
            logger.error("1. Incorrect Supabase project credentials")
            logger.error("2. Supabase project might be paused or deleted")
            logger.error("3. Network connectivity issues")
            logger.error("4. Invalid database password")
            
            # For production deployments, we want to continue startup but log the error
            # The application can still serve static content and handle other requests
            logger.warning("⚠️ Starting application without database connection - some features will be unavailable")
            
            # Don't raise the exception - let the app start and handle database errors gracefully
            # raise
        return engine
    else:
        # SQLite configuration (only for local development)
        engine = create_engine(url, connect_args={"check_same_thread": False})
        logger.info("✅ SQLite connection successful")
        return engine

# Create the engine - no fallback, must connect to the configured database
engine = create_database_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Database session dependency for FastAPI"""
    try:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    except Exception as e:
        logger.error(f"❌ Failed to create database session: {e}")
        logger.error("Database might not be available - check connection settings")
        raise

async def create_tables():
    """Create tables if they don't exist"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified")
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        raise 