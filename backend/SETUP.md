# Quick Setup Guide

## Database Configuration

The server is now configured to use **SQLite by default** (no setup needed!). 

### Option 1: Use SQLite (Recommended for Development)

No action needed! The server will use SQLite automatically. The database file will be created at `backend/legal_case.db`.

### Option 2: Use PostgreSQL

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres`

2. **Create database**:
   ```sql
   CREATE DATABASE legal_case_db;
   ```

3. **Create `.env` file** in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/legal_case_db
   SECRET_KEY=your-secret-key-change-in-production
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

## Running the Server

```powershell
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start even if the database connection fails, but database features won't work.

## Troubleshooting

- **Database connection errors**: The server will start anyway with a warning. Database features will be disabled.
- **To use PostgreSQL**: Make sure PostgreSQL is running and update the `.env` file with correct credentials.
- **To use SQLite**: Just run the server - SQLite will work automatically!

## Testing

Once the server starts, visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
