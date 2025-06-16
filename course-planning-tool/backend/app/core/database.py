from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use the dynamic database URL method
DATABASE_URL = settings.get_database_url()
print(f"🔗 Connecting to database: {DATABASE_URL.split('@')[0]}@****" if '@' in DATABASE_URL else DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Database session dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_tables():
    pass  # Will be implemented with actual models 