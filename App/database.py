import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Get PostgreSQL database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")
print("✅ DATABASE_URL Loaded:", DATABASE_URL)

# Check if loaded successfully
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set. Please check your .env file.")

# SQLAlchemy engine for PostgreSQL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class for models
Base = declarative_base()

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

