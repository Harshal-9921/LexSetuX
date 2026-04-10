# PDF Viewer Quick Start Guide

## What Was Implemented

The Legal Precedents Database now has a **full PDF viewing system** with proper access control and error handling.

## How to Use

### 1. View a Precedent's PDF

1. Go to the **Precedents Database** section
2. Search for a case (e.g., search for "property")
3. Find a case with the **📄 View PDF** button
4. Click the **View PDF** button

### 2. PDF Viewer Modal Opens

The modal will:
- Display the case name and citation
- Load the PDF file (if available)
- Show a loading spinner while fetching
- Allow you to view the PDF inline

### 3. PDF Actions

Inside the modal, you can:
- **View** the PDF document directly in the browser
- **Download** the PDF using the download button
- **Close** the modal when done

### 4. If PDF Unavailable

If the PDF file is not found on disk:
- You'll see a helpful error message
- The case summary will be displayed
- The original PDF file reference is shown

## Features

✅ **Full PDF Support**
- View PDFs directly in browser
- Download PDFs to your computer
- Proper PDF file handling

✅ **Error Handling**
- Shows meaningful error messages
- Displays case summary as fallback
- Handles missing files gracefully

✅ **User Experience**
- Modal popup design
- Loading states
- Responsive design
- Professional styling

✅ **Access Control**
- Only shows View PDF button when file exists
- Validates PDF availability before serving
- Secure file path handling

## API Endpoints Used

The PDF Viewer uses these backend endpoints:

```
GET /api/precedents/pdf-info/{precedent_id}
  → Checks if PDF is available

GET /api/precedents/pdf/{precedent_id}
  → Serves the PDF file for viewing
```

## Troubleshooting

### "PDF Not Found" Error
- The case has a PDF reference but the file isn't in the dataset
- Check the case summary for information
- Contact admin to upload missing PDF files

### PDF Won't Load
- Check that the backend is running
- Ensure the file path exists in:
  - `supreme_court_judgments/` folder
  - `dataset/` folder
  - Or as specified in the database

### Button Not Showing
- The case may not have a PDF file associated
- Only precedents with pdf_file data show the View PDF button

## For Developers

### Backend Endpoint Structure

```python
# Check PDF availability
GET /api/precedents/pdf-info/{precedent_id}

# Serve PDF file
GET /api/precedents/pdf/{precedent_id}
```

### Frontend Component

```typescript
import { PDFViewer } from './PDFViewer';

// Usage in component
<PDFViewer
  precedentId={id}
  caseName={name}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
```

## System Architecture

```
User Click "View PDF"
         ↓
PDFViewer Modal Opens
         ↓
Fetch /api/precedents/pdf-info/{id}
         ↓
Check If Available
    ↙          ↘
Available    Not Available
    ↓              ↓
Load PDF    Show Summary
    ↓              ↓
Display  Display Error
```

## File Locations

### Backend
- `/backend/app/routers/precedents.py` - PDF endpoints

### Frontend
- `/frontend/src/components/PDFViewer.tsx` - PDF modal component
- `/frontend/src/components/PrecedentsPanel.tsx` - Updated with PDF viewer

## Notes

- PDFs are served inline (displayed in browser, not downloaded)
- File paths are validated for security
- Multiple fallback locations are checked for PDF files
- Case metadata is displayed if PDF is unavailable
