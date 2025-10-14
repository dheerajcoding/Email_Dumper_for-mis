# 📧 Email Dumper - Complete User Guide

## 🎯 What Does This Project Do?

This application automatically extracts customer/proposal data from Excel files attached to emails and stores them in a MongoDB database. Perfect for PolicyBazaar's proposal tracking!

### Key Features:
- ✅ **Automatic Email Monitoring** - Checks your email inbox every 5 minutes
- ✅ **Excel Processing** - Extracts 40+ fields from Excel attachments
- ✅ **Version History** - Tracks all changes to each proposal
- ✅ **Manual Upload** - Upload Excel files directly
- ✅ **Search & Filter** - Find proposals quickly
- ✅ **Dashboard** - Visual statistics and recent activity

---

## 🚀 How It Works

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Email     │ ---> │  Fetch via   │ ---> │  Extract    │ ---> │   MongoDB    │
│  Inbox      │      │    IMAP      │      │  Excel Data │      │  (mails)     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
                                                                        │
                                                                        v
                                                              ┌──────────────┐
                                                              │  Dashboard   │
                                                              │  (Web UI)    │
                                                              └──────────────┘
```

### Process Flow:
1. **Email arrives** with Excel attachment → Inbox
2. **IMAP service** fetches unread emails (every 5 min)
3. **Excel parser** extracts 40+ fields (PROPOSAL NUMBER, etc.)
4. **Database** saves/updates records in `mails` collection
5. **Web UI** displays data on dashboard

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [x] **Node.js** installed (v14 or higher)
- [x] **MongoDB** (local or Atlas account)
- [x] **Email account** (Gmail, Outlook, or corporate)
- [x] **App password** generated for email
- [x] **Dependencies installed** (npm install)

---

## ⚙️ Setup Instructions

### Step 1: Configure Your Email (IMAP)

Edit `backend/.env` file:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://neerajkumar4:neeraj123@dumper.7mm3hgn.mongodb.net/emaildumper

# Email Configuration (IMAP)
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASSWORD=qfrydpwiewurwxed  # Your app password
EMAIL_TLS=true

# Other Settings
PORT=5000
CRON_SCHEDULE=*/5 * * * *  # Every 5 minutes
```

### Step 2: Generate App Password (Gmail)

**For Google Workspace (policybazaar.com):**

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: `neerajkumar4@policybazaar.com`
3. Select:
   - App: **Mail**
   - Device: **Other** → Type "Email Dumper"
4. Click **Generate**
5. Copy the 16-character password
6. Paste into `.env` as `EMAIL_PASSWORD` (remove spaces)

**For Other Email Providers:**
- **Outlook/Office365**: Enable IMAP and use app password
  - Host: `outlook.office365.com`
  - Port: `993`
- **Yahoo**: Generate app password from account settings
  - Host: `imap.mail.yahoo.com`

### Step 3: Start the Application

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Anuj kumar\emaildumper\backend"
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Anuj kumar\emaildumper\frontend"
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 📊 Using the Application

### 1️⃣ Dashboard View

**URL:** http://localhost:3000

**What You See:**
- **Total Proposals** - Count of all records
- **Pending** - Proposals with status "Pending"
- **Completed** - Proposals with status "Completed"
- **Recent Activity** - Last 10 synced proposals

**Actions:**
- Click **"Sync Now"** to manually fetch emails immediately
- View **Last Sync Time** to see when emails were last checked

---

### 2️⃣ Upload Excel Files Manually

**URL:** http://localhost:3000/upload

**Steps:**
1. Click **"Browse Files"** or drag & drop
2. Select your Excel file (`.xlsx` or `.xls`)
3. Click **"Upload & Process"**
4. View results:
   - ✅ Created: New proposals added
   - 🔄 Updated: Existing proposals modified
   - ⏭️ Unchanged: No changes detected

**Supported Excel Format:**

Your Excel file **must have** these column headers (case-insensitive):

| Required | Column Name |
|----------|-------------|
| ✅ **REQUIRED** | **PROPOSAL NUMBER** |
| Optional | PROPOSER CODE |
| Optional | PROPOSER NAME |
| Optional | Business Type |
| Optional | POLICY STATUS |
| Optional | Net Premium |
| Optional | Gross Premium |
| ... | 40+ more fields supported |

**Example Excel Structure:**

```
| PROPOSAL NUMBER | PROPOSER NAME  | POLICY STATUS | Net Premium | Gross Premium |
|-----------------|----------------|---------------|-------------|---------------|
| PROP001         | Rajesh Kumar   | Pending       | 25000       | 27500         |
| PROP002         | Priya Sharma   | Completed     | 18000       | 19800         |
```

**Sample File Location:**
```
backend\sample-data\sample-customers.xlsx
```

---

### 3️⃣ Search for Proposals

**URL:** http://localhost:3000/search

**Search Options:**

1. **By Proposal Number:**
   - Enter: `PROP001`
   - Click **Search**

2. **By Customer Name:**
   - Enter: `Rajesh Kumar`
   - Click **Search**

3. **By Intermediary:**
   - Enter intermediary name
   - Click **Search**

**View History:**
- Click **"View History"** button next to any proposal
- See all changes made to that proposal over time
- Each version shows:
  - 📅 Date & Time of change
  - 📝 What fields were modified
  - 🔄 Old value → New value

---

### 4️⃣ Automatic Email Sync

**How It Works:**

1. **Send Email** to: `neerajkumar4@policybazaar.com`
2. **Attach Excel** file with proposal data
3. **Keep it Unread** in inbox
4. **Wait 5 minutes** (or click "Sync Now")
5. **Check Dashboard** - New proposals appear!

**Email Requirements:**
- ✅ Must have Excel attachment (`.xlsx` or `.xls`)
- ✅ Must be **unread** in INBOX
- ✅ Excel must contain **PROPOSAL NUMBER** column
- ✅ Must be in INBOX folder (not spam/trash)

**What Happens:**
```
Email Received (Unread)
   ↓
IMAP Service Detects It (every 5 min)
   ↓
Downloads Excel Attachment
   ↓
Extracts All Data (40+ fields)
   ↓
Saves to MongoDB (mails collection)
   ↓
Marks Email as Read
   ↓
Updates Dashboard
```

---

## 🔍 Supported Fields (40+)

Your Excel files can contain any/all of these columns:

### Primary Key (Required):
- **PROPOSAL NUMBER** ✅ (must be unique)

### Proposer Information:
- PROPOSER CODE
- PROPOSER NAME
- Nationality

### Business Details:
- Business Type
- SOURCECODE
- CREATED DATE
- PRODUCT NAME

### Policy Information:
- POLICY STATUS
- SUBSTATUS
- Policy Issue date
- Policy Expiry Date
- RECEIPT TAG

### Location & Organization:
- Branch Code
- INWARDING BRANCH NAME
- Intermediary CODE
- Intermediary Name
- INTERMEDIARY CLASFICATION
- Channel

### Financial Details:
- Net Premium
- Gross Premium
- PREMIUM MODE
- APPLICABLE SUMINUSRED

### Dates & Tracking:
- PROPOSAL INTIMATION DATE
- Latest Sub Status Date
- Latest Followup Date
- Intimation Ageing
- Sub Status Ageing

### Additional Fields:
- GO GREEN
- combi Flag
- Cover Type
- GST Exemption
- EMPLOYEE DISCOUNT
- LG CODE
- LEAD ID
- PARTNER SP CODE
- Sales Manager Code
- Sales Manager Name
- Inwarding User Code
- Discrepancy Remark
- ... and more!

**Note:** Field names are case-insensitive and space-insensitive:
- "PROPOSAL NUMBER" = "Proposal Number" = "proposal_number" ✅

---

## 🛠️ Troubleshooting

### Problem: "Connection Refused" Error

**Solution:**
1. Check if backend is running:
   ```powershell
   cd backend
   npm start
   ```
2. Verify backend URL in frontend:
   - Should be: `http://localhost:5000`
3. Check CORS settings in `backend/.env`

---

### Problem: No Emails Being Fetched

**Checklist:**
- [ ] Email is **unread** in inbox
- [ ] Email has Excel attachment
- [ ] IMAP credentials correct in `.env`
- [ ] App password is valid (not regular password)
- [ ] IMAP enabled in email account
- [ ] Check backend logs for errors

**Test IMAP Connection:**
```powershell
cd backend
curl http://localhost:5000/api/sync/test-connection
```

**Should return:**
```json
{
  "success": true,
  "message": "Email connection successful"
}
```

---

### Problem: Excel Upload Fails

**Common Issues:**

1. **Missing PROPOSAL NUMBER column**
   - Error: "PROPOSAL NUMBER column not found"
   - Fix: Add "PROPOSAL NUMBER" header to Excel

2. **File too large**
   - Limit: 10MB
   - Fix: Split into smaller files

3. **Invalid file format**
   - Only `.xlsx` and `.xls` supported
   - Fix: Save as Excel format

---

### Problem: Data Not Showing in Dashboard

**Check:**
1. Refresh browser (Ctrl + R)
2. Check MongoDB connection:
   ```powershell
   cd backend
   node test-db-connection.js
   ```
3. Verify data in MongoDB:
   - Database: `emaildumper`
   - Collection: `mails`

---

## 📈 Advanced Usage

### Change Sync Frequency

Edit `backend/.env`:
```env
# Every 5 minutes (default)
CRON_SCHEDULE=*/5 * * * *

# Every 10 minutes
CRON_SCHEDULE=*/10 * * * *

# Every hour
CRON_SCHEDULE=0 * * * *

# Every 30 minutes
CRON_SCHEDULE=*/30 * * * *
```

**Restart backend** after changing:
```powershell
# Stop: Ctrl+C
# Start again:
cd backend
npm start
```

---

### Export All Data

**Method 1: Via API**
```powershell
curl http://localhost:5000/api/export > proposals.xlsx
```

**Method 2: From MongoDB**
```powershell
mongodump --db emaildumper --collection mails --out ./backup
```

---

### View Version History

**For a specific proposal:**

1. Go to **Search** page
2. Search for proposal: `PROP001`
3. Click **"View History"**
4. See all changes:

```
Version 1 (Oct 14, 2025 10:30 AM)
  - POLICY STATUS: Pending → Completed
  - Net Premium: 25000 → 28000

Version 2 (Oct 13, 2025 9:15 AM)
  - Initial record created
```

---

## 🔐 Security Best Practices

### 1. Protect Your .env File
```powershell
# Never commit .env to git!
# Already in .gitignore ✅
```

### 2. Use App Passwords
- ❌ Don't use your main email password
- ✅ Generate app-specific passwords
- ✅ Revoke if compromised

### 3. Limit Access
- Use read-only IMAP if possible
- Restrict MongoDB access
- Use HTTPS in production

---

## 📝 Common Workflows

### Workflow 1: Daily Proposal Processing

**Morning:**
1. Open dashboard: http://localhost:3000
2. Check **Total Proposals** count
3. Review **Recent Activity**
4. Click **"Sync Now"** to fetch latest emails

**Throughout Day:**
- Emails auto-sync every 5 minutes
- Dashboard updates automatically
- Notifications for new proposals

**Evening:**
- Export data for reporting
- Review pending proposals
- Check sync logs

---

### Workflow 2: Bulk Upload Historical Data

**Step 1:** Prepare Excel file
- Ensure **PROPOSAL NUMBER** column exists
- Clean data (remove duplicates)
- Save as `.xlsx`

**Step 2:** Upload via UI
1. Go to: http://localhost:3000/upload
2. Upload file
3. Wait for processing
4. Review results:
   - Created: 150
   - Updated: 25
   - Errors: 0

**Step 3:** Verify in Search
- Search for random proposals
- Check data accuracy
- Review version history

---

### Workflow 3: Monitor Email Integration

**Check Email Setup:**
```powershell
cd backend
curl http://localhost:5000/api/sync/test-connection
```

**Manual Sync:**
1. Dashboard → "Sync Now"
2. Watch backend logs
3. Verify new records

**Review Sync History:**
- API: http://localhost:5000/api/sync/history
- Shows all sync operations
- Timestamp + results

---

## 📞 Quick Reference

### URLs
| Page | URL |
|------|-----|
| Dashboard | http://localhost:3000 |
| Upload | http://localhost:3000/upload |
| Search | http://localhost:3000/search |
| Settings | http://localhost:3000/settings |
| Backend API | http://localhost:5000 |

### Commands
```powershell
# Start Backend
cd backend; npm start

# Start Frontend
cd frontend; npm start

# Test DB Connection
cd backend; node test-db-connection.js

# Generate Sample Data
cd backend\sample-data; node generate-sample.js

# Install Dependencies
cd backend; npm install
cd frontend; npm install
```

### File Locations
```
backend/
  ├── .env                    # Configuration
  ├── models/Customer.js      # Database schema
  ├── services/imapService.js # Email fetching
  ├── services/excelService.js# Excel parsing
  └── sample-data/            # Sample Excel files

frontend/
  ├── src/pages/Dashboard.js  # Dashboard page
  ├── src/pages/Upload.js     # Upload page
  └── src/pages/Search.js     # Search page
```

---

## 🎯 Success Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] MongoDB connection successful
- [ ] IMAP connection test passes
- [ ] Sample Excel upload works
- [ ] Search finds uploaded records
- [ ] Dashboard shows statistics
- [ ] Email sync works (send test email)
- [ ] Version history tracks changes

---

## 🆘 Getting Help

### Check Logs

**Backend Logs:**
- Look at terminal running `npm start`
- Check for error messages
- Note any connection failures

**Frontend Console:**
- Open browser DevTools (F12)
- Go to Console tab
- Look for network errors

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend not running - start it |
| `MongooseError` | Check MongoDB connection string |
| `IMAP connection failed` | Verify email credentials |
| `File too large` | Reduce file size (10MB max) |
| `PROPOSAL NUMBER not found` | Add column to Excel |

---

## 🎉 You're Ready!

Your Email Dumper is now fully configured and ready to use!

### Quick Start:
1. ✅ Backend running
2. ✅ Frontend running  
3. ✅ MongoDB connected
4. ✅ IMAP configured

### Test It:
1. Upload `backend\sample-data\sample-customers.xlsx`
2. See 3 proposals appear on dashboard
3. Search for "PROP001"
4. View version history

**Happy Processing! 🚀**

---

*For technical details, see: IMAP_SETUP.md*
*For updates summary, see: IMAP_UPDATE_SUMMARY.md*
