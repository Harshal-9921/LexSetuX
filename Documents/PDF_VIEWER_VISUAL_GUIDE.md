# Visual Guide - PDF Viewer Implementation

## Before Implementation
```
┌─────────────────────────────────┐
│ Legal Precedents Database       │
├─────────────────────────────────┤
│                                 │
│  Case: Property Owners Assoc... │
│  Year: 2024                     │
│  Court: Supreme Court           │
│                                 │
│  [✓ Use as Reference]           │
│  [📄 View PDF] <- Just showed   │
│                   alert popup   │
└─────────────────────────────────┘

When clicked:
⚠️ Alert Box: "PDF: path/to/file.pdf"
(No actual PDF viewing)
```

---

## After Implementation

### Step 1: User Sees Button
```
┌────────────────────────────────────┐
│ Legal Precedents Database          │
├────────────────────────────────────┤
│                                    │
│  Case: Property Owners Assoc vs... │
│  Year: 2024                        │
│  Citation: 2024 SCC 147            │
│                                    │
│  Summary: Property rights case...  │
│                                    │
│  [✓ Use as Reference][📄 View PDF] │
│                      ↑ Click here  │
└────────────────────────────────────┘
```

### Step 2: Modal Opens with Loading State
```
╔════════════════════════════════════════════════╗
║ Property Owners Assoc vs State Maharashtra     ║          ← Case name
║ 2024 SCC 147                                  ║          ← Citation
║                                            [X] ║          ← Close button
╠════════════════════════════════════════════════╣
║                                                ║
║            ⏳ Loading PDF...                   ║          ← Loading spinner
║                                                ║
║                                                ║
║                                                ║
╠════════════════════════════════════════════════╣
║                     [Download PDF]  [Close]    ║          ← Action buttons
╚════════════════════════════════════════════════╝
```

### Step 3: PDF Displays Successfully
```
╔════════════════════════════════════════════════╗
║ Property Owners Assoc vs State Maharashtra     ║
║ 2024 SCC 147                                  ║
║                                            [X] ║
╠════════════════════════════════════════════════╣
║                                                ║
║  ┌────────────────────────────────────────┐   ║
║  │                                        │   ║
║  │  Property Owners Association vs State  │   ║
║  │  of Maharashtra on 5 November 2024     │   ║
║  │                                        │   ║
║  │  Supreme Court of India                │   ║
║  │  Civil Appeal No. 1012 of 2002         │   ║
║  │                                        │   ║
║  │  JUDGMENT                              │   ║
║  │  [PDF content displayed inline]        │   ║
║  │                                        │   ║
║  │  [Page navigation arrows]              │   ║
║  │                                        │   ║
║  └────────────────────────────────────────┘   ║
║                                                ║
╠════════════════════════════════════════════════╣
║                [📥 Download PDF]  [Close]      ║
╚════════════════════════════════════════════════╝
```

### Alternative Step 3: PDF Not Found (Graceful Fallback)
```
╔════════════════════════════════════════════════╗
║ Property Owners Assoc vs State Maharashtra     ║
║ 2024 SCC 147                                  ║
║                                            [X] ║
╠════════════════════════════════════════════════╣
║                                                ║
║              ⚠️ PDF Not Available              ║
║                                                ║
║  The PDF file 'path/to/file.pdf' was not      ║
║  found on disk, but here's the case summary:  ║
║                                                ║
║  ┌────────────────────────────────────────┐   ║
║  │ Case Summary                           │   ║
║  │ ────────────────────────────────────── │   ║
║  │ Property Owners Association vs State   │   ║
║  │ Of Maharashtra on 5 November, 2024...  │   ║
║  │ Reportable 2024 INSC 835 IN THE        │   ║
║  │ SUPREME COURT OF INDIA...              │   ║
║  └────────────────────────────────────────┘   ║
║                                                ║
╠════════════════════════════════════════════════╣
║                             [Close]             ║
╚════════════════════════════════════════════════╝
```

---

## API Flow Diagram

```
Frontend (React)
     │
     │ User clicks "View PDF"
     ↓
[PDFViewer Modal Opens]
     │
     │ GET /api/precedents/pdf-info/{id}
     ↓
Backend FastAPI
     │
     ├─→ [Check if precedent exists]
     │     ├─ YES ↓
     │     │   [Check if PDF file exists]
     │     │     ├─ YES ↓
     │     │     │   Return: {available: true, url: "..."}
     │     │     │
     │     │     └─ NO ↓
     │     │         Return: {available: false, message: "..."}
     │     │
     │     └─ NO ↓
     │         Return: {available: false, message: "..."}
     │
     ↓
Frontend
     │
     ├─ If available:
     │  └─→ Fetch /api/precedents/pdf/{id}
     │      └─→ Display PDF in iframe
     │
     └─ If not available:
        └─→ Display case summary + error message
```

---

## Component Structure

```
PrecedentsPanel
   │
   ├─ [Precedents List]
   │  └─ Precedent Card
   │     ├─ Case Info
   │     ├─ Summary
   │     └─ Buttons
   │        ├─ [Use as Reference]
   │        └─ [View PDF] ← Triggers
   │
   └─ PDFViewer Modal (Conditional)
      ├─ Header
      │  ├─ Case Name
      │  └─ Citation
      │
      ├─ Content
      │  ├─ Loading State
      │  ├─ PDF Viewer (iframe)
      │  └─ Error Display
      │
      └─ Footer
         ├─ [Download PDF]
         └─ [Close]
```

---

## State Management

```
PrecedentsPanel State:
├─ selectedPDFId: number | null
│  └─ ID of precedent to view
│     └─ Triggers PDFViewer rendering
│
└─ selectedPDFName: string
   └─ Case name for modal header

PDFViewer State:
├─ loading: boolean
│  └─ Shows loading spinner
│
├─ pdfUrl: string | null
│  └─ URL of loaded PDF
│
├─ error: string | null
│  └─ Error message if any
│
└─ pdfInfo: Object
   └─ Case metadata from API
```

---

## User Actions

| Action | What Happens |
|--------|--------------|
| Click "View PDF" | Modal opens, PDF info fetched |
| PDF loads successfully | Display in iframe |
| Click "Download PDF" | Browser downloads PDF |
| Click "Close" | Modal closes, state reset |
| PDF unavailable | Shows summary + error |
| Click outside modal | (If Esc key) Closes modal |

---

## Mobile View

```
[Mobile Screen]

┌─────────────────────┐
│ Legal Precedents DB │
├─────────────────────┤
│ Case Name           │
│ Year: 2024          │
│                     │
│ [Use as Reference]  │
│ [View PDF]          │
└─────────────────────┘

When modal opens:

┌─────────────────────┐
│ Case Name       [X] │
├─────────────────────┤
│                     │
│ [PDF Viewer]        │
│ [responsive iframe] │
│                     │
├─────────────────────┤
│ [Download] [Close]  │
└─────────────────────┘
```

---

## Error States

### Scenario 1: PDF File Missing
```
Status: HANDLED ✅
Display: Summary + Error message
Example: "PDF file referenced as '1950/file.pdf' but not found"
```

### Scenario 2: Precedent Not Found
```
Status: HANDLED ✅
Display: Error message
Example: "Precedent not found"
```

### Scenario 3: Network Error
```
Status: HANDLED ✅
Display: Error message
Example: "Failed to load PDF. Please try again."
```

### Scenario 4: No PDF Reference
```
Status: HANDLED ✅
Display: "No PDF reference for this case"
Display: Can still use case reference
```

---

## Success Metrics

✅ View PDF button works  
✅ Modal opens on click  
✅ PDF displays properly  
✅ Download functionality works  
✅ Error handling is graceful  
✅ Fallback summary shows  
✅ Mobile responsive  
✅ User-friendly interface  

---

**Ready to Use!** 🎉
