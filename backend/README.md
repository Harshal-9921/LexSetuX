# Legal Case Analysis Backend API

FastAPI backend for the Legal Case Analysis platform.

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set Up Database**
   - Make sure PostgreSQL is running
   - Create a database: `CREATE DATABASE legal_case_db;`
   - Update `DATABASE_URL` in `.env` file

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the Server**
   ```bash
   # Development
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or use the main.py directly
   python app/main.py
   ```

5. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login/json` - Login with email/password (JSON)
- `POST /api/auth/login` - Login (OAuth2 form)
- `GET /api/auth/me` - Get current user info

### Case Analysis
- `POST /api/cases/analyze` - Analyze a legal case
- `GET /api/cases/my-cases` - Get user's cases
- `GET /api/cases/{case_id}` - Get specific case

### Lawyers
- `GET /api/lawyers` - List lawyers (with filters)
- `GET /api/lawyers/match` - Match lawyers for a case
- `GET /api/lawyers/{lawyer_id}` - Get lawyer details
- `POST /api/lawyers/` - Create/update lawyer profile
- `GET /api/lawyers/me/profile` - Get current user's lawyer profile

## Database Models

- **User**: User accounts with authentication
- **Case**: Legal cases submitted by users
- **Lawyer**: Lawyer profiles with specialization
- **CaseLawyerMatch**: Matching between cases and lawyers

## Notes

- The AI service uses pattern matching and data lookup from dataset files
- For production, integrate with actual ML models or OpenAI API
- Update `SECRET_KEY` in production
- Use Alembic for database migrations in production
