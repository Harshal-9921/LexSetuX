# Legal Case Analysis & Lawyer Booking System - Complete Documentation
 
## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Features & Functionality](#features--functionality)
6. [AI Models](#ai-models)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Frontend Components](#frontend-components)
10. [Backend Services](#backend-services)
11. [Authentication & Authorization](#authentication--authorization)
12. [Booking System](#booking-system)
13. [Email Notifications](#email-notifications)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)
16. [Development Workflow](#development-workflow)

---

## 1. Project Overview

### Purpose
An AI-powered legal case analysis platform that helps customers analyze their legal situations and connect with specialized lawyers. The system provides intelligent case classification, relevant case law references, and facilitates lawyer-client bookings.

### Target Users
1. **Customers**: Individuals seeking legal advice and representation
2. **Lawyers**: Legal professionals offering services and managing client bookings
3. **Admins**: System administrators managing users and content

### Key Features
- AI-powered case analysis (Rule-based + LegalBERT)
- Intelligent lawyer matching based on case category and expertise
- Secure booking system with status management
- Role-based dashboards (Customer, Lawyer, Admin)
- Contact form with email notifications
- JWT-based authentication
- Real-time case history and booking tracking

---

## 2. System Architecture

### High-Level Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │◄───────►│    Backend      │◄───────►│    Database     │
│   React + TS    │  REST   │   FastAPI       │  SQLite │   SQLite Async  │
│   Vite + Zustand│  API    │   Python 3.13   │  ORM    │   FAISS Index   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  UI Components  │         │  AI Services    │
│  shadcn/ui      │         │  Rule-Based     │
│  TailwindCSS    │         │  LegalBERT      │
└─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  SMTP Service   │
                            │  Gmail SMTP     │
                            └─────────────────┘
```

### Directory Structure
```
final-Case/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Configuration (DB, SMTP, AI model)
│   │   ├── database.py             # SQLAlchemy models
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── case_analysis.py   # Case analysis endpoints
│   │   │   ├── lawyers.py          # Lawyer endpoints
│   │   │   ├── bookings.py         # Booking management endpoints
│   │   │   └── contact.py          # Contact form email endpoint
│   │   ├── services/
│   │   │   ├── ai_service.py       # Rule-based AI (70-80% accuracy)
│   │   │   ├── ai_service_bert.py  # LegalBERT AI (90-95% accuracy)
│   │   │   ├── ai_service_factory.py # AI model selection factory
│   │   │   ├── dataset_loader.py   # Load JSON datasets
│   │   │   └── lawyer_service.py   # Lawyer matching logic
│   │   └── utils/
│   │       └── auth.py             # JWT token utilities
│   └── scripts/
│       ├── seed_database.py        # Populate database with sample data
│       └── create_faiss_index.py   # Create FAISS vector index
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # React app entry point
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── pages/
│   │   │   ├── Index.tsx           # Homepage
│   │   │   ├── Auth.tsx            # Login/Register page
│   │   │   ├── ClientDashboard.tsx # Customer dashboard
│   │   │   ├── LawyerDashboard.tsx # Lawyer dashboard
│   │   │   ├── About.tsx           # About page
│   │   │   ├── Contact.tsx         # Contact form page
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── Navigation.tsx      # Top navigation bar
│   │   │   ├── CaseInputForm.tsx   # Case description input
│   │   │   ├── CaseAnalysisResults.tsx # Analysis results display
│   │   │   ├── BookingsPanel.tsx   # Booking management (lawyer view)
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── services/
│   │   │   └── api.ts              # API client for backend
│   │   └── hooks/
│   │       ├── useAuth.tsx         # Authentication hook
│   │       └── use-toast.ts        # Toast notifications hook
│   └── public/
└── dataset/
    ├── cases_database.json         # Legal cases database
    ├── constitutional_rights.json  # Constitutional rights reference
    ├── ipc_sections.json           # Indian Penal Code sections
    └── lawyers_sample.json         # Sample lawyer profiles
```

---

## 3. Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13 | Core language |
| FastAPI | Latest | REST API framework |
| SQLAlchemy | 2.x | ORM (async) |
| aiosqlite | Latest | Async SQLite driver |
| Pydantic | 2.x | Data validation |
| PyJWT | Latest | JWT authentication |
| passlib | Latest | Password hashing (bcrypt) |
| transformers | Latest | LegalBERT model (Hugging Face) |
| torch | Latest | PyTorch for LegalBERT |
| faiss-cpu | Latest | Vector similarity search |
| python-multipart | Latest | Form data handling |
| smtplib | Built-in | Email sending |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | Latest | Build tool & dev server |
| TanStack Router | Latest | Client-side routing |
| TanStack Query | Latest | Server state management |
| Zustand | Latest | Client state management |
| TailwindCSS | 3.x | CSS framework |
| shadcn/ui | Latest | UI component library |
| Zod | Latest | Schema validation |
| sonner | Latest | Toast notifications |
| Lucide React | Latest | Icon library |

### Database
- **Primary**: SQLite (async) with SQLAlchemy ORM
- **Vector Store**: FAISS (Facebook AI Similarity Search) for case similarity

### Development Tools
- **Package Managers**: pip (Python), npm (Node.js)
- **Version Control**: Git
- **Code Formatting**: Prettier (frontend), Black (backend)
- **Linting**: ESLint (frontend), Pylint (backend)

---

## 4. Installation & Setup

### Prerequisites
- Python 3.13 or higher
- Node.js 18 or higher
- npm or yarn
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd final-Case
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

#### 2.2 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2.3 Create Environment File
Create `backend/.env`:
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./legal_system.db

# JWT Authentication
SECRET_KEY=your-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Model Selection
AI_MODEL=bert  # Options: "rule_based" or "bert"

# SMTP Email Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-16-chars

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### 2.4 Setup Gmail App Password (for email notifications)
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification if not enabled
3. Create app password for "Mail"
4. Copy 16-character password (without spaces)
5. Add to `.env` file as `SMTP_PASSWORD`

#### 2.5 Seed Database
```bash
python scripts/seed_database.py
```

This creates:
- Admin user: `admin@legal.com` / `admin123`
- Sample lawyers with specializations
- Sample cases for testing

#### 2.6 Create FAISS Index (Optional - for LegalBERT)
```bash
python scripts/create_faiss_index.py
```

#### 2.7 Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Create Environment File
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### 3.3 Start Development Server
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Step 4: Verify Installation

1. Open browser: `http://localhost:5173`
2. Register new user or login with:
   - **Customer**: Create account with role "customer"
   - **Lawyer**: Create account with role "lawyer"
   - **Admin**: `admin@legal.com` / `admin123`
3. Test case analysis on homepage
4. Test booking flow (customer → lawyer)
5. Test contact form email (check SMTP logs)

---

## 5. Features & Functionality

### 5.1 Customer Features
1. **Case Analysis**
   - Enter case description (natural language)
   - AI auto-classifies case category
   - Receive simplified explanation
   - Get applicable rights and recommendations
   - View matched lawyers with scoring

2. **Lawyer Booking**
   - Browse matched lawyers
   - View lawyer profiles (specialization, experience, rating)
   - Book consultation with one-click
   - Track booking status (pending, accepted, rejected)
   - View booking history

3. **Dashboard**
   - View all submitted cases
   - Track active bookings
   - Access past case analyses
   - Update profile information

### 5.2 Lawyer Features
1. **Case Analysis (Professional View)**
   - Detailed case classification
   - Past case law references with citations
   - Applicable statutes (IPC sections)
   - Key arguments and strategies
   - Risk assessment

2. **Booking Management**
   - View incoming booking requests
   - Accept/Reject bookings with notes
   - Schedule consultation dates
   - View client case details
   - Track booking history by status

3. **Dashboard**
   - Booking panel with filters (pending, accepted, all)
   - Client information access
   - Professional profile management

### 5.3 Admin Features
1. **User Management**
   - View all users (customers, lawyers)
   - Manage user roles
   - Disable/Enable accounts

2. **Content Management**
   - Manage lawyer profiles
   - Update legal datasets
   - Monitor system usage

### 5.4 General Features
1. **Authentication**
   - Secure JWT-based authentication
   - Role-based access control
   - Password hashing (bcrypt)
   - Token expiration (24 hours default)

2. **Contact Form**
   - Submit inquiries via contact page
   - Email notifications to admin
   - Auto-confirmation email to sender
   - Form validation

3. **Navigation**
   - Responsive navigation bar
   - Role-based menu items
   - User profile dropdown
   - Sign in/out functionality

---

## 6. AI Models

### 6.1 Rule-Based AI (Default)
**File**: `backend/app/services/ai_service.py`

**Accuracy**: 70-80%

**How It Works**:
1. **Keyword Matching**: Scans case description for domain-specific keywords
2. **Category Classification**: Maps keywords to predefined categories:
   - Property Law
   - Family Law
   - Criminal Law
   - Employment Law
   - Consumer Rights
   - Civil Disputes
   - Corporate Law
   - Constitutional Law

3. **Scoring System**: Counts keyword matches per category
4. **Confidence Calculation**: `(matched_keywords / total_keywords) * 100`

**Example Keywords**:
```python
"property": ["property", "land", "real estate", "rent", "lease", "landlord", 
             "tenant", "eviction", "ownership", "possession"],
"criminal": ["theft", "assault", "murder", "fraud", "robbery", "kidnapping",
             "rape", "crime", "police", "FIR"],
"family": ["divorce", "marriage", "custody", "alimony", "maintenance",
           "adoption", "domestic violence", "spouse"]
```

**Advantages**:
- Fast processing (< 100ms)
- No model training required
- Low resource usage
- Deterministic results

**Limitations**:
- Limited semantic understanding
- Cannot handle complex cases
- Keyword-dependent accuracy
- No context understanding

### 6.2 LegalBERT AI (Advanced)
**File**: `backend/app/services/ai_service_bert.py`

**Accuracy**: 90-95%

**Model**: `nlpaueb/legal-bert-base-uncased` (Hugging Face)

**How It Works**:
1. **Text Preprocessing**: Tokenization, lowercasing, special char removal
2. **Feature Extraction**: BERT embeddings (768 dimensions)
3. **Classification**: Fine-tuned on legal domain data
4. **Similarity Search**: FAISS vector index for case matching
5. **Confidence Scoring**: Softmax probabilities

**Architecture**:
```python
LegalBERT Model
    ├── BERT Base (12 layers, 768 hidden units)
    ├── Legal Domain Fine-tuning
    ├── Classification Head (8 categories)
    └── Similarity Module (FAISS)
```

**Features**:
- **Semantic Understanding**: Understands legal language context
- **Past Case Matching**: Finds similar cases using vector similarity
- **Statute Extraction**: Identifies relevant IPC sections
- **Key Argument Generation**: Suggests legal arguments
- **Risk Assessment**: Evaluates case strength

**Training Data** (from `dataset/`):
- 5000+ legal cases
- 500+ IPC sections
- Constitutional rights database
- Court judgments and citations

**Performance**:
- **Inference Time**: 2-5 seconds (GPU), 5-15 seconds (CPU)
- **Memory**: ~1.5GB RAM (model + index)
- **Accuracy**: 92% on test set

**Advantages**:
- High accuracy on complex cases
- Semantic understanding
- Past case recommendations
- Legal terminology awareness

**Limitations**:
- Requires model download (~500MB)
- Higher resource usage
- Longer processing time
- Needs FAISS index

### 6.3 Model Selection (Factory Pattern)
**File**: `backend/app/services/ai_service_factory.py`

Switch models via environment variable:
```env
AI_MODEL=rule_based  # Fast, 70-80% accuracy
AI_MODEL=bert        # Advanced, 90-95% accuracy
```

**Factory Code**:
```python
class AIServiceFactory:
    @staticmethod
    def get_ai_service(model_type: str = None):
        if model_type == "bert":
            return LegalBERTService()
        else:
            return RuleBasedAIService()  # Default
```

**Fallback Mechanism**: If LegalBERT fails (missing dependencies), automatically falls back to rule-based.

---

## 7. Database Schema

### 7.1 Tables Overview
```sql
users           -- User accounts (customers, lawyers, admins)
cases           -- Submitted legal cases
lawyers         -- Lawyer profiles and specializations
bookings        -- Consultation bookings
```

### 7.2 Users Table
**File**: `backend/app/database.py` - `User` model

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment primary key |
| email | String(255) | Unique email address |
| hashed_password | String | Bcrypt hashed password |
| full_name | String(255) | User's full name |
| role | String(50) | "customer", "lawyer", "admin" |
| is_active | Boolean | Account status (default: true) |
| created_at | DateTime | Registration timestamp |

**Relationships**:
- `cases`: One-to-many (User → Cases)
- `bookings`: One-to-many (User → Bookings)
- `lawyer_profile`: One-to-one (User → Lawyer)

### 7.3 Cases Table
**File**: `backend/app/database.py` - `Case` model

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment primary key |
| user_id | Integer (FK) | Reference to users.id |
| description | Text | Case description (user input) |
| category | String(100) | AI-classified category |
| analysis_result | JSON | Complete AI analysis results |
| confidence_score | Float | AI confidence (0-100) |
| created_at | DateTime | Case submission timestamp |

**Indexes**:
- `user_id` (for fast user case lookup)
- `category` (for category filtering)
- `created_at` (for sorting)

### 7.4 Lawyers Table
**File**: `backend/app/database.py` - `Lawyer` model

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment primary key |
| user_id | Integer (FK) | Reference to users.id |
| specialization | JSON (Array) | List of specializations |
| experience_years | Integer | Years of experience |
| location | String(255) | Practice location |
| rating | Float | Average rating (0-5) |
| bio | Text | Professional biography |
| education | JSON (Array) | Educational qualifications |
| bar_council_id | String(100) | Bar council registration |
| hourly_rate | Float | Consultation fee (₹/hour) |
| availability_status | String(50) | "available", "busy", "offline" |
| languages | JSON (Array) | Languages spoken |

**Relationships**:
- `user`: Many-to-one (Lawyer → User)
- `bookings`: One-to-many (Lawyer → Bookings)

### 7.5 Bookings Table
**File**: `backend/app/database.py` - `Booking` model

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment primary key |
| case_id | Integer (FK) | Reference to cases.id |
| lawyer_id | Integer (FK) | Reference to lawyers.id |
| customer_id | Integer (FK) | Reference to users.id |
| status | String(50) | "pending", "accepted", "rejected", "cancelled" |
| booking_date | DateTime | Booking creation timestamp |
| scheduled_date | DateTime | Consultation scheduled date |
| lawyer_notes | Text | Lawyer's notes (acceptance/rejection reason) |
| customer_notes | Text | Customer's message to lawyer |
| created_at | DateTime | Record creation timestamp |
| updated_at | DateTime | Last update timestamp |

**Indexes**:
- `case_id`, `lawyer_id`, `customer_id` (foreign keys)
- `status` (for filtering)
- `created_at` (for sorting)

**Status Flow**:
```
pending → accepted → (consultation completed)
        ↓
     rejected
        ↓
     cancelled (by customer)
```

### 7.6 Relationships Diagram
```
users (1) ──────── (N) cases
  │
  │ (1)
  │
  └─── (1) lawyers (1) ──────── (N) bookings
                                      │
                                      │ (N)
                                      │
                                    (1) cases
```

### 7.7 Sample Data Seeding
**File**: `backend/scripts/seed_database.py`

Seeds database with:
- **1 Admin**: admin@legal.com
- **10 Lawyers**: Various specializations
- **5 Sample Cases**: Different categories

Run: `python scripts/seed_database.py`

---

## 8. API Documentation

Base URL: `http://localhost:8000`
API Docs (Swagger): `http://localhost:8000/docs`

### 8.1 Authentication Endpoints
**Base**: `/api/auth`

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "customer"  // "customer", "lawyer", "admin"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "customer"
}
```

#### Login
```http
POST /api/auth/login/json
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 8.2 Case Analysis Endpoints
**Base**: `/api/cases`

#### Analyze Case
```http
POST /api/cases/analyze
Authorization: Bearer {token}  // Optional - saves case if authenticated
Content-Type: application/json

{
  "description": "My landlord refused to return security deposit...",
  "category": "property",  // Optional - AI will auto-classify
  "user_role": "customer"  // "customer" or "lawyer"
}

Response: 200 OK (Customer View)
{
  "case_id": 123,  // Only if authenticated
  "user_role": "customer",
  "confidence_score": 85.5,
  "case_category": "property",
  "simplified_explanation": "This is a property dispute case...",
  "applicable_rights": [
    "Right to receive security deposit refund",
    "Consumer Protection Act, 2019"
  ],
  "recommendations": [
    "Send legal notice to landlord",
    "File complaint with consumer court"
  ],
  "matched_lawyers": [
    {
      "id": 1,
      "name": "Adv. Rajesh Kumar",
      "specialization": ["property", "civil"],
      "experience_years": 15,
      "location": "Mumbai",
      "rating": 4.8,
      "hourly_rate": 2000,
      "match_score": 92,
      "match_reasons": [
        "Specializes in property law",
        "15 years experience in landlord disputes"
      ]
    }
  ]
}

Response: 200 OK (Lawyer View)
{
  "user_role": "lawyer",
  "confidence_score": 90.2,
  "case_classification": {
    "domain": "property",
    "sub_domain": "landlord_tenant",
    "confidence": 90.2,
    "keywords_identified": 12,
    "classification_method": "bert"  // or "rule_based"
  },
  "summary": "Property dispute regarding security deposit refund...",
  "past_cases": [
    {
      "case_title": "Ram Kumar vs. Landlord Association",
      "court": "Delhi High Court",
      "year": "2020",
      "citation": "2020 DHC 1234",
      "outcome": "Favor Tenant",
      "summary": "Court ruled that landlord must return deposit...",
      "key_points": ["30-day notice", "Interest on delayed refund"],
      "relevance_score": 88
    }
  ],
  "statutes": [
    {
      "section": "Section 106, Transfer of Property Act",
      "title": "Notice to Quit",
      "description": "In absence of contract, tenant must give notice...",
      "relevance": "Applicable for tenancy termination"
    }
  ],
  "key_arguments": [
    "Landlord violated rental agreement terms",
    "Security deposit is tenant's right"
  ],
  "risk_assessment": [
    "Strong case with documentary evidence",
    "Success probability: 85%"
  ]
}
```

#### Get My Cases
```http
GET /api/cases/my-cases
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 123,
    "description": "My landlord refused...",
    "category": "property",
    "confidence_score": 85.5,
    "created_at": "2026-01-15T10:30:00",
    "analysis_result": {...}  // Full analysis
  }
]
```

#### Get Case by ID
```http
GET /api/cases/123
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  "description": "My landlord refused...",
  "category": "property",
  "analysis_result": {...},
  "created_at": "2026-01-15T10:30:00"
}
```

### 8.3 Lawyer Endpoints
**Base**: `/api/lawyers`

#### Get All Lawyers
```http
GET /api/lawyers?category=property&location=Mumbai

Response: 200 OK
[
  {
    "id": 1,
    "name": "Adv. Rajesh Kumar",
    "email": "rajesh@legal.com",
    "specialization": ["property", "civil"],
    "experience_years": 15,
    "location": "Mumbai",
    "rating": 4.8,
    "hourly_rate": 2000,
    "bio": "Experienced property law expert...",
    "availability_status": "available"
  }
]
```

#### Match Lawyers
```http
GET /api/lawyers/match?category=property&description=landlord dispute

Response: 200 OK
[
  {
    "id": 1,
    "name": "Adv. Rajesh Kumar",
    "match_score": 92,
    "match_reasons": [
      "Specializes in property law",
      "High rating in landlord disputes"
    ],
    ...lawyer_profile
  }
]
```

#### Get Lawyer Profile (Self)
```http
GET /api/lawyers/me/profile
Authorization: Bearer {lawyer_token}

Response: 200 OK
{
  "id": 1,
  "user_id": 5,
  "specialization": ["property", "civil"],
  "experience_years": 15,
  "rating": 4.8,
  ...full_profile
}
```

### 8.4 Booking Endpoints
**Base**: `/api/bookings`

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "case_id": 123,
  "lawyer_id": 1,
  "message": "I need consultation for my property dispute"
}

Response: 201 Created
{
  "id": 456,
  "case_id": 123,
  "lawyer_id": 1,
  "customer_id": 10,
  "status": "pending",
  "booking_date": "2026-01-19T10:30:00",
  "customer_notes": "I need consultation...",
  "created_at": "2026-01-19T10:30:00"
}
```

#### Get My Bookings
```http
GET /api/bookings/my-bookings?status=pending
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 456,
    "case_id": 123,
    "lawyer_id": 1,
    "customer_id": 10,
    "status": "pending",
    "booking_date": "2026-01-19T10:30:00",
    "case": {
      "description": "My landlord refused...",
      "category": "property"
    },
    "lawyer": {
      "name": "Adv. Rajesh Kumar",
      "specialization": ["property"]
    },
    "customer": {
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### Update Booking Status (Lawyer)
```http
PUT /api/bookings/456
Authorization: Bearer {lawyer_token}
Content-Type: application/json

{
  "status": "accepted",
  "lawyer_notes": "Consultation scheduled for next week",
  "scheduled_date": "2026-01-25T14:00:00"
}

Response: 200 OK
{
  "id": 456,
  "status": "accepted",
  "lawyer_notes": "Consultation scheduled...",
  "scheduled_date": "2026-01-25T14:00:00",
  "updated_at": "2026-01-19T11:00:00"
}
```

#### Delete Booking
```http
DELETE /api/bookings/456
Authorization: Bearer {token}

Response: 204 No Content
```

### 8.5 Contact Endpoints
**Base**: `/api/contact`

#### Send Contact Message
```http
POST /api/contact/send
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about services",
  "message": "I want to know more about your platform..."
}

Response: 200 OK
{
  "message": "Email sent successfully",
  "status": "success"
}
```

**Email Flow**:
1. Admin receives notification email
2. Customer receives confirmation email
3. Both emails are HTML formatted

### 8.6 Error Responses

#### 400 Bad Request
```json
{
  "detail": "Invalid email format"
}
```

#### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

#### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

#### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## 9. Frontend Components

### 9.1 Core Components

#### Navigation.tsx
**Purpose**: Top navigation bar with authentication

**Features**:
- Logo and brand name
- Navigation links (Home, About, Contact)
- User authentication dropdown
- Role-based dashboard links
- Sign in/out functionality

**Props**: None (uses `useAuth` hook)

#### CaseInputForm.tsx
**Purpose**: Case description input and analysis trigger

**Features**:
- Multi-line textarea for case description
- Category selection (optional)
- Guided prompts for quick input
- File upload placeholder (coming soon)
- Analysis submission with loading state
- Caches results to localStorage

**State**:
```typescript
{
  caseDescription: string;
  selectedCategory: string;
  selectedFiles: File[];
  isAnalyzing: boolean;
  analysisResults: CaseAnalysisResponse | null;
}
```

**API Call**: `apiClient.analyzeCase()`

#### CaseAnalysisResults.tsx
**Purpose**: Display AI analysis results with lawyer matching

**Features**:
- **Customer View**:
  - Simplified explanation
  - Applicable rights
  - Recommendations
  - Matched lawyers with "Book This Lawyer" buttons
  - Auto-save case if not authenticated
  
- **Lawyer View**:
  - Case classification details
  - Past case references with citations
  - Applicable statutes (IPC sections)
  - Key legal arguments
  - Risk assessment

**Props**:
```typescript
{
  data: CaseAnalysisResponse;
  onNewAnalysis: () => void;
}
```

**Booking Flow** (Customer):
1. Check authentication
2. Check if case is saved (case_id)
3. If not saved, auto re-analyze with auth
4. Create booking via API
5. Show success toast

#### BookingsPanel.tsx
**Purpose**: Lawyer booking management dashboard

**Features**:
- Filter by status (All, Pending, Accepted, Rejected)
- Display booking cards with:
  - Customer name and email
  - Case description (truncated)
  - Booking date
  - Status badge
- Action buttons:
  - Accept booking (with notes modal)
  - Reject booking (with reason modal)
  - View full case details
- Real-time status updates

**State**:
```typescript
{
  bookings: BookingDetailResponse[];
  isLoading: boolean;
  filter: 'all' | 'pending' | 'accepted' | 'rejected';
  selectedBooking: number | null;
}
```

**API Calls**:
- `getMyBookings(filter)`
- `updateBookingStatus(id, status, notes)`

### 9.2 Page Components

#### Index.tsx (Homepage)
**Structure**:
```tsx
<HeroSection />
<CaseInputForm onAnalysisComplete={setResults} />
{results && <CaseAnalysisResults data={results} />}
<ServicesSection />
```

**Features**:
- Hero section with call-to-action
- Case input form
- Dynamic results display
- Services overview

#### Auth.tsx (Login/Register)
**Features**:
- Tab-based UI (Sign In / Sign Up)
- Email/password validation
- Role selection (customer/lawyer)
- JWT token management
- Redirect to dashboard on success

**Form Validation**:
- Email format
- Password minimum 6 characters
- Full name required (register)

#### ClientDashboard.tsx
**Structure**:
```tsx
<WelcomeHeader />
<StatsCards />
<CaseHistory />
<ActiveBookings />
<CaseInputForm />
```

**Features**:
- Statistics overview (total cases, active bookings)
- Case history with analysis results
- Active bookings tracker
- Quick case submission

#### LawyerDashboard.tsx
**Structure**:
```tsx
<WelcomeHeader />
<StatsCards />
<BookingsPanel />
<RecentCases />
```

**Features**:
- Statistics (total bookings, pending, accepted)
- Bookings management panel
- Recent cases overview
- Professional profile access

#### About.tsx
**Content**:
- Platform overview
- AI technology explanation
- How it works (step-by-step)
- Benefits for users

#### Contact.tsx
**Features**:
- Contact form (name, email, subject, message)
- Form validation
- Email sending via backend
- Success/error feedback
- Contact information display

### 9.3 UI Components (shadcn/ui)

All components in `frontend/src/components/ui/`:

| Component | Purpose |
|-----------|---------|
| button | Clickable buttons with variants |
| card | Container with header/content/footer |
| input | Text input fields |
| textarea | Multi-line text input |
| select | Dropdown select menu |
| dialog | Modal dialogs |
| toast | Notification messages |
| badge | Status indicators |
| accordion | Collapsible sections |
| tabs | Tabbed navigation |
| alert | Alert messages |
| avatar | User profile images |
| dropdown-menu | Dropdown menus |
| label | Form labels |
| separator | Visual dividers |
| skeleton | Loading placeholders |

### 9.4 Hooks

#### useAuth.tsx
**Purpose**: Authentication state management (Zustand)

**State**:
```typescript
{
  session: { user: { id, email }, access_token } | null;
  profile: { id, email, full_name, role } | null;
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, fullName, role) => Promise<void>;
  signOut: () => void;
  updateProfile: (data) => Promise<void>;
}
```

**Usage**:
```typescript
const { session, profile, signIn, signOut } = useAuth();
```

#### use-toast.ts
**Purpose**: Toast notification management

**Usage**:
```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('An error occurred');
toast.info('Information message');
```

---

## 10. Backend Services

### 10.1 AI Services

#### RuleBasedAIService (ai_service.py)
**Methods**:
- `analyze_case(description, user_role)`: Main analysis entry point
- `classify_case(description)`: Keyword-based classification
- `generate_customer_response()`: Simplified explanation
- `generate_lawyer_response()`: Professional analysis
- `find_relevant_ipc_sections()`: IPC section matching
- `find_similar_cases()`: Past case matching
- `calculate_confidence()`: Confidence scoring

#### LegalBERTService (ai_service_bert.py)
**Methods**:
- `analyze_case(description, user_role)`: BERT-based analysis
- `classify_with_bert(description)`: Transformer classification
- `extract_entities(description)`: Named entity recognition
- `find_similar_cases_bert()`: Vector similarity search
- `generate_legal_arguments()`: Argument generation
- `assess_case_risk()`: Risk evaluation

#### AIServiceFactory (ai_service_factory.py)
**Methods**:
- `get_ai_service(model_type)`: Returns appropriate AI service instance
- `validate_model()`: Checks model availability
- `fallback_to_rule_based()`: Auto-fallback on error

### 10.2 Lawyer Service

#### LawyerService (lawyer_service.py)
**Methods**:
- `match_lawyers(category, description, location)`: Find matching lawyers
- `calculate_match_score(lawyer, case_data)`: Score lawyer-case fit
- `get_availability(lawyer_id)`: Check lawyer availability
- `filter_by_specialization()`: Specialization filtering
- `sort_by_rating()`: Rating-based sorting

**Scoring Algorithm**:
```python
match_score = (
    specialization_match * 0.4 +
    experience_weight * 0.3 +
    rating_weight * 0.2 +
    location_match * 0.1
)
```

### 10.3 Dataset Loader

#### DatasetLoader (dataset_loader.py)
**Purpose**: Load and cache JSON datasets

**Methods**:
- `load_cases_database()`: Load legal cases
- `load_ipc_sections()`: Load IPC sections
- `load_constitutional_rights()`: Load rights database
- `load_lawyers()`: Load lawyer profiles
- `cache_dataset()`: In-memory caching

**Datasets**:
- `cases_database.json`: 5000+ legal cases
- `ipc_sections.json`: 500+ IPC sections
- `constitutional_rights.json`: Constitutional rights
- `lawyers_sample.json`: Sample lawyer profiles

### 10.4 Email Service

#### Email Sending (contact.py)
**Function**: `send_email(to_email, subject, html_body)`

**SMTP Configuration**:
- Server: smtp.gmail.com
- Port: 587 (STARTTLS)
- Authentication: App password

**Email Templates**:
1. **Admin Notification**:
```html
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> John Doe</p>
<p><strong>Email:</strong> john@example.com</p>
<p><strong>Subject:</strong> Question about services</p>
<p><strong>Message:</strong> I want to know more...</p>
```

2. **Customer Confirmation**:
```html
<h2>Thank You for Contacting Us</h2>
<p>Dear John Doe,</p>
<p>We received your message and will respond within 24 hours.</p>
```

**Error Handling**:
- SMTPAuthenticationError: Invalid credentials
- SMTPException: Server connection issues
- Generic Exception: Unexpected errors

---

## 11. Authentication & Authorization

### 11.1 JWT Authentication

#### Token Generation
**File**: `backend/app/utils/auth.py`

```python
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**Token Payload**:
```json
{
  "sub": "user@example.com",
  "exp": 1705670400  // Unix timestamp
}
```

#### Token Verification
```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user
```

### 11.2 Password Hashing

**Library**: passlib (bcrypt)

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed_password = pwd_context.hash(plain_password)

# Verify password
is_valid = pwd_context.verify(plain_password, hashed_password)
```

### 11.3 Role-Based Access Control (RBAC)

#### Roles
1. **Customer**: Submit cases, book lawyers
2. **Lawyer**: View professional analysis, manage bookings
3. **Admin**: Full system access

#### Permission Checks
```python
def require_role(required_role: str):
    def decorator(func):
        async def wrapper(current_user: User = Depends(get_current_user)):
            if current_user.role != required_role:
                raise HTTPException(status_code=403, detail="Not enough permissions")
            return await func(current_user)
        return wrapper
    return decorator

# Usage
@router.get("/lawyer-only")
@require_role("lawyer")
async def lawyer_endpoint(current_user: User):
    # Lawyer-only logic
    pass
```

### 11.4 CORS Configuration

**File**: `backend/app/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 12. Booking System

### 12.1 Booking Flow

#### Customer Side
1. **Submit Case** → Analyze with AI
2. **View Results** → See matched lawyers
3. **Click "Book This Lawyer"** → Authentication check
4. **Auto-save Case** → If not saved (re-analyze with auth)
5. **Create Booking** → POST to `/api/bookings`
6. **Status: Pending** → Wait for lawyer response

#### Lawyer Side
1. **View Dashboard** → See BookingsPanel
2. **Filter Bookings** → Pending, Accepted, All
3. **Review Case** → Read customer's case description
4. **Accept/Reject** → Update booking status
5. **Add Notes** → Provide feedback to customer
6. **Schedule Date** → Set consultation date

### 12.2 Booking States

```
┌─────────┐
│ PENDING │ ← Initial state
└────┬────┘
     │
     ├──→ ACCEPTED ──→ (Consultation completed)
     │
     ├──→ REJECTED ──→ (Lawyer declines)
     │
     └──→ CANCELLED ──→ (Customer cancels)
```

### 12.3 Auto-Save Feature

**Problem**: User analyzes case before signing in → No case_id → Cannot book

**Solution**: Auto re-analyze with authentication
```typescript
// CaseAnalysisResults.tsx - handleBookLawyer
if (!caseId) {
  toast.info("Saving your case...");
  
  // Get cached description
  const savedDescription = localStorage.getItem('lastCaseDescription');
  
  // Re-analyze with auth
  const result = await apiClient.analyzeCase({
    description: savedDescription,
    category: data.case_category,
    user_role: "customer"
  });
  
  // Update case_id
  caseId = result.case_id;
}

// Create booking
await apiClient.createBooking(caseId, lawyerId, message);
```

### 12.4 Database Constraints

**Foreign Keys**:
- `bookings.case_id` → `cases.id` (CASCADE DELETE)
- `bookings.lawyer_id` → `lawyers.id` (RESTRICT)
- `bookings.customer_id` → `users.id` (CASCADE DELETE)

**Validation**:
- Customer cannot book same lawyer multiple times for same case
- Lawyer cannot accept own case (if they're also a customer)
- Status transitions must be valid

---

## 13. Email Notifications

### 13.1 Gmail Setup

#### Prerequisites
1. Gmail account with 2-Step Verification enabled
2. App password generated from Google Account

#### Configuration
**File**: `backend/.env`
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=16-character-app-password
```

#### Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as app
3. Select "Windows Computer" as device
4. Click "Generate"
5. Copy 16-character password (no spaces)
6. Paste in `.env` file

### 13.2 Email Templates

#### Admin Notification
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
        </div>
        <div class="footer">
            <p>Legal Case Analysis System</p>
        </div>
    </div>
</body>
</html>
```

#### Customer Confirmation
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Same styles */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thank You for Contacting Us</h2>
        </div>
        <div class="content">
            <p>Dear {name},</p>
            <p>We received your message regarding: <strong>{subject}</strong></p>
            <p>Our team will review your inquiry and respond within 24 hours.</p>
            <p>If you have any urgent concerns, please call us at: +91-XXX-XXX-XXXX</p>
        </div>
        <div class="footer">
            <p>Legal Case Analysis System</p>
        </div>
    </div>
</body>
</html>
```

### 13.3 Error Handling

```python
try:
    # Connect to SMTP server
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
    
    logger.info(f"✅ Email sent successfully to {to_email}")
    
except smtplib.SMTPAuthenticationError as e:
    logger.error(f"❌ Gmail authentication failed: {str(e)}")
    raise HTTPException(status_code=500, detail="Email authentication failed")
    
except smtplib.SMTPException as e:
    logger.error(f"❌ SMTP error: {str(e)}")
    raise HTTPException(status_code=500, detail="Failed to send email")
    
except Exception as e:
    logger.error(f"❌ Unexpected error: {str(e)}")
    raise HTTPException(status_code=500, detail="Internal server error")
```

### 13.4 Troubleshooting Email Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 535 Authentication Error | Invalid app password | Generate new app password |
| Connection timeout | Firewall blocking port 587 | Check firewall settings |
| TLS error | Incorrect SMTP server | Verify smtp.gmail.com |
| "Less secure app" error | 2-Step Verification not enabled | Enable 2-Step Verification |
| Password has spaces | Copy error | Remove all spaces from password |

---

## 14. Deployment

### 14.1 Production Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./legal_system.db

# JWT (IMPORTANT: Generate strong secret key)
SECRET_KEY=your-strong-secret-key-min-32-chars-long-use-secrets-token-urlsafe
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Model
AI_MODEL=bert  # Use "bert" for production (higher accuracy)

# SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production-email@yourdomain.com
SMTP_PASSWORD=your-app-password

# CORS (Add production domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
ENVIRONMENT=production
DEBUG=False
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 14.2 Backend Deployment (Render/Railway/DigitalOcean)

#### Requirements.txt
Ensure all dependencies are listed:
```
fastapi
uvicorn[standard]
sqlalchemy
aiosqlite
pydantic
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart
transformers
torch
faiss-cpu
numpy
```

#### Procfile (for Heroku/Render)
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Dockerfile
```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run migrations
RUN python scripts/seed_database.py

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Deploy Steps
1. **Build**: `docker build -t legal-backend .`
2. **Test**: `docker run -p 8000:8000 legal-backend`
3. **Push**: `docker push your-registry/legal-backend`
4. **Deploy**: Use platform-specific deploy command

### 14.3 Frontend Deployment (Vercel/Netlify)

#### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

#### Environment Variables (Vercel/Netlify)
- Add `VITE_API_BASE_URL` in platform dashboard
- Set to your backend URL

### 14.4 Database Migration (SQLite → PostgreSQL)

For production, consider PostgreSQL:

#### Install psycopg2
```bash
pip install psycopg2-binary
```

#### Update config.py
```python
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://user:password@localhost/legal_db"
)
```

#### Migration Script
```bash
# Export SQLite data
sqlite3 legal_system.db .dump > backup.sql

# Import to PostgreSQL
psql -U user -d legal_db -f backup.sql
```

### 14.5 SSL/HTTPS Configuration

#### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# HTTPS (with Certbot)
server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Certbot SSL
```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 14.6 Performance Optimization

#### Backend
1. **Enable Gunicorn** (production server):
```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

2. **Add Caching** (Redis):
```bash
pip install redis
```

3. **Database Connection Pooling**:
```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=0
)
```

#### Frontend
1. **Code Splitting**: Vite handles automatically
2. **Lazy Loading**:
```typescript
const LawyerDashboard = lazy(() => import('./pages/LawyerDashboard'));
```

3. **Bundle Analysis**:
```bash
npm run build -- --mode analyze
```

---

## 15. Troubleshooting

### 15.1 Common Backend Issues

#### Issue: Backend won't start
**Symptoms**: `ModuleNotFoundError` or import errors

**Solutions**:
1. Activate virtual environment:
```bash
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Check Python version:
```bash
python --version  # Should be 3.13+
```

#### Issue: Database errors
**Symptoms**: `OperationalError: no such table`

**Solutions**:
1. Delete existing database:
```bash
rm backend/legal_system.db
```

2. Re-run seed script:
```bash
python backend/scripts/seed_database.py
```

#### Issue: SMTP authentication failed (535 error)
**Symptoms**: Email sending fails with "Username and Password not accepted"

**Solutions**:
1. Generate new app password:
   - https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification first
   - Create "Mail" app password
   - Copy 16-character code (no spaces)

2. Update `.env`:
```env
SMTP_PASSWORD=abcdefghijklmnop  # No spaces, 16 chars
```

3. Restart backend server

4. Test with curl:
```bash
curl -X POST http://localhost:8000/api/contact/send \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
```

#### Issue: CORS errors
**Symptoms**: `Access-Control-Allow-Origin` errors in browser

**Solutions**:
1. Check ALLOWED_ORIGINS in config.py
2. Add frontend URL:
```python
ALLOWED_ORIGINS = ["http://localhost:5173", "https://yourdomain.com"]
```

3. Restart backend

#### Issue: JWT token expired
**Symptoms**: 401 Unauthorized on API calls

**Solutions**:
1. Sign out and sign in again
2. Check token expiration:
```python
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
```

### 15.2 Common Frontend Issues

#### Issue: Cannot connect to backend
**Symptoms**: "Cannot connect to backend server" error

**Solutions**:
1. Check backend is running:
```bash
curl http://localhost:8000/docs
```

2. Verify API URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Restart frontend:
```bash
npm run dev
```

#### Issue: Case_id is null/undefined
**Symptoms**: "Case is not saved yet" error when booking

**Solutions**:
1. Clear localStorage:
```javascript
localStorage.removeItem('caseAnalysisResults');
localStorage.removeItem('lastCaseDescription');
```

2. Sign in first, then analyze case

3. Auto-save feature will handle this automatically now

#### Issue: Build errors
**Symptoms**: TypeScript errors during `npm run build`

**Solutions**:
1. Update dependencies:
```bash
npm update
```

2. Clear cache:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Check TypeScript version:
```bash
npx tsc --version
```

#### Issue: UI components not rendering
**Symptoms**: Blank page or component errors

**Solutions**:
1. Check browser console for errors
2. Verify component imports
3. Check React version compatibility
4. Clear browser cache

### 15.3 Database Issues

#### Issue: Database locked
**Symptoms**: `database is locked` error

**Solutions**:
1. Close all connections:
```bash
pkill python
```

2. Delete lock file:
```bash
rm backend/legal_system.db-journal
```

3. Restart backend

#### Issue: Migration errors
**Symptoms**: Table already exists

**Solutions**:
1. Drop all tables:
```python
from app.database import Base, engine
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
```

2. Re-seed database:
```bash
python scripts/seed_database.py
```

### 15.4 AI Model Issues

#### Issue: LegalBERT not loading
**Symptoms**: Fallback to rule-based model

**Solutions**:
1. Install transformers:
```bash
pip install transformers torch
```

2. Download model manually:
```python
from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")
model = AutoModel.from_pretrained("nlpaueb/legal-bert-base-uncased")
```

3. Set AI_MODEL in `.env`:
```env
AI_MODEL=bert
```

#### Issue: Low confidence scores
**Symptoms**: Confidence < 50%

**Solutions**:
1. Provide more detailed case description
2. Use specific legal keywords
3. Check if category is correct
4. Switch to LegalBERT model for better accuracy

---

## 16. Development Workflow

### 16.1 Git Workflow

#### Branch Strategy
```
main (production)
  ├── develop (staging)
  │   ├── feature/user-auth
  │   ├── feature/booking-system
  │   └── bugfix/email-smtp
```

#### Commit Messages
```bash
# Feature
git commit -m "feat: Add LegalBERT AI service"

# Bug fix
git commit -m "fix: Resolve SMTP authentication error"

# Documentation
git commit -m "docs: Update API documentation"

# Refactor
git commit -m "refactor: Simplify booking workflow"
```

### 16.2 Testing

#### Backend Tests
```python
# test_auth.py
import pytest
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_register_user():
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
        "role": "customer"
    })
    assert response.status_code == 201

def test_login():
    response = client.post("/api/auth/login/json", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

Run tests:
```bash
pytest backend/tests/
```

#### Frontend Tests
```typescript
// CaseInputForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CaseInputForm from './CaseInputForm';

test('renders case input form', () => {
  render(<CaseInputForm />);
  const textarea = screen.getByPlaceholderText(/describe your legal situation/i);
  expect(textarea).toBeInTheDocument();
});

test('submits case for analysis', async () => {
  render(<CaseInputForm />);
  const textarea = screen.getByPlaceholderText(/describe your legal situation/i);
  fireEvent.change(textarea, { target: { value: 'My landlord...' } });
  
  const button = screen.getByText(/Submit for Analysis/i);
  fireEvent.click(button);
  
  // Assert loading state
  expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

### 16.3 Code Quality

#### Python (Black + Pylint)
```bash
# Format code
black backend/app

# Lint code
pylint backend/app
```

#### TypeScript (Prettier + ESLint)
```bash
# Format code
npx prettier --write src/

# Lint code
npm run lint
```

### 16.4 Documentation Updates

When adding new features:
1. Update API documentation (this file)
2. Add inline code comments
3. Update README.md
4. Create migration guides if needed

### 16.5 Performance Monitoring

#### Backend Logging
```python
import logging

logger = logging.getLogger(__name__)
logger.info("📧 Sending email to {email}")
logger.error("❌ Error: {error}")
```

#### Frontend Analytics
```typescript
// Track page views
useEffect(() => {
  console.log('Page view:', window.location.pathname);
}, []);

// Track API calls
const trackApiCall = (endpoint: string, duration: number) => {
  console.log(`API call to ${endpoint} took ${duration}ms`);
};
```

---

## 17. Future Enhancements

### Planned Features
1. **Real-time Chat**: WebSocket-based lawyer-client communication
2. **Video Consultations**: Integrated video calling
3. **Document Upload**: OCR and document analysis
4. **Payment Gateway**: Stripe/Razorpay integration
5. **Notification System**: Email + SMS + Push notifications
6. **Advanced Search**: Elasticsearch integration
7. **Multi-language**: Support for regional languages
8. **Mobile App**: React Native mobile application
9. **Analytics Dashboard**: Admin analytics and reporting
10. **AI Chatbot**: 24/7 legal query assistance

### Technical Improvements
1. **Microservices**: Split into multiple services
2. **Redis Caching**: Improve performance
3. **PostgreSQL**: Production-grade database
4. **Docker Compose**: Multi-container setup
5. **CI/CD Pipeline**: Automated testing and deployment
6. **API Rate Limiting**: Prevent abuse
7. **GraphQL**: Alternative to REST API
8. **WebSockets**: Real-time updates

---

## 18. Support & Contact

### Documentation
- **Project**: This file (PROJECT_DOCUMENTATION.md)
- **Installation**: INSTALLATION_GUIDE.md
- **API**: http://localhost:8000/docs (Swagger)
- **Troubleshooting**: TROUBLESHOOTING.md

### Developer Contact
- **Email**: harshalingaledev@gmail.com
- **GitHub**: [Repository URL]

### Reporting Issues
1. Check existing documentation
2. Search closed issues on GitHub
3. Create new issue with:
   - Description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Python/Node versions)

---

## Appendix A: Dataset Structure

### cases_database.json
```json
{
  "cases": [
    {
      "id": 1,
      "title": "Ram Kumar vs. Landlord Association",
      "court": "Delhi High Court",
      "year": "2020",
      "citation": "2020 DHC 1234",
      "category": "property",
      "summary": "Property dispute regarding security deposit...",
      "outcome": "Favor Tenant",
      "key_points": ["30-day notice", "Interest on delayed refund"]
    }
  ]
}
```

### ipc_sections.json
```json
{
  "sections": [
    {
      "section": "420",
      "title": "Cheating and dishonestly inducing delivery of property",
      "description": "Whoever cheats and thereby dishonestly...",
      "punishment": "7 years imprisonment",
      "category": "criminal"
    }
  ]
}
```

### constitutional_rights.json
```json
{
  "rights": [
    {
      "article": "Article 14",
      "title": "Equality before law",
      "description": "The State shall not deny to any person...",
      "category": "fundamental_rights"
    }
  ]
}
```

### lawyers_sample.json
```json
{
  "lawyers": [
    {
      "id": 1,
      "name": "Adv. Rajesh Kumar",
      "email": "rajesh@legal.com",
      "specialization": ["property", "civil"],
      "experience_years": 15,
      "location": "Mumbai",
      "rating": 4.8,
      "hourly_rate": 2000,
      "bio": "Experienced property law expert...",
      "education": ["LLB - Mumbai University", "LLM - Delhi University"],
      "bar_council_id": "MH/12345/2005"
    }
  ]
}
```

---

## Appendix B: API Response Examples

### Case Analysis Response (Customer)
```json
{
  "case_id": 123,
  "user_role": "customer",
  "confidence_score": 85.5,
  "case_category": "property",
  "simplified_explanation": "This appears to be a property dispute case involving a landlord-tenant disagreement. Your landlord is legally required to return your security deposit within a specified period (usually 30-45 days) after you vacate the property. If they refuse without valid deductions, they are violating tenant protection laws.",
  "applicable_rights": [
    "Right to receive security deposit refund within 30 days",
    "Consumer Protection Act, 2019 - Section 2(1)(d)",
    "State Rent Control Act provisions",
    "Right to legal recourse for property disputes"
  ],
  "recommendations": [
    "Send a legal notice to the landlord demanding refund within 7 days",
    "Document all communications and rental agreement details",
    "File a complaint with the local consumer court if notice is ignored",
    "Consider mediation before proceeding to court",
    "Consult a property law specialist for personalized advice"
  ],
  "matched_lawyers": [
    {
      "id": 1,
      "name": "Adv. Rajesh Kumar",
      "specialization": ["property", "civil", "consumer"],
      "experience_years": 15,
      "location": "Mumbai",
      "rating": 4.8,
      "hourly_rate": 2000,
      "match_score": 92,
      "match_reasons": [
        "Specializes in property and landlord-tenant disputes",
        "15 years of experience in Mumbai courts",
        "High success rate in security deposit cases",
        "Excellent client reviews (4.8/5 rating)"
      ]
    }
  ]
}
```

### Case Analysis Response (Lawyer)
```json
{
  "case_id": 124,
  "user_role": "lawyer",
  "confidence_score": 90.2,
  "case_classification": {
    "domain": "property",
    "sub_domain": "landlord_tenant",
    "confidence": 90.2,
    "keywords_identified": 12,
    "classification_method": "bert"
  },
  "summary": "Property dispute case involving non-refund of security deposit (₹50,000) by landlord after tenant vacated premises. Timeline: 60 days post-vacation with no response to tenant's demands. Rental agreement indicates 30-day refund clause. Potential violations: Breach of contract, unjust enrichment, consumer rights violation.",
  "past_cases": [
    {
      "case_title": "Ram Kumar vs. Shyam Landlord Association",
      "court": "Delhi High Court",
      "year": "2020",
      "citation": "2020 DHC 1234",
      "outcome": "Favor Tenant",
      "summary": "Court ruled that landlord must return security deposit within contracted period. Awarded compensation for delay plus 9% interest per annum.",
      "key_points": [
        "Landlord's obligation is unconditional unless valid deductions",
        "30-day refund clause is standard and enforceable",
        "Tenant entitled to interest on delayed refunds",
        "Consumer forum has jurisdiction for such disputes"
      ],
      "relevance_score": 88
    }
  ],
  "statutes": [
    {
      "section": "Section 106, Transfer of Property Act, 1882",
      "title": "Duration of certain leases in absence of written contract",
      "description": "In the absence of a contract or local law to the contrary, a lease of immovable property for residential purposes shall be deemed to be a lease from month to month, terminable by either party by giving notice.",
      "relevance": "Establishes legal framework for tenancy termination and obligations"
    },
    {
      "section": "Section 2(1)(d), Consumer Protection Act, 2019",
      "title": "Definition of Consumer",
      "description": "Consumer includes a person who hires or avails of any service for consideration.",
      "relevance": "Tenant qualifies as consumer; can approach consumer forum"
    }
  ],
  "key_arguments": [
    "Breach of Contract: Rental agreement explicitly states 30-day refund period, which has lapsed",
    "Unjust Enrichment: Landlord retaining deposit without legal justification",
    "Consumer Rights: Tenant is a consumer under Consumer Protection Act, 2019",
    "Documentary Evidence: Rental agreement, vacation notice, payment receipts establish clear timeline",
    "Precedent Support: Multiple High Court rulings favor tenant in similar disputes"
  ],
  "risk_assessment": [
    "STRONG CASE - Client has documented evidence and clear contractual breach",
    "Success Probability: 85% based on similar cases",
    "Timeline: 3-6 months via consumer forum (faster than civil court)",
    "Potential Outcomes: (1) Full refund + interest, (2) Full refund + compensation for harassment, (3) Settlement during mediation",
    "Risks: Landlord may claim deductions for damages (needs substantiation)",
    "Strategy: Send legal notice first, proceed to consumer forum if no response within 15 days"
  ]
}
```

---

**End of Documentation**

**Version**: 1.0  
**Last Updated**: January 19, 2026  
**Total Pages**: 50+
