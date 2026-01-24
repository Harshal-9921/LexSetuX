from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float, Boolean
from datetime import datetime
from typing import Optional
import os

from app.config import settings

# Auto-detect SQLite and use appropriate driver
database_url = settings.DATABASE_URL
if database_url.startswith("sqlite"):
    # For SQLite, use aiosqlite driver
    if "aiosqlite" not in database_url:
        database_url = database_url.replace("sqlite://", "sqlite+aiosqlite://")
    # Ensure directory exists for SQLite database
    if "///" in database_url:
        db_path = database_url.split("///")[-1]
        db_dir = os.path.dirname(db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)

# Create async engine
engine = create_async_engine(
    database_url,
    echo=True,
    future=True,
    # SQLite-specific settings
    connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="customer")  # customer, lawyer, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    summary = Column(Text)
    applicable_sections = Column(JSON)  # List of legal sections
    confidence_score = Column(Float)
    analysis_result = Column(JSON)  # Full analysis data
    document_paths = Column(JSON)  # List of document file paths
    status = Column(String(50), default="pending")  # pending, analyzed, closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Lawyer(Base):
    __tablename__ = "lawyers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialization = Column(JSON)  # List of legal areas
    experience_years = Column(Integer)
    location = Column(String(255))
    bio = Column(Text)
    hourly_rate = Column(Float)
    rating = Column(Float, default=0.0)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CaseLawyerMatch(Base):
    __tablename__ = "case_lawyer_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("lawyers.id"), nullable=False)
    match_score = Column(Float)
    status = Column(String(50), default="pending")  # pending, contacted, hired, declined
    created_at = Column(DateTime, default=datetime.utcnow)


class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("lawyers.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Customer who made the booking
    status = Column(String(50), default="pending")  # pending, accepted, rejected, cancelled, completed
    booking_date = Column(DateTime, default=datetime.utcnow)
    scheduled_date = Column(DateTime, nullable=True)
    lawyer_notes = Column(Text, nullable=True)  # Notes from lawyer
    customer_notes = Column(Text, nullable=True)  # Notes from customer
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
