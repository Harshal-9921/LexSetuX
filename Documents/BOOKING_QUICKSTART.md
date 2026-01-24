# Quick Start: Lawyer Booking System

## What Was Implemented

### 👥 Customer Experience
- **Ranked Lawyer List**: Lawyers displayed in order of match score (#1, #2, #3)
- **Complete Expertise Display**:
  - ⭐ Star rating (1-5)
  - 💰 Hourly rate
  - ⏳ Years of experience
  - 📍 Location
  - 📊 Match score percentage (0-100%)
  - 💼 Specializations (tags)
  
- **One-Click Booking**: "Book This Lawyer" button for each recommendation
- **Instant Feedback**: Success/error messages on booking

### ⚖️ Lawyer Experience
- **Booking Requests Panel**: See all pending booking requests
- **Customer Details**: Name, case category, description, message
- **Quick Actions**:
  - ✅ Accept (with optional notes)
  - ❌ Reject
- **Status Tracking**: Tab-based filter (Pending, Accepted, Rejected, Cancelled)

## How It Works

### Booking Flow

```
CUSTOMER SIDE                    LAWYER SIDE
─────────────────────────────────────────────────

1. Analyze Case
2. View Results + Lawyers
3. Click "Book Lawyer"  ──────→  1. See Pending Request
4. Booking Created              2. Review Details
   (Status: PENDING)            3. Click Accept/Reject
                                4. Add Notes (optional)
                            ←──  Status: ACCEPTED/REJECTED
5. See Status Updated
```

## API Endpoints

### Create Booking
```
POST /api/bookings
{
  "case_id": 1,
  "lawyer_id": 5,
  "message": "Optional message"
}
```

### Get My Bookings
```
GET /api/bookings/my-bookings?status_filter=pending
```

### Update Booking Status (Lawyer)
```
PUT /api/bookings/{booking_id}
{
  "status": "accepted",
  "booking_notes": "I can take this case"
}
```

## Testing the System

### Step 1: Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 3: Test as Customer
1. Go to http://localhost:5173
2. Login as customer (or sign up)
3. Go to Client Dashboard
4. Analyze a test case
5. Click "Book This Lawyer" on any lawyer
6. Should see success message

### Step 4: Test as Lawyer
1. Open new browser window/tab
2. Login as lawyer (use different account)
3. Should see BookingsPanel with the booking request
4. Click "Accept" to accept booking
5. Can add notes and save

## Components

### Frontend Components

**CaseAnalysisResults.tsx**
- Shows ranked lawyers with all expertise info
- Handles booking creation
- Displays success/error messages

**BookingsPanel.tsx**
- Tab-based booking management
- Shows pending, accepted, rejected, cancelled bookings
- Lawyer can accept/reject with notes
- Customer can track status

### Backend Routers

**bookings.py**
- `/api/bookings` - Create, list, update, delete
- Authentication-protected
- Role-based access control

## Database Tables

### Bookings Table
```
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY
  case_id INTEGER (FK: cases.id)
  lawyer_id INTEGER (FK: lawyers.id)
  customer_id INTEGER (FK: users.id)
  status VARCHAR (pending, accepted, rejected, cancelled)
  message TEXT
  booking_notes TEXT
  created_at DATETIME
  updated_at DATETIME
)
```

## Key Features

✅ **Ranked Recommendations** - Lawyers ranked by match score  
✅ **Complete Expertise Display** - Rating, experience, location, specialization  
✅ **One-Click Booking** - Easy booking process  
✅ **Status Management** - Track booking through all stages  
✅ **Lawyer Response** - Accept, reject, or add notes  
✅ **Tab Filtering** - Filter by status (Pending, Accepted, etc.)  
✅ **Error Handling** - Proper validation and error messages  
✅ **Authentication** - Only logged-in users can book  

## Files Modified/Created

### Created
- `backend/app/routers/bookings.py` - Booking API endpoints
- `frontend/src/components/BookingsPanel.tsx` - Booking management UI

### Modified
- `backend/app/database.py` - Added Booking model
- `backend/app/models/schemas.py` - Added booking schemas
- `backend/app/main.py` - Registered bookings router
- `frontend/src/components/CaseAnalysisResults.tsx` - Enhanced lawyer display with booking
- `frontend/src/services/api.ts` - Added booking API methods

## Status Codes

- 🟡 **PENDING** - Waiting for lawyer response
- 🟢 **ACCEPTED** - Booking confirmed
- 🔴 **REJECTED** - Lawyer declined
- ⚫ **CANCELLED** - Cancelled by customer

## Next Steps

1. **Test the system** following the testing steps above
2. **Add emails** - Optional email notifications
3. **Add scheduling** - Book consultation dates/times
4. **Add payments** - Integrate payment system
5. **Add messaging** - Direct messaging between parties

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend is running on port 8000
- Check `VITE_API_BASE_URL` in frontend

### "Booking creation failed"
- Ensure you're logged in
- Check that case_id and lawyer_id are valid
- Verify you're using POST method

### "Not authorized"
- Ensure you're logged in with correct role
- Lawyers can only update their own bookings
- Customers can only create/delete their own bookings

## Need More Details?

See [BOOKING_SYSTEM_DOCUMENTATION.md](BOOKING_SYSTEM_DOCUMENTATION.md) for complete documentation.
