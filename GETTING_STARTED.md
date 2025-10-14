# 🎯 Email Dumper - Getting Started Guide

## ✅ What You Have Now

A complete MERN application with:
- ✅ **Backend** - Node.js + Express + MongoDB (59 files)
- ✅ **Frontend** - React + TailwindCSS (15 files)
- ✅ **Gmail Integration** - OAuth2 + automatic email fetching
- ✅ **Excel Processing** - Parse and extract customer data
- ✅ **Version History** - Track all data changes
- ✅ **Auto Sync** - CRON job every 5 minutes
- ✅ **Documentation** - Complete setup guides

## 🚀 Quick Start (3 Steps)

### Step 1: Install Everything
```powershell
# Run the installation script (recommended)
.\install.ps1

# OR install manually
cd backend
npm install
cd ../frontend
npm install
```

### Step 2: Configure
```powershell
# Edit backend configuration
notepad backend\.env
```

**Minimum required settings:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emaildumper
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start Servers
```powershell
# Option A: Automated (opens 2 windows)
.\start.ps1

# Option B: Manual (2 separate terminals)
# Terminal 1:
cd backend
npm start

# Terminal 2:
cd frontend
npm start
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📊 Test with Sample Data

### Generate Sample Excel File
```powershell
cd backend\sample-data
node generate-sample.js
```

This creates `sample-customers.xlsx` with 8 customer records.

### Upload Sample Data
1. Open http://localhost:3000
2. Click **Upload** in navbar
3. Drag & drop `sample-customers.xlsx`
4. See results: "8 created"

### Search for a Customer
1. Click **Search**
2. Enter: `P001`
3. View customer details

### Update and See History
1. Edit `sample-customers.xlsx`
2. Change John Doe's status to "Completed"
3. Upload again
4. Search for `P001`
5. Click **View History**
6. See the version history! 🎉

## 📧 Gmail Setup (Optional)

For automatic email fetching, follow these guides:

1. **Quick Setup**: See `GMAIL_SETUP.md`
2. **Requirements**:
   - Google Cloud Project
   - Gmail API enabled
   - OAuth credentials
   - Refresh token

3. **Configuration**:
   ```env
   GMAIL_CLIENT_ID=your_id.apps.googleusercontent.com
   GMAIL_CLIENT_SECRET=your_secret
   GMAIL_REFRESH_TOKEN=your_token
   GMAIL_USER=your-email@gmail.com
   ```

## 📁 Project Structure

```
emaildumper/
├── backend/          # Node.js API server
├── frontend/         # React dashboard
├── README.md         # Full documentation
├── QUICKSTART.md     # Quick setup guide
├── GMAIL_SETUP.md    # Gmail API setup
├── PROJECT_OVERVIEW.md  # Technical details
├── install.ps1/.bat  # Installation scripts
└── start.ps1/.bat    # Startup scripts
```

## 🎨 Features Overview

### Dashboard
- Total customer statistics
- Status breakdown
- Recent records
- Last sync info
- Manual sync button

### Search
- Search by Proposal No
- View full details
- Complete version history
- Track all changes

### Upload
- Manual Excel upload
- Drag & drop support
- Real-time processing
- Detailed results

### Settings
- Gmail connection
- Setup instructions
- Environment reference
- CRON schedule info

## 🔧 Customization

### Change Fields
Edit these files:
1. `backend/models/Customer.js` - Database schema
2. `backend/services/excelService.js` - Excel column mapping
3. Frontend components - Display logic

### Change Sync Schedule
Edit `backend/.env`:
```env
CRON_SCHEDULE=*/5 * * * *   # Every 5 minutes (default)
CRON_SCHEDULE=*/10 * * * *  # Every 10 minutes
CRON_SCHEDULE=0 * * * *     # Every hour
```

### Add New Status Types
The app automatically handles any status values from Excel:
- Active
- Pending
- Completed
- Cancelled
- (Any custom status)

## 🐛 Troubleshooting

### "MongoDB connection failed"
```powershell
# Install MongoDB
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGO_URI in backend/.env
```

### "Port 5000 already in use"
```env
# Edit backend/.env
PORT=5001
```

### "Excel upload fails"
- Ensure file has "ProposalNo" column
- Check file is .xlsx or .xls
- Verify file size < 10MB

### "No data appearing"
- Check MongoDB is running
- Verify backend started successfully
- Check browser console for errors

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Complete documentation | Detailed reference |
| **QUICKSTART.md** | Quick setup guide | First time setup |
| **GMAIL_SETUP.md** | Gmail API configuration | Email automation |
| **PROJECT_OVERVIEW.md** | Technical architecture | Understanding internals |
| **GETTING_STARTED.md** | This file | Start here! |

## 🎯 What to Do Next

### For Testing
1. ✅ Install dependencies (`.\install.ps1`)
2. ✅ Start servers (`.\start.ps1`)
3. ✅ Upload sample data
4. ✅ Test search and history

### For Development
1. ✅ Configure Gmail API
2. ✅ Test email sync
3. ✅ Customize fields
4. ✅ Add your Excel format

### For Production
1. ⏳ Deploy MongoDB to Atlas
2. ⏳ Deploy backend to Heroku/AWS
3. ⏳ Deploy frontend to Vercel/Netlify
4. ⏳ Configure production URLs

## 💡 Pro Tips

### Run Both Servers at Once
```powershell
# Use the start script
.\start.ps1
```

### Generate Fresh Sample Data
```powershell
cd backend\sample-data
node generate-sample.js
```

### View Backend Logs
All sync activities are logged to console:
- Email fetching
- Excel processing
- Database updates
- Errors

### Export All Data
1. Go to Dashboard
2. Backend provides export endpoint
3. Or use MongoDB Compass to export

### Search Tips
- Search is case-sensitive for Proposal No
- Use exact Proposal No for best results
- History shows all previous versions

## ✨ Key Features Explained

### Version History
Every time you update a customer:
1. Old data → saved to history array
2. New data → becomes current
3. Timestamp → recorded
4. You can see all past states!

### Auto Sync
Every 5 minutes:
1. Check Gmail for unread emails
2. Download Excel attachments
3. Process customer data
4. Update database
5. Mark emails as read
6. Clean up files

### Smart Excel Parsing
Recognizes different column names:
- ProposalNo / Proposal No / ID
- CustomerName / Customer Name / Name
- Status / status / State
- Etc.

## 🎊 Success!

You now have a fully functional application!

**What works right now:**
- ✅ Upload Excel files
- ✅ Store in MongoDB
- ✅ Search customers
- ✅ View version history
- ✅ Dashboard statistics
- ✅ Export data

**With Gmail setup:**
- ✅ Automatic email fetching
- ✅ CRON job every 5 minutes
- ✅ Auto-process attachments
- ✅ Hands-free operation

## 🆘 Need Help?

1. **Check the documentation**:
   - README.md for details
   - QUICKSTART.md for setup
   - GMAIL_SETUP.md for Gmail

2. **Check logs**:
   - Backend console for API errors
   - Browser console for frontend errors
   - MongoDB logs for database issues

3. **Common solutions**:
   - Restart servers
   - Check .env configuration
   - Verify MongoDB is running
   - Clear browser cache

## 🎓 Learn More

- MongoDB: https://docs.mongodb.com
- Express: https://expressjs.com
- React: https://react.dev
- Gmail API: https://developers.google.com/gmail/api

---

**Ready to start?** Run `.\install.ps1` and then `.\start.ps1`!

**Happy coding! 🚀**
