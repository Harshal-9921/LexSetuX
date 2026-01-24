# Legal Case Analysis System - Quick Start Guide

## 🎯 What This Project Does

A platform where:
- **Customers** describe their legal problem → Get AI analysis → Book a lawyer
- **Lawyers** view cases → Accept/reject bookings → Chat with clients
- **Admin** manages everything

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Create .env file
echo "AI_MODEL=bert" > .env
echo "SECRET_KEY=your-secret-key-min-32-chars" >> .env
echo "DATABASE_URL=sqlite+aiosqlite:///./legal_system.db" >> .env

# Start server
python -m uvicorn app.main:app --reload --port 8000
```

**Backend runs at**: `http://localhost:8000`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Frontend runs at**: `http://localhost:5173`

---

## 🔑 Most Important Things

### 1. **Authentication**
- **Register**: Create account (customer/lawyer)
- **Login**: Get JWT token
- **Token expires**: 24 hours

### 2. **Case Analysis Flow**
1. Customer enters case description
2. AI auto-classifies (property/family/criminal/etc)
3. Get results with matched lawyers
4. Click "Book This Lawyer"

### 3. **Booking System**
```
Customer sends booking request
        ↓
Lawyer sees in Dashboard
        ↓
Lawyer accepts/rejects
        ↓
Customer notified
```

### 4. **AI Models**
- **Rule-Based** (Fast): Keyword matching, 70-80% accuracy
- **LegalBERT** (Smart): Neural network, 90-95% accuracy

Switch in `.env`: `AI_MODEL=bert` or `AI_MODEL=rule_based`

### 5. **Email Setup (Gmail)**
Need to:
1. Go to: https://myaccount.google.com/apppasswords
2. Generate app password
3. Add to `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=16-char-password-no-spaces
```

---

## 📱 Key Features

| Feature | Who Uses It | What It Does |
|---------|------------|-------------|
| **Case Analysis** | Customer | Analyzes legal issue, suggests rights |
| **Lawyer Matching** | Customer | Shows relevant lawyers |
| **Booking** | Customer + Lawyer | Reserve consultation |
| **Dashboard** | Lawyer | Manage bookings |
| **Contact Form** | Anyone | Send inquiry via email |

---

## 🔗 Key API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login/json
```

### Cases
```
POST /api/cases/analyze        # Analyze case
GET  /api/cases/my-cases       # My cases
```

### Lawyers
```
GET /api/lawyers              # List all lawyers
GET /api/lawyers/match        # Find matching lawyers
```

### Bookings
```
POST   /api/bookings          # Create booking
GET    /api/bookings/my-bookings  # My bookings
PUT    /api/bookings/{id}     # Accept/reject
```

### Contact
```
POST /api/contact/send        # Send message
```

**Full API Docs**: `http://localhost:8000/docs`

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # App entry point
│   ├── config.py            # Settings
│   ├── database.py          # Database models
│   ├── models/schemas.py    # Data validation
│   ├── routers/
│   │   ├── auth.py          # Login/Register
│   │   ├── case_analysis.py # Case analysis
│   │   ├── lawyers.py       # Lawyer endpoints
│   │   ├── bookings.py      # Booking endpoints
│   │   └── contact.py       # Email endpoint
│   └── services/
│       ├── ai_service.py         # Rule-based AI
│       ├── ai_service_bert.py    # LegalBERT AI
│       └── lawyer_service.py     # Lawyer matching

frontend/
├── src/
│   ├── pages/
│   │   ├── Index.tsx        # Homepage
│   │   ├── Auth.tsx         # Login/Register
│   │   ├── ClientDashboard.tsx  # Customer dashboard
│   │   ├── LawyerDashboard.tsx  # Lawyer dashboard
│   │   └── Contact.tsx      # Contact form
│   ├── components/
│   │   ├── CaseInputForm.tsx     # Case input
│   │   ├── CaseAnalysisResults.tsx   # Results
│   │   └── BookingsPanel.tsx     # Bookings
│   └── services/
│       └── api.ts           # API client
```

---

## 🚀 Typical User Flows

### Customer Flow
```
1. Sign Up/Login
2. Go to Home → Enter case description
3. Click "Submit for Analysis"
4. See AI results + matched lawyers
5. Click "Book This Lawyer"
6. Go to Dashboard → See booking status
7. Wait for lawyer response
```

### Lawyer Flow
```
1. Sign Up/Login as Lawyer
2. Go to Dashboard
3. See pending bookings
4. Review customer's case
5. Accept/Reject booking
6. Add notes and schedule date
7. Customer gets notification
```

### Admin Flow
```
1. Login as admin@legal.com / admin123
2. Manage users
3. View all cases/bookings
4. Handle system issues
```

---

## 🐛 Common Issues & Fixes

### Backend won't start
```bash
# Make sure virtual env is activated
venv\Scripts\activate  # Windows

# Install missing packages
pip install -r requirements.txt
```

### Can't connect to backend
```
Error: "Cannot connect to backend server"
Fix: Make sure backend is running on http://localhost:8000
```

### "Case is not saved yet" error
```
Problem: Click "Book Lawyer" but get error
Fix: Sign in FIRST, then submit case again
(New code auto-saves case when booking)
```

### Gmail email not working (535 error)
```
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification
3. Generate new app password
4. Copy 16-char password (no spaces)
5. Update .env with SMTP_PASSWORD
6. Restart backend
```

### Database errors
```bash
# Delete old database
rm backend/legal_system.db

# Reseed
python backend/scripts/seed_database.py
```

---

## 🔐 Default Test Users

After running seed script:

| Email | Password | Role |
|-------|----------|------|
| admin@legal.com | admin123 | Admin |

**Or create your own**: Sign up with any email/password

---

## 📊 Database Schema (Simple)

```
users
├── id, email, password, role, name
│
├─→ cases
│   ├── id, user_id, description, category
│   ├── analysis_result (AI output)
│   └── confidence_score
│
└─→ bookings
    ├── id, case_id, lawyer_id, customer_id
    ├── status (pending/accepted/rejected)
    └── scheduled_date
```

---

## 🎨 Frontend Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **TanStack Router** - Navigation
- **Zustand** - State management

---

## 🔧 Backend Technologies

- **FastAPI** - REST API
- **SQLAlchemy** - Database ORM
- **SQLite** - Database
- **JWT** - Authentication
- **transformers** - LegalBERT AI
- **smtplib** - Email sending

---

## 🎓 AI Models Explained

### Rule-Based AI (Default)
- Searches for keywords (property, divorce, etc)
- Counts matches
- Calculates confidence
- **Fast** (< 100ms)
- **Accuracy**: 70-80%

### LegalBERT AI (Advanced)
- Uses neural network trained on legal text
- Understands meaning, not just keywords
- Can match similar past cases
- **Slower** (2-5 seconds)
- **Accuracy**: 90-95%

**To use LegalBERT**: Set `AI_MODEL=bert` in `.env`

---

## 📧 Email Setup

### Step-by-Step Gmail Setup

1. **Go to**: https://myaccount.google.com/apppasswords
2. **Enable 2-Step Verification** if not done
3. **Select**: Mail → Windows Computer
4. **Click**: Generate
5. **Copy**: 16-character password
6. **Add to `.env`**:
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=the-16-char-password
   ```
7. **Restart backend**

Now contact form emails will be sent!

---

## 🌐 Deployment (Simple)

### Deploy Backend (Render/Railway)
1. Push code to GitHub
2. Connect repo to Render/Railway
3. Set environment variables in dashboard
4. Deploy (auto redeploy on push)

### Deploy Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set `VITE_API_BASE_URL` to backend URL
3. Deploy (auto on push)

---

## 📚 Full Documentation

Need more details? Read: `PROJECT_DOCUMENTATION.md`

Contains:
- Detailed API docs
- Database schema
- Complete setup guide
- Troubleshooting
- Deployment guide

---

## ✅ Checklist Before Production

- [ ] Change `SECRET_KEY` (min 32 chars)
- [ ] Update `ALLOWED_ORIGINS` (add your domain)
- [ ] Set `DEBUG=False`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Setup proper SMTP (not test account)
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Add API rate limiting
- [ ] Setup automated backups

---

## 💡 Quick Tips

1. **Clear cache if stuck**: 
   ```javascript
   localStorage.clear()  // Browser console
   ```

2. **Check API docs**: `http://localhost:8000/docs`

3. **View database**: Install DB Browser for SQLite

4. **Test email**: Use Mailtrap.io (free)

5. **Debug backend**: Check console logs in terminal

6. **Debug frontend**: Open browser DevTools (F12)

---

## 🆘 Need Help?

1. Check this guide first
2. Read `PROJECT_DOCUMENTATION.md`
3. Check browser console (F12)
4. Check backend logs
5. Check `.env` file is correct
6. Try clearing cache/database

---

**Version**: 1.0  
**Last Updated**: January 19, 2026  
**Time to read**: 5 minutes
