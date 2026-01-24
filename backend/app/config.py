from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database - Use SQLite for development if PostgreSQL is not available
    # For PostgreSQL: postgresql+asyncpg://user:password@localhost:5432/dbname
    # For SQLite: sqlite+aiosqlite:///./legal_case.db
    DATABASE_URL: str = "sqlite+aiosqlite:///./legal_case.db"
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-in-production-use-env-var"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Model Selection
    # Options: "rule_based" (default) or "bert" (LegalBERT transformer-based)
    # Use "bert" for better accuracy (~90-95%) but slower inference
    # Use "rule_based" for faster inference but less accurate (~70-80%)
    AI_MODEL: str = "rule_based"
    
    # API Keys (for AI services if needed)
    OPENAI_API_KEY: Optional[str] = None
    
    # SMTP Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "harshalingaledev@gmail.com"
    SMTP_PASSWORD: Optional[str] = None  # Set via environment variable
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:5174",  # Vite alternative port
        "*",  # Allow all origins in development (remove in production)
    ]
    
    # Supabase (if using for auth)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

