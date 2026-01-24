# Installation & Migration Guide

## Quick Install (5 minutes)

### Backend Setup

1. **Update Dependencies** (if needed)
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start Backend**
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   You should see:
   ```
   ✓ Database tables initialized successfully
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

3. **Verify Installation**
   ```bash
   # In browser, visit:
   http://localhost:8000/health
   # Should return: {"status":"healthy"}
   
   # API Docs:
   http://localhost:8000/docs
   ```

### Frontend Setup

1. **No new dependencies needed** - Already have all required packages

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**
   ```
   http://localhost:5173
   ```

---

## What's New

### New Database Table: `bookings`
- Automatically created when backend starts
- Stores booking requests from customers to lawyers
- Tracks status (pending, accepted, rejected, cancelled)

### New API Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update status (lawyer)
- `DELETE /api/bookings/{id}` - Delete booking (customer)

### New Frontend Components
- **Enhanced CaseAnalysisResults** - Shows ranked lawyers with booking buttons
- **BookingsPanel** - Manage bookings (can add to dashboard later)

### New API Client Methods
- `createBooking()`
- `getMyBookings()`
- `getBooking()`
- `updateBookingStatus()`
- `deleteBooking()`

---

## Files Changed

### Backend (5 files)
```
backend/app/
├── database.py              (✏️ Added Booking model)
├── main.py                  (✏️ Registered bookings router)
├── models/
│   └── schemas.py           (✏️ Added booking schemas)
└── routers/
    ├── __init__.py          (✏️ Added bookings import)
    └── bookings.py          (✨ NEW - 220 lines)
```

### Frontend (3 files)
```
frontend/src/
├── components/
│   ├── CaseAnalysisResults.tsx    (✏️ Added ranking & booking)
│   └── BookingsPanel.tsx           (✨ NEW - 250+ lines)
└── services/
    └── api.ts                      (✏️ Added booking methods)
```

---

## Database Schema

### New `bookings` Table
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY,
    case_id INTEGER NOT NULL,
    lawyer_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    message TEXT,
    booking_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Automatic Creation**: The table is created automatically on backend startup.

---

## Migration from Old System

### If You Had Previous Bookings (in database)
No migration needed - this is a new table and won't affect existing data.

### Database Reset (Optional)
If you want to start fresh:

**SQLite:**
```bash
rm backend/legal_case.db
# Backend will recreate it on next run
```

**PostgreSQL:**
```bash
# Run this in psql
DROP TABLE IF EXISTS bookings CASCADE;
# Table will be recreated on next backend run
```

---

## Testing the New Features

### Test 1: Create Booking (Customer)
```bash
# 1. Login as customer first
POST http://localhost:8000/api/bookings
Authorization: Bearer {customer_token}
{
  "case_id": 1,
  "lawyer_id": 1,
  "message": "I would like to book this lawyer"
}
```

### Test 2: Get Bookings (Lawyer)
```bash
GET http://localhost:8000/api/bookings/my-bookings?status_filter=pending
Authorization: Bearer {lawyer_token}
```

### Test 3: Accept Booking (Lawyer)
```bash
PUT http://localhost:8000/api/bookings/1
Authorization: Bearer {lawyer_token}
{
  "status": "accepted",
  "booking_notes": "I can help with this case"
}
```

---

## UI Testing

### Customer Flow
1. Go to http://localhost:5173
2. Login as customer
3. Go to Client Dashboard
4. Analyze a legal case
5. Scroll to "Recommended Lawyers" section
6. Should see:
   - Ranking badges (#1, #2, #3)
   - Star ratings
   - Match scores
   - "Book This Lawyer" buttons
7. Click "Book This Lawyer"
8. Should see success message

### Lawyer Flow
1. Login as lawyer
2. Check for new BookingsPanel component
3. Should see pending booking requests
4. Accept or Reject bookings
5. Add optional notes

---

## Configuration

### Backend `.env` (Optional)
```env
DATABASE_URL=sqlite:///./legal_case.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend `.env.local` (Optional)
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
1. Make sure backend is running on port 8000
2. Check `VITE_API_BASE_URL` in frontend
3. Check CORS settings in `backend/app/config.py`

### Issue: "Table already exists"
**Solution:**
1. This shouldn't happen if starting fresh
2. If using existing database, just run backend - it will use existing table

### Issue: "Booking creation failed"
**Solution:**
1. Ensure you're logged in with correct role
2. Check that case_id and lawyer_id exist
3. Look at error message in browser console

### Issue: "Not authorized to perform action"
**Solution:**
1. Customers can only book, not update/delete others' bookings
2. Lawyers can only update their own bookings
3. Ensure you're logged in with correct account

---

## Verification Checklist

After installation, verify:

- [ ] Backend starts without errors
- [ ] `http://localhost:8000/health` returns `{"status":"healthy"}`
- [ ] `http://localhost:8000/docs` shows all endpoints including `/api/bookings`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Can login as customer
- [ ] Can analyze case and see lawyer recommendations
- [ ] Can see ranking badges (#1, #2, #3)
- [ ] Can click "Book This Lawyer" button
- [ ] Booking success message appears
- [ ] Can login as lawyer
- [ ] Lawyer can see booking requests

---

## Production Deployment

### Backend
1. Set `DATABASE_URL` to production PostgreSQL
2. Set `SECRET_KEY` to random string
3. Set `CORS_ORIGINS` to your frontend domain
4. Deploy to: Heroku, AWS, Render, etc.

### Frontend
1. Set `VITE_API_BASE_URL` to production backend URL
2. Run `npm run build`
3. Deploy to: Vercel, Netlify, GitHub Pages, etc.

---

## Support & Documentation

- **Quick Start**: [BOOKING_QUICKSTART.md](BOOKING_QUICKSTART.md)
- **Full Docs**: [BOOKING_SYSTEM_DOCUMENTATION.md](BOOKING_SYSTEM_DOCUMENTATION.md)
- **UI Guide**: [UI_IMPROVEMENTS_GUIDE.md](UI_IMPROVEMENTS_GUIDE.md)
- **Implementation**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Project Docs**: [COMPREHENSIVE_DOCUMENTATION.md](COMPREHENSIVE_DOCUMENTATION.md)

---

## Rollback (If Needed)

If you need to revert changes:

### Backend
1. Revert these files from git:
   - `app/database.py`
   - `app/main.py`
   - `app/models/schemas.py`
   - `app/routers/bookings.py`
   - `app/routers/__init__.py`

2. Restart backend

### Frontend
1. Revert these files:
   - `components/CaseAnalysisResults.tsx`
   - `components/BookingsPanel.tsx`
   - `services/api.ts`

2. Restart frontend

---

## Performance Notes

- Bookings are efficiently queried from database
- Filters applied at database level (better performance)
- Async operations prevent blocking
- Lazy loading of components

---

## Next Steps

1. ✅ **Test the system** - Follow testing checklist above
2. 🧪 **Create test cases** - Add E2E tests
3. 📧 **Add notifications** - Email when booking status changes
4. 📅 **Add scheduling** - Book specific consultation times
5. 💳 **Add payments** - Integrate payment system

---

## Quick Commands

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Test API
curl http://localhost:8000/health

# View API Docs
# Browser: http://localhost:8000/docs

# View Application
# Browser: http://localhost:5173
```

---

## Success Indicators

✅ Backend running without errors  
✅ Frontend loads successfully  
✅ Can create bookings  
✅ Can see bookings as lawyer  
✅ Can update booking status  
✅ No console errors  
✅ All buttons work as expected  
✅ Status updates reflected immediately  

---

**Installation complete! You're ready to use the booking system.** 🎉
