# Troubleshooting Guide

## "Failed to fetch" Error

If you're getting "Failed to fetch" when analyzing a case, follow these steps:

### 1. Check if Backend is Running

Make sure your FastAPI backend is running:

```powershell
# In backend directory
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Test Backend Connection

Open your browser and go to:
- http://localhost:8000/health
- Should show: `{"status":"healthy"}`

Or visit:
- http://localhost:8000/docs
- Should show Swagger API documentation

### 3. Check CORS Configuration

The backend is now configured to allow all origins in development. If you still have issues:

**Backend** (`backend/app/config.py`):
```python
CORS_ORIGINS: list[str] = [
    "http://localhost:5173",  # Default Vite port
    "http://localhost:3000",  # Alternative port
    "*",  # Allow all (development only)
]
```

**Frontend** (`frontend/.env` or `frontend/.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Check Frontend Port

Make sure your frontend is running on the expected port:
- Default Vite: `http://localhost:5173`
- If different, update `CORS_ORIGINS` in backend config

### 5. Browser Console

Check browser console (F12) for detailed error messages. The improved error handler will show:
- Connection errors
- API URL being used
- Specific error details

### 6. Network Tab

In browser DevTools → Network tab:
- Look for the `/api/cases/analyze` request
- Check if it's being sent
- Check status code (should be 200)
- Check response details

## Results Not Persisting

Results are now saved to localStorage and will persist:

✅ **Results will:**
- Stay visible after page refresh
- Remain when scrolling
- Persist until explicitly cleared
- Load automatically on page load

To clear results:
- Click the X button in the results card header
- Or clear localStorage: `localStorage.removeItem('caseAnalysisResults')`

## Common Issues

### Issue: Backend won't start
**Solution**: 
- Check if port 8000 is already in use
- Install dependencies: `pip install -r requirements.txt`
- Check database connection (SQLite should work automatically)

### Issue: CORS errors in browser
**Solution**: 
- Make sure backend allows your frontend origin
- Check `CORS_ORIGINS` in `backend/app/config.py`
- Restart backend after changing CORS settings

### Issue: Results disappear
**Solution**: 
- Results now persist in localStorage
- They should reload automatically
- Check browser console for errors

### Issue: Different port numbers
**Solution**: 
- Backend default: `http://localhost:8000`
- Frontend default: `http://localhost:5173`
- Update `VITE_API_BASE_URL` if backend is on different port
- Update `CORS_ORIGINS` if frontend is on different port

## Quick Test

1. **Start Backend:**
   ```powershell
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Test API directly:**
   - Visit: http://localhost:8000/docs
   - Try: POST `/api/cases/analyze`
   - Body: `{"category": "property", "description": "test", "user_role": "customer"}`

4. **Test from Frontend:**
   - Submit a case
   - Should see results immediately
   - Results should persist on page refresh

## Still Having Issues?

1. Check all console errors (browser and terminal)
2. Verify both servers are running
3. Check network tab in browser DevTools
4. Try accessing backend directly: http://localhost:8000/health
5. Clear browser cache and localStorage
6. Restart both servers
