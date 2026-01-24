# Lawyer Booking System Implementation

## Overview
Implemented a complete lawyer booking system with ranking, recommendations, and status management.

## Features Implemented

### 1. **Customer Side - Lawyer Recommendations with Ranking**

#### What Customers See:
- ✅ **Ranked Lawyer List** - Lawyers ranked by match score (1st, 2nd, 3rd, etc.)
- ✅ **Match Expertise Displayed**:
  - Match Score (0-100%) with visual progress bar
  - Star Rating (1-5 stars)
  - Years of Experience
  - Location
  - Hourly Rate
  - Specializations (tags)
  
- ✅ **Match Reasons** - Why each lawyer is recommended:
  - "Specializes in Property Law"
  - "10 years of experience"
  - "Highly rated (4.8/5)"
  - "Located in Delhi"

- ✅ **Book Lawyer Button** - One-click booking for each lawyer

#### Visual Improvements:
- Ranking badges (#1, #2, #3, etc.)
- Color-coded match score with progress bar
- Star rating display with visual stars
- Location and experience icons
- Enhanced card design with hover effects
- Responsive layout for all screen sizes

**File Updated:** [frontend/src/components/CaseAnalysisResults.tsx](frontend/src/components/CaseAnalysisResults.tsx)

---

### 2. **Backend - Booking Management System**

#### New Database Model: `Booking`
```python
class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    lawyer_id = Column(Integer, ForeignKey("lawyers.id"))
    customer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="pending")  # pending, accepted, rejected, cancelled
    message = Column(Text)  # Customer's message
    booking_notes = Column(Text)  # Lawyer's notes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**File Updated:** [backend/app/database.py](backend/app/database.py)

---

### 3. **Backend - Booking API Endpoints**

#### New Booking Router: `/api/bookings`
**File Created:** [backend/app/routers/bookings.py](backend/app/routers/bookings.py)

#### Endpoints:

**1. Create Booking (Customer)**
```http
POST /api/bookings
Authorization: Bearer {token}
{
  "case_id": 1,
  "lawyer_id": 5,
  "message": "I would like to book this lawyer for my case"
}
```
Response: `201 Created` with booking details
- Status: `pending` (waiting for lawyer response)

**2. Get My Bookings**
```http
GET /api/bookings/my-bookings?status_filter=pending
Authorization: Bearer {token}
```
Response: List of bookings for current user
- If Lawyer: Shows pending booking requests from customers
- If Customer: Shows their booking requests to lawyers

**3. Get Booking Details**
```http
GET /api/bookings/{booking_id}
Authorization: Bearer {token}
```

**4. Update Booking Status (Lawyer Only)**
```http
PUT /api/bookings/{booking_id}
Authorization: Bearer {token}
{
  "status": "accepted",  // or "rejected", "cancelled"
  "booking_notes": "I can take this case"
}
```
Response: Updated booking with new status
- `accepted` - Lawyer accepts the booking
- `rejected` - Lawyer rejects the booking
- `cancelled` - Either party cancels

**5. Delete Booking (Customer Only)**
```http
DELETE /api/bookings/{booking_id}
Authorization: Bearer {token}
```
- Only allows deletion if status is `pending`

---

### 4. **Booking Status Workflow**

```
Customer Action          Booking Status
─────────────────────────────────────────
Book Lawyer       →      PENDING (awaiting lawyer)
                              ↓
Lawyer Response   →      ACCEPTED or REJECTED
                    
Accepted          →      ACCEPTED (booking confirmed)
(lawyer can add notes)
                    
Rejected          →      REJECTED (can book another lawyer)
                    
Customer Cancel   →      CANCELLED (pending only)
(before acceptance)
```

---

### 5. **Frontend - API Client Updates**

**File Updated:** [frontend/src/services/api.ts](frontend/src/services/api.ts)

New Methods:
```typescript
// Create booking request
async createBooking(caseId: number, lawyerId: number, message?: string)

// Get bookings for current user
async getMyBookings(statusFilter?: string)

// Get specific booking
async getBooking(bookingId: number)

// Update booking status (lawyer)
async updateBookingStatus(bookingId: number, status: string, notes?: string)

// Delete booking (customer)
async deleteBooking(bookingId: number)
```

---

### 6. **Frontend - Bookings Management Panel**

**File Created:** [frontend/src/components/BookingsPanel.tsx](frontend/src/components/BookingsPanel.tsx)

#### Features:
- ✅ **Tab-based filtering** - All, Pending, Accepted, Rejected, Cancelled
- ✅ **Booking cards** showing:
  - Customer/Lawyer name
  - Case category and description
  - Booking status with color coding
  - Timeline (requested date/time)
  - Customer's message
  - Lawyer's notes (if any)

- ✅ **Lawyer Actions**:
  - Accept button (changes status to "accepted")
  - Reject button (changes status to "rejected")
  - Add notes when responding

- ✅ **Customer View**:
  - See booking status
  - Track lawyer responses
  - See lawyer's notes

#### Status Color Coding:
- 🟡 **Pending** (Yellow) - Waiting for response
- 🟢 **Accepted** (Green) - Booking confirmed
- 🔴 **Rejected** (Red) - Declined by lawyer
- ⚫ **Cancelled** (Gray) - Cancelled by customer

---

### 7. **Integration with Existing Components**

#### CaseInputForm.tsx
- When a case is analyzed, `case_id` is passed to results
- Customers can immediately book lawyers after analysis

#### CaseAnalysisResults.tsx
- Shows ranked lawyers with detailed matching info
- "Book This Lawyer" button for each recommendation
- Handles booking creation and shows success/error messages

---

## Data Models & Schemas

### Booking Schemas (Pydantic)

**File Updated:** [backend/app/models/schemas.py](backend/app/models/schemas.py)

```python
class BookingCreate(BaseModel):
    case_id: int
    lawyer_id: int
    message: Optional[str] = None

class BookingUpdate(BaseModel):
    status: str  # "accepted", "rejected", "cancelled"
    booking_notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    case_id: int
    lawyer_id: int
    customer_id: int
    status: str
    message: Optional[str] = None
    booking_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class BookingDetailResponse(BookingResponse):
    customer_name: Optional[str] = None
    lawyer_name: Optional[str] = None
    case_category: Optional[str] = None
    case_description: Optional[str] = None
```

---

## Backend Setup

### 1. Update database.py
- ✅ Added `Booking` model

### 2. Create bookings router
- ✅ Created `/api/bookings` router with all endpoints

### 3. Update main.py
- ✅ Registered bookings router

### 4. Update schemas
- ✅ Added booking-related schemas

---

## Frontend Setup

### 1. Update CaseAnalysisResults.tsx
- ✅ Enhanced lawyer recommendations display
- ✅ Added ranking badges (#1, #2, #3)
- ✅ Added booking buttons
- ✅ Added match expertise display with icons
- ✅ Improved visual design with color coding

### 2. Create BookingsPanel.tsx
- ✅ New component for managing bookings
- ✅ Tab-based filtering system
- ✅ Lawyer actions (accept/reject)
- ✅ Customer view of booking status

### 3. Update API client
- ✅ Added all booking-related API methods

---

## Usage Flow

### Customer Flow:
1. **Login** → Customer Dashboard
2. **Submit Case** → Case Analysis
3. **View Results** → See ranked lawyers
4. **Book Lawyer** → Click "Book This Lawyer" button
5. **Confirmation** → Success message shown
6. **Track Status** → Can check booking status in BookingsPanel

### Lawyer Flow:
1. **Login** → Lawyer Dashboard
2. **View Bookings** → BookingsPanel shows pending requests
3. **Review Booking** → See case details and customer message
4. **Respond** → Accept or Reject
5. **Add Notes** → Optional notes for customer
6. **Confirmation** → Status updated

---

## Testing Instructions

### Test Case 1: Customer Books Lawyer
1. Login as customer
2. Analyze a legal case
3. Click "Book This Lawyer" on any recommendation
4. Should see success message
5. Booking should appear in BookingsPanel as "pending"

### Test Case 2: Lawyer Accepts Booking
1. Login as lawyer
2. Go to BookingsPanel
3. See pending booking request
4. Click "Accept" button
5. Add optional notes
6. Status should change to "accepted"

### Test Case 3: Lawyer Rejects Booking
1. Login as lawyer
2. Go to BookingsPanel
3. See pending booking request
4. Click "Reject" button
5. Status should change to "rejected"

### Test Case 4: Lawyer Cancels
1. Make a booking (pending status)
2. Lawyer rejects it
3. Customer can now book another lawyer

---

## Key Features

### Ranking System
- Lawyers are ranked based on:
  - **Match Score** (primary)
  - **Rating** (secondary)
  - **Experience** (tertiary)
  - **Specialization** (match quality)

### Matching Information
Customers see complete expertise data:
- ⭐ Star rating with score
- 📍 Location
- ⏳ Years of experience
- 💼 Specializations
- 📊 Match score percentage
- ✓ Specific reasons for match

### Booking Status Tracking
- 🔄 **Pending** - Awaiting lawyer response
- ✅ **Accepted** - Confirmed, ready to proceed
- ❌ **Rejected** - Try another lawyer
- ⛔ **Cancelled** - Booking cancelled by either party

---

## Files Changed/Created

### Backend Files:
1. **[database.py](backend/app/database.py)** - Added Booking model
2. **[routers/bookings.py](backend/app/routers/bookings.py)** - Created (new)
3. **[main.py](backend/app/main.py)** - Added bookings router
4. **[models/schemas.py](backend/app/models/schemas.py)** - Added booking schemas
5. **[routers/__init__.py](backend/app/routers/__init__.py)** - Updated imports

### Frontend Files:
1. **[CaseAnalysisResults.tsx](frontend/src/components/CaseAnalysisResults.tsx)** - Enhanced with ranking and booking
2. **[BookingsPanel.tsx](frontend/src/components/BookingsPanel.tsx)** - Created (new)
3. **[api.ts](frontend/src/services/api.ts)** - Added booking methods

---

## Database Migration

The `Booking` table will be auto-created when the backend starts:
- SQLite: Creates in `legal_case.db`
- PostgreSQL: Creates in configured database

---

## Error Handling

### Customer:
- ❌ Cannot book if not logged in → Redirected to auth
- ❌ Cannot book same lawyer twice → Shows error
- ❌ Cannot book without case → Shows error

### Lawyer:
- ❌ Cannot update others' bookings → 403 Forbidden
- ❌ Cannot delete non-pending bookings → 400 Bad Request

---

## Future Enhancements

1. **Booking Confirmation Email**
   - Send email to lawyer when booking is created
   - Send email to customer when booking is accepted/rejected

2. **Scheduling System**
   - Book consultation date/time
   - Calendar integration
   - Reminder notifications

3. **Payment Integration**
   - Deposit/retainer fee
   - Payment tracking
   - Invoice generation

4. **Reviews & Ratings**
   - Customer reviews lawyer
   - Lawyer reviews customer
   - Rating aggregation

5. **Messaging System**
   - Direct messaging between customer and lawyer
   - Message history
   - Document sharing

---

**Implementation Complete!** 🎉

All features are now ready to use. Customers can see ranked lawyers with complete expertise information and book them with one click. Lawyers can manage booking requests and update their status accordingly.
