from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.database import engine, Base, get_db
from app.routers import auth, case_analysis, lawyers
from app.routers import bookings
from app.routers import contact
from app.routers import precedents

# Create database tables (in production, use Alembic migrations)
async def init_db():
    """Initialize database tables. Handles connection errors gracefully."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✓ Database tables initialized successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not initialize database: {e}")
        print("⚠ Server will start but database features will not work.")
        print("⚠ Please configure your database connection in .env file or set up PostgreSQL.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown (if needed)
    try:
        await engine.dispose()
    except Exception:
        pass

app = FastAPI(
    title="Legal Case Analysis API",
    description="AI-powered legal case analysis and lawyer matching platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
# In development, allow all origins if "*" is in the list
cors_origins = settings.CORS_ORIGINS
allow_all = "*" in cors_origins

if allow_all:
    # Remove "*" from list for proper handling
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=not allow_all,  # Can't use credentials with wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(case_analysis.router, prefix="/api/cases", tags=["Case Analysis"])
app.include_router(lawyers.router, prefix="/api/lawyers", tags=["Lawyers"])
app.include_router(bookings.router, tags=["Bookings"])
app.include_router(contact.router, tags=["Contact"])
app.include_router(precedents.router, tags=["Precedents"])




@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Legal Case Analysis API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
