# Frontend Fixes - Role-Based Output Display

## Problems Fixed

### 1. **API Integration**
- ❌ **Before**: Calling Supabase Edge Functions (`supabase.functions.invoke`)
- ✅ **After**: Using FastAPI backend via `apiClient.analyzeCase()`

### 2. **User Role Detection**
- ❌ **Before**: No role detection, defaulting to "customer"
- ✅ **After**: Gets role from `profile.role` (customer/lawyer)

### 3. **Results Display**
- ❌ **Before**: Only showing toast notifications with counts
- ✅ **After**: Full UI component displaying all role-based results

### 4. **Missing Components**
- ❌ **Before**: No results display component
- ✅ **After**: Created `CaseAnalysisResults.tsx` with separate views for customers and lawyers

## Changes Made

### CaseInputForm.tsx
1. Imported `apiClient` and `CaseAnalysisResults` component
2. Added `analysisResults` state to store API response
3. Updated `handleAnalyzeCase` to:
   - Get user role from profile
   - Call FastAPI backend instead of Supabase
   - Store results in state
   - Scroll to results section
4. Added results display section in the UI

### CaseAnalysisResults.tsx (NEW)
Created comprehensive results display component with:

**Customer View:**
- Case category badge
- Simplified explanation in plain English
- Legal rights list
- Basic applicable laws
- Recommended lawyers with match scores
- Next steps/recommendations

**Lawyer View:**
- Detailed case classification (domain, sub-domain, confidence)
- Technical summary
- Exact IPC/Act sections with penalties
- Past judgments/precedents with citations
- Predicted opponent arguments
- Case strength assessment with progress bar

### api.ts
Updated `CaseAnalysisResponse` interface to match backend schema with:
- Role-based optional fields
- Proper typing for all fields
- Support for both customer and lawyer responses

## How It Works Now

1. **User submits case** → Form validates input
2. **API call** → FastAPI backend (`/api/cases/analyze`)
   - Role determined from `profile.role`
   - Request includes `user_role` parameter
3. **Backend processes** → Role-based output generation
4. **Response received** → Results stored in state
5. **UI displays** → `CaseAnalysisResults` component shows appropriate view:
   - **Customers**: Simplified, understandable information
   - **Lawyers**: Detailed, technical information

## Testing

To test the fixes:

1. **For Customers:**
   - Login as customer
   - Submit a case
   - Should see: Simplified explanation, basic rights, lawyer recommendations

2. **For Lawyers:**
   - Login as lawyer
   - Submit a case
   - Should see: Detailed classification, exact sections, precedents, opponent points

## Environment Variable

Make sure to set in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

Or the frontend will try to use `http://localhost:8000` by default.
