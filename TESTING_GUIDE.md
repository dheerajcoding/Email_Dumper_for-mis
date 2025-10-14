# 🧪 Email Dumper - Testing Guide

## Quick Start Test (5 Minutes)

Follow these steps to verify your installation works correctly.

---

## ✅ Test 1: Backend Server

**What to test:** Backend starts and connects to MongoDB

**Steps:**
```powershell
cd "c:\Users\Anuj kumar\emaildumper\backend"
npm start
```

**Expected Output:**
```
IMAP client initialized
Connecting to MongoDB...
MongoDB connected successfully
Database: emaildumper
Starting cron job with schedule: */5 * * * *
Cron jobs started successfully

===========================================
Server running on port 5000
Environment: development
API: http://localhost:5000
===========================================
```

**✅ Pass Criteria:**
- No error messages
- "MongoDB connected successfully"
- "Server running on port 5000"

**❌ If Failed:**
- Check MongoDB connection string in `.env`
- Verify MongoDB is running (local) or accessible (Atlas)
- Check firewall settings

---

## ✅ Test 2: Frontend Server

**What to test:** Frontend starts and loads

**Steps:**
```powershell
cd "c:\Users\Anuj kumar\emaildumper\frontend"
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view emaildumper-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.x.x.x:3000

webpack compiled successfully
```

**✅ Pass Criteria:**
- "Compiled successfully!"
- Browser opens automatically
- Dashboard page loads

**❌ If Failed:**
- Run `npm install` in frontend folder
- Check port 3000 is not in use
- Clear browser cache

---

## ✅ Test 3: Database Connection

**What to test:** MongoDB connection and collection setup

**Steps:**
```powershell
cd "c:\Users\Anuj kumar\emaildumper\backend"
node test-db-connection.js
```

**Expected Output:**
```
Connecting to MongoDB...
✅ Connected successfully!
Database: emaildumper
Collection name: mails
Current documents in collection: 0

Available collections:
  - synclogs
  - mails

✅ Test completed successfully!
```

**✅ Pass Criteria:**
- Connected successfully
- Database is "emaildumper"
- Collection is "mails"
- No errors

**❌ If Failed:**
- Check `MONGO_URI` in `.env`
- Test MongoDB connection separately
- Verify credentials

---

## ✅ Test 4: IMAP Email Connection

**What to test:** Email server connection via IMAP

**Steps:**

**Method 1 - API Test:**
```powershell
curl http://localhost:5000/api/sync/test-connection
```

**Method 2 - Browser:**
Open: http://localhost:5000/api/sync/test-connection

**Expected Output:**
```json
{
  "success": true,
  "message": "Email connection successful"
}
```

**✅ Pass Criteria:**
- `"success": true`
- No error messages

**❌ If Failed:**
- Verify app password in `.env` (not regular password)
- Check `EMAIL_HOST` is correct (`imap.gmail.com`)
- Ensure `EMAIL_PORT` is `993`
- Confirm `EMAIL_TLS` is `true`
- Check if IMAP is enabled in email account

---

## ✅ Test 5: Sample Data Upload

**What to test:** Excel file processing and database storage

**Steps:**

1. **Open Browser:** http://localhost:3000/upload

2. **Upload File:**
   - Click "Browse Files"
   - Select: `backend\sample-data\sample-customers.xlsx`
   - Click "Upload & Process"

**Expected Output (on screen):**
```
✅ File processed successfully

Total Records: 3
Created: 3
Updated: 0
Unchanged: 0
Errors: 0
```

**✅ Pass Criteria:**
- "File processed successfully"
- Created: 3
- No errors

**❌ If Failed:**
- Check file exists: `backend\sample-data\sample-customers.xlsx`
- If missing, generate it:
  ```powershell
  cd "c:\Users\Anuj kumar\emaildumper\backend\sample-data"
  node generate-sample.js
  ```
- Check backend logs for errors

---

## ✅ Test 6: Dashboard Statistics

**What to test:** Dashboard displays uploaded data

**Steps:**

1. **Open Dashboard:** http://localhost:3000

2. **Check Statistics:**
   - Total Proposals
   - Pending count
   - Completed count
   - Recent Activity list

**Expected Output:**
```
📊 Dashboard

Total Proposals: 3
Pending: 1
Completed: 2

Recent Activity:
- PROP001 - Rajesh Kumar
- PROP002 - Priya Sharma
- PROP003 - Vikram Singh
```

**✅ Pass Criteria:**
- Total shows 3
- Recent activity shows 3 proposals
- No "0" or empty state

**❌ If Failed:**
- Refresh browser (Ctrl + R)
- Check if upload succeeded (Test 5)
- Verify backend is running
- Check browser console for errors (F12)

---

## ✅ Test 7: Search Functionality

**What to test:** Search finds uploaded proposals

**Steps:**

1. **Open Search:** http://localhost:3000/search

2. **Search by Proposal Number:**
   - Enter: `PROP001`
   - Click "Search"

3. **Verify Results:**
   - Should show 1 result
   - Proposal Number: PROP001
   - Proposer Name: Rajesh Kumar

**Expected Output:**
```
Search Results (1 found)

PROP001 | Rajesh Kumar | Pending | ₹25,000
[View Details] [View History]
```

**✅ Pass Criteria:**
- Search returns 1 result
- Correct proposal details shown
- "View History" button appears

**❌ If Failed:**
- Check if data was uploaded (Test 5)
- Try searching for "Rajesh" or "Kumar"
- Check backend logs
- Verify search API endpoint

---

## ✅ Test 8: Version History

**What to test:** History tracking works

**Steps:**

1. **Search for PROP001** (from Test 7)

2. **Click "View History"** button

3. **Check History:**
   - Should show initial creation
   - Timestamp
   - Field values

**Expected Output:**
```
Version History for PROP001

Version 1 - Oct 14, 2025 2:30 PM
  Initial record created
  
  Fields:
  - Proposal Number: PROP001
  - Proposer Name: Rajesh Kumar
  - Policy Status: Pending
  - Net Premium: 25000
```

**✅ Pass Criteria:**
- At least 1 version shown
- Creation timestamp visible
- Field values displayed

**❌ If Failed:**
- History might be empty for new records
- Upload same file again to create version 2
- Check Customer model for `history` field

---

## ✅ Test 9: Manual Email Sync

**What to test:** Trigger email sync manually

**Steps:**

1. **Open Dashboard:** http://localhost:3000

2. **Click "Sync Now"** button

3. **Wait for completion** (3-10 seconds)

**Expected Output:**
```
✅ Sync completed successfully

Emails processed: 0
Records created: 0
Records updated: 0
```

**✅ Pass Criteria:**
- Sync completes without errors
- Message shows "completed successfully"
- Even 0 results is OK (no new emails)

**❌ If Failed:**
- Check IMAP connection (Test 4)
- Verify backend is running
- Check backend logs for errors
- Ensure you have unread emails with Excel attachments

---

## ✅ Test 10: Real Email Integration (Optional)

**What to test:** End-to-end email processing

**Prerequisites:**
- Valid email credentials in `.env`
- IMAP connection working (Test 4)

**Steps:**

1. **Prepare Email:**
   - Attach: `backend\sample-data\sample-customers.xlsx`
   - Send to: `neerajkumar4@policybazaar.com`
   - **Important:** Keep it UNREAD

2. **Trigger Sync:**
   - Dashboard → "Sync Now"
   - OR wait 5 minutes (auto-sync)

3. **Check Results:**
   - Dashboard should show new proposals
   - Email should be marked as READ
   - Check MongoDB for new data

**Expected Output:**
```
✅ Sync completed successfully

Emails processed: 1
Records created: 3
Records updated: 0
```

**✅ Pass Criteria:**
- Email processed successfully
- 3 new proposals in dashboard
- Email marked as read
- Data in MongoDB

**❌ If Failed:**
- Email must be UNREAD
- Email must be in INBOX (not spam/trash)
- Must have Excel attachment
- Check IMAP credentials
- Check backend logs for detailed errors

---

## 🎯 Full Test Checklist

Run all tests in order:

- [ ] ✅ Test 1: Backend Server
- [ ] ✅ Test 2: Frontend Server
- [ ] ✅ Test 3: Database Connection
- [ ] ✅ Test 4: IMAP Email Connection
- [ ] ✅ Test 5: Sample Data Upload
- [ ] ✅ Test 6: Dashboard Statistics
- [ ] ✅ Test 7: Search Functionality
- [ ] ✅ Test 8: Version History
- [ ] ✅ Test 9: Manual Email Sync
- [ ] ✅ Test 10: Real Email Integration

**All tests passed? 🎉 Your Email Dumper is fully functional!**

---

## 🐛 Debugging Tips

### Check Backend Logs
```powershell
# Look at terminal running backend
# Check for errors, warnings, connection issues
```

### Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Console tab → look for errors
// Network tab → check API calls
```

### Check MongoDB Data
```powershell
# Use MongoDB Compass or CLI
mongosh "mongodb+srv://neerajkumar4:neeraj123@dumper.7mm3hgn.mongodb.net/emaildumper"

# Query mails collection
db.mails.find().pretty()
db.mails.countDocuments()
```

### Test API Endpoints Directly
```powershell
# Dashboard stats
curl http://localhost:5000/api/dashboard/stats

# All customers
curl http://localhost:5000/api/customers

# Specific proposal
curl http://localhost:5000/api/customers/PROP001

# Sync history
curl http://localhost:5000/api/sync/history
```

---

## 📊 Performance Benchmarks

### Expected Response Times

| Operation | Expected Time |
|-----------|---------------|
| Dashboard load | < 2 seconds |
| Upload 100 records | < 5 seconds |
| Search by proposal | < 1 second |
| Email sync (1 email) | 3-10 seconds |
| Database query | < 500ms |

### Typical Data Volumes

| Metric | Expected |
|--------|----------|
| Excel file size | < 10 MB |
| Records per file | 1-1000 |
| Total proposals | Unlimited |
| Concurrent users | 1-10 |
| IMAP emails/sync | 1-50 |

---

## 🔍 Common Test Failures

### "Cannot connect to backend"
**Cause:** Backend server not running
**Fix:** Run `npm start` in backend folder

### "MongoDB connection failed"
**Cause:** Wrong connection string or MongoDB down
**Fix:** Check `MONGO_URI` in `.env`

### "IMAP connection failed"
**Cause:** Wrong credentials or IMAP disabled
**Fix:** 
1. Generate new app password
2. Check `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_TLS`
3. Verify IMAP enabled in email settings

### "File upload failed"
**Cause:** Missing PROPOSAL NUMBER column or wrong format
**Fix:**
1. Check Excel has "PROPOSAL NUMBER" header
2. Ensure file is .xlsx or .xls
3. Check file size < 10MB

### "No data in dashboard"
**Cause:** Upload didn't complete or wrong collection
**Fix:**
1. Check upload results message
2. Verify collection name is "mails"
3. Query MongoDB directly

---

## ✅ Success Indicators

Your system is working correctly when:

1. **Backend starts** without errors
2. **Frontend loads** and shows UI
3. **MongoDB connects** to "emaildumper" database
4. **IMAP connects** to email server
5. **Upload works** and creates records
6. **Dashboard shows** statistics
7. **Search finds** proposals
8. **History tracks** changes
9. **Manual sync** completes
10. **Auto-sync** runs every 5 minutes

---

## 🎓 Next Steps

After all tests pass:

1. **Upload Real Data:**
   - Use your actual PolicyBazaar Excel files
   - Verify all 40+ fields are captured

2. **Configure Email:**
   - Set up real email monitoring
   - Test with actual emails

3. **Customize Settings:**
   - Adjust sync frequency
   - Set up filters
   - Configure notifications

4. **Monitor Performance:**
   - Check sync logs
   - Monitor database growth
   - Review error rates

**Happy Testing! 🚀**
