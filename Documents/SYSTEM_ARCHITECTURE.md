# System Architecture - Booking Implementation

## Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│  http://localhost:5173                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ CaseAnalysisResults.tsx                                │    │
│  │ • Displays ranked lawyers (#1, #2, #3)                │    │
│  │ • Shows expertise (rating, experience, location)       │    │
│  │ • Match score with progress bar                        │    │
│  │ • "Book This Lawyer" buttons                           │    │
│  │ • Success/error messages                               │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────┐    │
│  │ BookingsPanel.tsx                                      │    │
│  │ • Tab filtering (Pending, Accepted, etc.)             │    │
│  │ • Booking cards with details                           │    │
│  │ • Accept/Reject buttons (lawyer only)                 │    │
│  │ • Status color coding                                  │    │
│  │ • Customer/Lawyer information                          │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────┐    │
│  │ api.ts (API Client)                                   │    │
│  │ • createBooking()                                      │    │
│  │ • getMyBookings()                                      │    │
│  │ • updateBookingStatus()                                │    │
│  │ • deleteBooking()                                      │    │
│  │ • getBooking()                                         │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
└────────────────┼──────────────────────────────────────────────┘
                 │ HTTP/REST
                 │ (CORS Enabled)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                            │
│  http://localhost:8000                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ API Routers                                            │    │
│  │                                                        │    │
│  │ ├─ /api/auth          (Authentication)               │    │
│  │ ├─ /api/cases         (Case Analysis)                │    │
│  │ ├─ /api/lawyers       (Lawyer Management)            │    │
│  │ └─ /api/bookings      (NEW - Booking Management)     │    │
│  │    ├─ POST   - Create booking                        │    │
│  │    ├─ GET    - Get my bookings                       │    │
│  │    ├─ GET    - Get specific booking                  │    │
│  │    ├─ PUT    - Update status                         │    │
│  │    └─ DELETE - Delete booking                        │    │
│  │                                                        │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────┐    │
│  │ Services                                               │    │
│  │ • ai_service.py       (Case Analysis)                 │    │
│  │ • lawyer_service.py   (Lawyer Matching)               │    │
│  │ • dataset_loader.py   (Data Management)               │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────┐    │
│  │ Database Models (SQLAlchemy)                           │    │
│  │ • User                                                 │    │
│  │ • Case                                                 │    │
│  │ • Lawyer                                               │    │
│  │ • Booking          (NEW)                              │    │
│  │ • CaseLawyerMatch                                      │    │
│  └─────────────┬──────────────────────────────────────────┘    │
│                │                                                 │
└────────────────┼──────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   Database         │
        ├────────────────────┤
        │ SQLite or          │
        │ PostgreSQL         │
        │                    │
        │ Tables:            │
        │ • users            │
        │ • cases            │
        │ • lawyers          │
        │ • bookings (NEW)   │
        │ • matches          │
        └────────────────────┘
```

---

## Data Flow - Customer Books Lawyer

```
FRONTEND                          BACKEND                    DATABASE
────────────────────────────────────────────────────────────────────

User Views Case
    │
    └──→ CaseAnalysisResults
         Renders ranked lawyers
         Shows expertise info
         │
         ├──→ #1 Attorney (95% match)
         ├──→ #2 Attorney (88% match)
         └──→ #3 Attorney (78% match)
             │
             │ User clicks "Book"
             ▼
    createBooking(caseId, lawyerId)
         │
         ▼
    POST /api/bookings
    {
      case_id: 1,
      lawyer_id: 5,
      message: "I would like..."
    }
    │
    ├──────────────────────→ POST /api/bookings
    │                              │
    │                              ├─→ Validate authentication
    │                              ├─→ Verify case exists
    │                              ├─→ Verify lawyer exists
    │                              ├─→ Check for duplicates
    │                              │
    │                              ├─→ Create Booking record
    │                              │   {
    │                              │     status: "pending",
    │                              │     case_id: 1,
    │                              │     lawyer_id: 5,
    │                              │     customer_id: 42,
    │                              │     created_at: now()
    │                              │   }
    │                              │
    │                              └──→ INSERT INTO bookings
    │                                    │
    │    ┌────────────────────────────←──┘
    │    ▼
    ← 201 Created
    {
      id: 123,
      status: "pending",
      ...
    }
    │
    ▼ Success! Booking created
Toast: "Booking request sent!"
```

---

## Data Flow - Lawyer Accepts Booking

```
FRONTEND                          BACKEND                    DATABASE
────────────────────────────────────────────────────────────────────

Lawyer Views BookingsPanel
    │
    └──→ GET /api/bookings/my-bookings
         │
         ├──────────────────────→ GET /api/bookings/my-bookings
         │                              │
         │                              ├─→ Get lawyer ID from token
         │                              ├─→ Find bookings where
         │                              │   lawyer_id = current_lawyer
         │                              │
         │                              └──→ SELECT * FROM bookings
         │                                   WHERE lawyer_id = 5
         │                                    │
         │    ┌────────────────────────────←──┘
         │    ▼
         ← 200 OK
         [
           {
             id: 123,
             customer_name: "Rajesh Patel",
             case_category: "Property Law",
             status: "pending",
             message: "I would like...",
             ...
           }
         ]
         │
         ▼ Shows booking cards
    
    Lawyer clicks "Accept" button
         │
         ▼
    updateBookingStatus(123, "accepted", "I can help")
         │
         ├──────────────────────→ PUT /api/bookings/123
         │                        {
         │                          status: "accepted",
         │                          booking_notes: "I can help"
         │                        }
         │                              │
         │                              ├─→ Get lawyer ID from token
         │                              ├─→ Verify lawyer_id matches
         │                              │
         │                              ├─→ UPDATE bookings
         │                              │   SET status = "accepted"
         │                              │   WHERE id = 123
         │                              │
         │                              └──→ UPDATE bookings
         │                                    WHERE id = 123
         │                                    │
         │    ┌────────────────────────────←──┘
         │    ▼
         ← 200 OK
         {
           id: 123,
           status: "accepted",
           booking_notes: "I can help",
           updated_at: now(),
           ...
         }
         │
         ▼ Status updated!
    Toast: "Booking accepted!"
```

---

## Database Relationships

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ email       │
│ full_name   │
│ role        │
└─────┬───────┘
      │
      ├────────────────┐
      │                │
      ▼                ▼
┌───────────┐  ┌──────────────┐
│  cases    │  │  lawyers     │
├───────────┤  ├──────────────┤
│ id (PK)   │  │ id (PK)      │
│ user_id   │  │ user_id (FK) │
│ category  │  │ rating       │
│ description   │ experience   │
└─────┬─────┘  └──────┬──────┘
      │                │
      │                │
      │         ┌──────▼────────┐
      │         │    bookings   │
      │         ├───────────────┤
      │         │ id (PK)       │
      │         │ case_id (FK)  │
      ▼         │ lawyer_id(FK) │
    ┌────────┐  │ customer(FK)  │
    │booking │◄─┤ status        │
    │        │  │ message       │
    │        │  │ booking_notes │
    └────────┘  │ created_at    │
               │ updated_at    │
               └───────────────┘
```

---

## Status State Machine

```
                    ┌─────────────┐
                    │   PENDING   │
                    │  (Yellow)   │
                    └────┬────┬───┘
                         │    │
                  ┌──────┘    └──────┐
                  │                  │
                  ▼                  ▼
            ┌─────────────┐  ┌─────────────┐
            │  ACCEPTED   │  │  REJECTED   │
            │  (Green)    │  │   (Red)     │
            └─────────────┘  └─────────────┘
                  
            ┌─────────────────────────────┐
            │  CANCELLED (from PENDING)   │
            │  (Gray)                     │
            └─────────────────────────────┘
```

---

## Component Hierarchy

```
Frontend
├── App.tsx
│   └── Layout
│       ├── Navigation.tsx
│       └── Routes
│           ├── ClientDashboard.tsx
│           │   └── CaseInputForm.tsx
│           │       └── CaseAnalysisResults.tsx
│           │           ├── CustomerResults
│           │           │   ├── Case Category Card
│           │           │   ├── Explanation Card
│           │           │   ├── Rights Card
│           │           │   ├── Laws Card
│           │           │   ├── Lawyers Card
│           │           │   │   └── LawyerCard (Ranked)
│           │           │   │       ├── Rank Badge
│           │           │   │       ├── Star Rating
│           │           │   │       ├── Match Score
│           │           │   │       ├── Match Reasons
│           │           │   │       └── Book Button
│           │           │   └── Recommendations Card
│           │           │
│           │           └── LawyerResults
│           │               └── Detailed Case Analysis
│           │
│           ├── LawyerDashboard.tsx
│           │   └── BookingsPanel.tsx
│           │       ├── TabsList
│           │       │   ├── All
│           │       │   ├── Pending
│           │       │   ├── Accepted
│           │       │   ├── Rejected
│           │       │   └── Cancelled
│           │       └── BookingCard
│           │           ├── Customer Info
│           │           ├── Case Details
│           │           ├── Status
│           │           ├── Message
│           │           ├── Notes
│           │           └── Actions (Accept/Reject)
│           │
│           └── Other Routes...
│
└── API Service
    └── api.ts
        ├── Authentication
        ├── Case Analysis
        ├── Lawyer Methods
        └── Booking Methods
```

---

## File Dependencies

```
backend/
├── main.py
│   ├── database.py
│   │   ├── User
│   │   ├── Case
│   │   ├── Lawyer
│   │   └── Booking (NEW)
│   ├── routers/
│   │   ├── auth.py
│   │   ├── case_analysis.py
│   │   ├── lawyers.py
│   │   └── bookings.py (NEW)
│   │       └── models/schemas.py (uses booking schemas)
│   ├── services/
│   │   ├── ai_service.py
│   │   └── lawyer_service.py
│   └── config.py
│
frontend/
├── App.tsx
│   ├── pages/
│   │   ├── ClientDashboard.tsx
│   │   │   └── components/
│   │   │       ├── CaseInputForm.tsx
│   │   │       │   └── CaseAnalysisResults.tsx
│   │   │       │       ├── CustomerResults (ENHANCED)
│   │   │       │       └── LawyerResults
│   │   │       └── BookingsPanel.tsx (NEW)
│   │   │
│   │   └── LawyerDashboard.tsx
│   │       └── BookingsPanel.tsx
│   │
│   ├── services/
│   │   └── api.ts (ENHANCED)
│   │
│   └── hooks/
│       └── useAuth.tsx
```

---

## Integration Points

```
1. Customer Views Case Results
   ↓
   CaseAnalysisResults.tsx
   ↓
   Shows ranked lawyers with booking buttons
   ↓
   
2. Customer Clicks "Book This Lawyer"
   ↓
   handleBookLawyer(lawyerId)
   ↓
   apiClient.createBooking(caseId, lawyerId, message)
   ↓
   POST /api/bookings
   ↓
   Create Booking in database (status: pending)
   ↓
   Show success message
   ↓
   
3. Lawyer Logs In
   ↓
   LawyerDashboard.tsx (or via BookingsPanel)
   ↓
   apiClient.getMyBookings()
   ↓
   GET /api/bookings/my-bookings
   ↓
   Display pending bookings
   ↓
   
4. Lawyer Accepts/Rejects
   ↓
   BookingsPanel.tsx
   ↓
   handleUpdateStatus(bookingId, status, notes)
   ↓
   apiClient.updateBookingStatus(bookingId, status, notes)
   ↓
   PUT /api/bookings/{id}
   ↓
   Update booking in database (status: accepted/rejected)
   ↓
   Show success message
   ↓
   Update UI
```

---

## Request/Response Flow

### Create Booking Request
```
Request:
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "case_id": 1,
  "lawyer_id": 5,
  "message": "I would like to book this lawyer"
}

Response:
201 Created
{
  "id": 123,
  "case_id": 1,
  "lawyer_id": 5,
  "customer_id": 42,
  "status": "pending",
  "message": "I would like to book this lawyer",
  "booking_notes": null,
  "created_at": "2026-01-18T10:30:00",
  "updated_at": "2026-01-18T10:30:00"
}
```

### Update Booking Status Request
```
Request:
PUT /api/bookings/123
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "accepted",
  "booking_notes": "I can help with this case"
}

Response:
200 OK
{
  "id": 123,
  "case_id": 1,
  "lawyer_id": 5,
  "customer_id": 42,
  "status": "accepted",
  "message": "I would like to book this lawyer",
  "booking_notes": "I can help with this case",
  "created_at": "2026-01-18T10:30:00",
  "updated_at": "2026-01-18T11:45:00"
}
```

---

## Performance Considerations

```
Database Query Optimization:
├─ Use indexes on frequently filtered columns
│  ├─ bookings.status
│  ├─ bookings.lawyer_id
│  └─ bookings.customer_id
│
├─ Efficient joins
│  └─ Prefetch related data when needed
│
└─ Connection pooling
   └─ Reuse database connections

Frontend Optimization:
├─ Component memoization
├─ Lazy loading components
├─ Efficient state management
└─ Minimal re-renders
```

---

**Complete System Architecture Documented!** ✅
