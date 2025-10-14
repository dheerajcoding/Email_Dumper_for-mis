# 📋 Email Dumper - Quick Reference Card

## 🎯 What Does It Do?
Automatically extracts customer data from Excel files (from emails or manual upload) and stores in MongoDB.

---

## ⚡ Quick Start (3 Steps)

### 1. Start Backend
```powershell
cd "c:\Users\Anuj kumar\emaildumper\backend"
npm start
```
✅ Should see: "Server running on port 5000"

### 2. Start Frontend
```powershell
cd "c:\Users\Anuj kumar\emaildumper\frontend"
npm start
```
✅ Should see: "Compiled successfully!"

### 3. Open Browser
```
http://localhost:3000
```
✅ Dashboard should load

---

## 🔄 How It Works

```
📧 Email → 📥 IMAP Fetch → 📑 Parse Excel → 💾 MongoDB → 📊 Dashboard
```

**Automatic Mode:**
1. Email arrives with Excel attachment
2. System checks inbox every 5 minutes
3. Extracts data automatically
4. Saves to database
5. Shows on dashboard

**Manual Mode:**
1. Go to Upload page
2. Select Excel file
3. Click Upload
4. Data appears on dashboard

---

## 📊 Main Features

| Feature | What It Does | How to Use |
|---------|--------------|------------|
| **Dashboard** | View statistics & recent proposals | http://localhost:3000 |
| **Upload** | Manually upload Excel files | http://localhost:3000/upload |
| **Search** | Find specific proposals | http://localhost:3000/search |
| **Sync Now** | Fetch emails immediately | Dashboard → "Sync Now" button |
| **History** | Track all changes | Search → "View History" |

---

## 📁 Excel File Requirements

### ✅ Must Have:
- **PROPOSAL NUMBER** column (required, unique)

### ✅ Can Have (40+ optional fields):
- PROPOSER NAME
- POLICY STATUS
- Net Premium
- Gross Premium
- Branch Code
- Intermediary Name
- ... and 35+ more

### ✅ File Format:
- `.xlsx` or `.xls`
- Max size: 10 MB
- Column names: case-insensitive

---

## 🔑 Configuration (.env file)

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/emaildumper

# Email (IMAP)
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_TLS=true

# Settings
PORT=5000
CRON_SCHEDULE=*/5 * * * *  # Every 5 minutes
```

---

## 🚨 Common Issues & Solutions

### ❌ "Connection Refused"
**Problem:** Backend not running  
**Fix:** Run `npm start` in backend folder

### ❌ "IMAP Connection Failed"
**Problem:** Wrong email credentials  
**Fix:** 
1. Use **app password** (not regular password)
2. Generate at: https://myaccount.google.com/apppasswords
3. Update `EMAIL_PASSWORD` in `.env`

### ❌ "PROPOSAL NUMBER not found"
**Problem:** Excel missing required column  
**Fix:** Add "PROPOSAL NUMBER" header to Excel file

### ❌ "No Data in Dashboard"
**Problem:** Upload didn't complete or wrong collection  
**Fix:**
1. Check upload success message
2. Refresh browser
3. Verify backend is running

---

## 📞 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/customers` | GET | All proposals |
| `/api/customers/:proposalNumber` | GET | Specific proposal |
| `/api/upload` | POST | Upload Excel file |
| `/api/sync/refresh` | POST | Manual email sync |
| `/api/sync/test-connection` | GET | Test IMAP connection |
| `/api/export` | GET | Export all data |

---

## 🧪 Quick Test

### Test 1: Upload Sample File
```powershell
# 1. Generate sample data
cd "c:\Users\Anuj kumar\emaildumper\backend\sample-data"
node generate-sample.js

# 2. Go to: http://localhost:3000/upload
# 3. Upload: sample-customers.xlsx
# 4. Should see: "3 created"
```

### Test 2: Search
```
1. Go to: http://localhost:3000/search
2. Enter: PROP001
3. Should find: Rajesh Kumar
```

### Test 3: Email Integration
```
1. Send email to: neerajkumar4@policybazaar.com
2. Attach: sample-customers.xlsx
3. Keep it UNREAD
4. Dashboard → "Sync Now"
5. Should see: 3 new proposals
```

---

## 📂 Project Structure

```
emaildumper/
├── backend/
│   ├── .env                    ← Configuration
│   ├── server.js               ← Main server
│   ├── models/Customer.js      ← Database schema
│   ├── services/
│   │   ├── imapService.js      ← Email fetching
│   │   ├── excelService.js     ← Excel parsing
│   │   └── databaseService.js  ← Database operations
│   └── sample-data/
│       └── sample-customers.xlsx
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.js    ← Main dashboard
    │   │   ├── Upload.js       ← Upload page
    │   │   └── Search.js       ← Search page
    │   └── App.js
    └── package.json
```

---

## 🔧 Useful Commands

```powershell
# Install dependencies
cd backend; npm install
cd frontend; npm install

# Start servers
cd backend; npm start       # Backend
cd frontend; npm start      # Frontend

# Test database
cd backend; node test-db-connection.js

# Generate sample data
cd backend\sample-data; node generate-sample.js

# View logs
# Check terminal running npm start
```

---

## 📝 Sample Data

**File:** `backend\sample-data\sample-customers.xlsx`

**Contains:**
| Proposal | Name | Status | Premium |
|----------|------|--------|---------|
| PROP001 | Rajesh Kumar | Pending | ₹25,000 |
| PROP002 | Priya Sharma | Completed | ₹18,000 |
| PROP003 | Vikram Singh | Pending | ₹32,000 |

---

## 🎯 Typical Workflows

### Daily Morning Routine:
```
1. Open Dashboard
2. Check "Total Proposals"
3. Review "Recent Activity"
4. Click "Sync Now" if needed
```

### Processing New Emails:
```
1. Email arrives → Automatic processing (every 5 min)
2. OR click "Sync Now" for immediate processing
3. Check Dashboard for new entries
4. Search for specific proposals
```

### Manual Data Entry:
```
1. Prepare Excel with PROPOSAL NUMBER column
2. Go to Upload page
3. Upload file
4. Verify results (created/updated counts)
5. Search to confirm data
```

---

## 📊 Database Info

**Database Name:** `emaildumper`  
**Collection:** `mails`  
**Connection:** MongoDB Atlas (cloud)

**Sample Query:**
```javascript
// In MongoDB Compass or CLI
db.mails.find({ proposalNumber: "PROP001" })
db.mails.countDocuments()
db.mails.find({ policyStatus: "Pending" })
```

---

## 🔐 Security Notes

✅ **DO:**
- Use app passwords (not regular passwords)
- Keep `.env` file private
- Use HTTPS in production
- Regular backups

❌ **DON'T:**
- Commit `.env` to git
- Share credentials
- Use default passwords
- Expose MongoDB publicly

---

## 📈 Performance Tips

- **File Size:** Keep Excel files under 10 MB
- **Batch Upload:** Split large files into smaller batches
- **Sync Frequency:** Adjust `CRON_SCHEDULE` as needed
- **Database:** Index on frequently searched fields

---

## 🆘 Support Resources

| Resource | Location |
|----------|----------|
| **Full Guide** | `USER_GUIDE.md` |
| **Testing Guide** | `TESTING_GUIDE.md` |
| **IMAP Setup** | `IMAP_SETUP.md` |
| **Quick Start** | `QUICK_START_IMAP.md` |
| **This Card** | `QUICK_REFERENCE.md` |

---

## ✅ System Status Check

**Is everything working?**

- [ ] Backend running? (port 5000)
- [ ] Frontend running? (port 3000)
- [ ] MongoDB connected?
- [ ] IMAP connection OK?
- [ ] Sample upload works?
- [ ] Dashboard shows data?
- [ ] Search finds proposals?

**All checked? You're ready! 🚀**

---

## 📞 Quick Help

**Backend won't start?**
→ Check MongoDB connection in `.env`

**Frontend shows errors?**
→ Check backend is running on port 5000

**Email sync not working?**
→ Test IMAP: `http://localhost:5000/api/sync/test-connection`

**Upload fails?**
→ Check Excel has "PROPOSAL NUMBER" column

**No data showing?**
→ Refresh browser, check backend logs

---

**Keep this card handy for quick reference! 📋**
