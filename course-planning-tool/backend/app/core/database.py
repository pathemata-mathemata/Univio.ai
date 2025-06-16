from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use the dynamic database URL method
DATABASE_URL = settings.get_database_url()
print(f"Database URL: {DATABASE_URL.split('@')[0]}@****" if '@' in DATABASE_URL else DATABASE_URL)

# Configure engine based on database type
if DATABASE_URL.startswith('postgresql'):
    # PostgreSQL/Supabase configuration
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )
else:
    # SQLite configuration
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

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
    """Create tables if they don't exist"""
    Base.metadata.create_all(bind=engine) 