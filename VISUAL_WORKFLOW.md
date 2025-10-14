# 🎯 Email Dumper - Visual Workflow Guide

## How Your Email Dumper Works

---

## 📧 EMAIL FLOW (Automatic Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR EMAIL INBOX                              │
│  📨 Email: "Policy Report"                                       │
│  📎 Attachment: PolicyBazaar_Report.xlsx                         │
│  Status: UNREAD ⭐                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Every 5 minutes (CRON Job)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    IMAP SERVICE                                  │
│  🔍 Searching for: Unread emails with Excel attachments          │
│  📥 Found: 1 email                                               │
│  📎 Downloading attachment...                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Parse Excel
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXCEL SERVICE                                 │
│  📑 Reading file: PolicyBazaar_Report.xlsx                       │
│  🔎 Finding columns: PROPOSAL NUMBER, PROPOSER NAME, etc.        │
│  ✅ Extracted: 150 rows × 40+ columns                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Save/Update
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SERVICE                              │
│  💾 MongoDB: emaildumper.mails                                   │
│  ✅ Created: 120 new proposals                                   │
│  🔄 Updated: 30 existing proposals (saved old data to history)   │
│  ⏭️  Unchanged: 0                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Display
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WEB DASHBOARD                                 │
│  📊 Total Proposals: 1,523 (+150)                                │
│  📈 Recent Activity: 150 new proposals synced                    │
│  🔍 Search: Now includes new proposals                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mark as processed
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL INBOX (Updated)                         │
│  📨 Email: "Policy Report"                                       │
│  📎 Attachment: PolicyBazaar_Report.xlsx                         │
│  Status: READ ✓ (marked as read)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📤 MANUAL UPLOAD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                                 │
│  📁 File: Reports\Daily_Proposals.xlsx                           │
│  📊 Contains: 50 proposals with 40+ fields                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User action: Upload via web UI
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WEB UI - UPLOAD PAGE                          │
│  🖱️  Click: "Browse Files"                                      │
│  📁 Select: Daily_Proposals.xlsx                                 │
│  ▶️  Click: "Upload & Process"                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST to backend
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                   │
│  📥 Endpoint: /api/upload                                        │
│  💾 Saves to: backend/uploads/upload-12345.xlsx                  │
│  ✅ Validation: File type (.xlsx/.xls), Size (<10MB)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Process file
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXCEL SERVICE                                 │
│  📖 Reading: upload-12345.xlsx                                   │
│  🔍 Extracting: PROPOSAL NUMBER, PROPOSER NAME, etc.             │
│  ✅ Validated: 50 records, all have PROPOSAL NUMBER              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Bulk insert/update
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SERVICE                              │
│  🔄 Processing: 50 records                                       │
│  ✅ Created: 35 new proposals                                    │
│  🔄 Updated: 15 existing (old data → history)                    │
│  ⏭️  Unchanged: 0                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Return results
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WEB UI - RESULTS                              │
│  ✅ File processed successfully!                                 │
│  📊 Total Records: 50                                            │
│  ✅ Created: 35 | 🔄 Updated: 15 | ⏭️ Unchanged: 0              │
│  🗑️  Cleanup: Deleted upload-12345.xlsx                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 SEARCH FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB UI - SEARCH PAGE                          │
│  🔍 User enters: "PROP001"                                       │
│  ▶️  Click: "Search"                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API call
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                   │
│  🔍 GET /api/customers?search=PROP001                            │
│  🔎 Searching in: proposalNumber, proposerName, intermediaryName │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB query
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
│  🔍 db.mails.find({                                              │
│       $or: [                                                     │
│         { proposalNumber: /PROP001/i },                          │
│         { proposerName: /PROP001/i },                            │
│         { intermediaryName: /PROP001/i }                         │
│       ]                                                          │
│     })                                                           │
│  ✅ Found: 1 match                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Return results
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WEB UI - RESULTS                              │
│  📋 Search Results (1 found)                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PROP001 │ Rajesh Kumar │ Pending │ ₹25,000              │   │
│  │ [View Details] [View History]                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 VERSION HISTORY FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│        FIRST UPLOAD (Oct 13, 2025)                               │
│  PROP001: { status: "Pending", premium: 25000 }                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Saved to database
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        DATABASE - Version 1                                      │
│  {                                                               │
│    proposalNumber: "PROP001",                                    │
│    policyStatus: "Pending",                                      │
│    netPremium: "25000",                                          │
│    history: []  ← No history yet (first version)                │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2 days later...
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        SECOND UPLOAD (Oct 15, 2025)                              │
│  PROP001: { status: "Completed", premium: 28000 } ← Changed!     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Update with history tracking
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        DATABASE SERVICE - Comparing...                           │
│  Old: { status: "Pending", premium: 25000 }                      │
│  New: { status: "Completed", premium: 28000 }                    │
│  ✅ Changes detected! Saving old data to history...              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Save with version
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        DATABASE - Version 2                                      │
│  {                                                               │
│    proposalNumber: "PROP001",                                    │
│    policyStatus: "Completed",  ← Current (new)                   │
│    netPremium: "28000",        ← Current (new)                   │
│    history: [                                                    │
│      {                                                           │
│        updatedAt: "2025-10-15T10:30:00Z",                        │
│        changes: {                                                │
│          policyStatus: "Pending",      ← Old value               │
│          netPremium: "25000"           ← Old value               │
│        }                                                         │
│      }                                                           │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User views history
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│        WEB UI - VIEW HISTORY                                     │
│                                                                  │
│  📜 Version History for PROP001                                  │
│                                                                  │
│  ┌─ Version 2 (Current) ────────────────────────────────────┐   │
│  │ Oct 15, 2025 10:30 AM                                     │   │
│  │ Status: Completed                                         │   │
│  │ Premium: ₹28,000                                          │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ Version 1 (Previous) ────────────────────────────────────┐  │
│  │ Oct 13, 2025 9:15 AM                                      │  │
│  │ Status: Pending → Completed (Changed!)                    │  │
│  │ Premium: ₹25,000 → ₹28,000 (Changed!)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 COMPLETE DATA FLOW DIAGRAM

```
┌───────────────┐
│  Email Inbox  │ ←────── Emails arrive with Excel attachments
└───────┬───────┘
        │
        │ ↓ IMAP Service fetches (every 5 min)
        │
┌───────▼───────┐         ┌──────────────┐
│ IMAP Service  │────────→│ Email marked │
│ (Backend)     │         │ as READ      │
└───────┬───────┘         └──────────────┘
        │
        │ ↓ Downloads Excel
        │
┌───────▼───────┐
│ Excel Service │ ←────── Manual upload from web UI
│ (Backend)     │
└───────┬───────┘
        │
        │ ↓ Extracts data (40+ fields)
        │
┌───────▼───────────┐
│ Database Service  │
│ (Backend)         │
└───────┬───────────┘
        │
        │ ↓ Saves/Updates with version tracking
        │
┌───────▼───────────┐
│    MongoDB        │
│  emaildumper.mails│
└───────┬───────────┘
        │
        │ ↓ Queries for display
        │
┌───────▼───────────┐
│   Backend API     │
│   (Express)       │
└───────┬───────────┘
        │
        │ ↓ HTTP REST API
        │
┌───────▼───────────┐
│  Frontend (React) │
│  ├─ Dashboard     │ ←────── User views statistics
│  ├─ Upload        │ ←────── User uploads Excel
│  ├─ Search        │ ←────── User searches proposals
│  └─ History       │ ←────── User views changes
└───────────────────┘
```

---

## ⚙️ CONFIGURATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    .env FILE                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ EMAIL_USER=neerajkumar4@policybazaar.com                   │ │
│  │ EMAIL_PASSWORD=qfrydpwiewurwxed                            │ │
│  │ EMAIL_HOST=imap.gmail.com                                  │ │
│  │ EMAIL_PORT=993                                             │ │
│  │ EMAIL_TLS=true                                             │ │
│  │                                                            │ │
│  │ MONGO_URI=mongodb+srv://user:pass@cluster.net/emaildumper │ │
│  │                                                            │ │
│  │ CRON_SCHEDULE=*/5 * * * *  ← Every 5 minutes              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Loaded on startup
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ✅ MongoDB connected: emaildumper                          │ │
│  │ ✅ IMAP client initialized                                 │ │
│  │ ✅ CRON job started: */5 * * * *                           │ │
│  │ ✅ Server running: http://localhost:5000                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ CRON triggers every 5 minutes
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATIC SYNC                                │
│  ⏰ Time: Every 5 minutes (configurable)                         │
│  🔄 Action: Check email → Download → Process → Save              │
│  📊 Result: Dashboard updated automatically                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 USER JOURNEY MAP

### Journey 1: First Time Setup

```
User Action              System Response              Result
────────────            ────────────────            ───────────
1. Clone repo           ✓ Files downloaded           ✓ Ready
   ↓
2. npm install          ✓ Dependencies installed     ✓ Ready
   ↓
3. Edit .env            ✓ Configuration loaded       ✓ Ready
   ↓
4. npm start (backend)  ✓ Server started             ✓ Running
   ↓
5. npm start (frontend) ✓ React app started          ✓ Running
   ↓
6. Open localhost:3000  ✓ Dashboard displayed        ✓ Success!
```

### Journey 2: Daily Usage

```
User Action              System Response              Result
────────────            ────────────────            ───────────
1. Open dashboard       ✓ Shows current stats        ✓ Info
   ↓
2. Click "Sync Now"     ✓ Fetches emails             ✓ New data
   ↓
3. View recent activity ✓ Lists new proposals        ✓ Verified
   ↓
4. Search "PROP001"     ✓ Finds proposal             ✓ Details
   ↓
5. View history         ✓ Shows all changes          ✓ Complete
```

### Journey 3: Email Processing (Automatic)

```
Time                    System Action                Result
────────────            ────────────────            ───────────
9:00 AM                 CRON: Check email            0 new emails
   ↓
9:05 AM                 CRON: Check email            0 new emails
   ↓
9:07 AM                 📧 Email arrives (unread)    Waiting...
   ↓
9:10 AM                 CRON: Check email            ✓ Found 1!
                        ↓ Download Excel
                        ↓ Extract 50 proposals
                        ↓ Save to database
                        ↓ Mark email as read
                        ✓ Dashboard updated          ✓ Complete
```

---

## 📊 DATA TRANSFORMATION EXAMPLE

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXCEL FILE (Input)                            │
├──────────────────┬─────────────┬───────────┬────────────────────┤
│ PROPOSAL NUMBER  │ PROPOSER    │ POLICY    │ Net Premium        │
│                  │ NAME        │ STATUS    │                    │
├──────────────────┼─────────────┼───────────┼────────────────────┤
│ PROP001          │ Rajesh      │ Pending   │ 25000              │
│                  │ Kumar       │           │                    │
└──────────────────┴─────────────┴───────────┴────────────────────┘

                              │
                              │ Excel Service extracts & normalizes
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                    JAVASCRIPT OBJECT                             │
│  {                                                               │
│    "proposalNumber": "PROP001",                                  │
│    "proposerName": "Rajesh Kumar",                               │
│    "policyStatus": "Pending",                                    │
│    "netPremium": "25000",                                        │
│    // ... 36+ more fields                                        │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘

                              │
                              │ Database Service validates & saves
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DOCUMENT                              │
│  {                                                               │
│    "_id": ObjectId("..."),                                       │
│    "proposalNumber": "PROP001",                                  │
│    "proposerName": "Rajesh Kumar",                               │
│    "policyStatus": "Pending",                                    │
│    "netPremium": "25000",                                        │
│    "createdAt": ISODate("2025-10-15T10:30:00Z"),                │
│    "updatedAt": ISODate("2025-10-15T10:30:00Z"),                │
│    "history": [],                                                │
│    // ... all other fields                                       │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘

                              │
                              │ Frontend API fetches & displays
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                    WEB DASHBOARD (Display)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Proposal: PROP001                                        │  │
│  │  Customer: Rajesh Kumar                                   │  │
│  │  Status: 🟡 Pending                                       │  │
│  │  Premium: ₹25,000                                         │  │
│  │  Last Updated: Oct 15, 2025 10:30 AM                      │  │
│  │  [View Full Details] [View History]                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 ERROR HANDLING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│  Excel Upload with Missing PROPOSAL NUMBER                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User uploads
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Excel Service validates...                                      │
│  ❌ Error: "PROPOSAL NUMBER column not found"                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Returns error
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Web UI displays:                                                │
│  ❌ Upload failed!                                               │
│  Error: PROPOSAL NUMBER column not found                         │
│  Please add this column to your Excel file.                      │
└─────────────────────────────────────────────────────────────────┘
```

---

**Use this visual guide to understand how each component works together! 🎯**
