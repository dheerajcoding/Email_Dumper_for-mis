# 📧 Email Dumper - Quick Start with IMAP

## 🎯 What Changed

**NEW: IMAP Email Integration** - No Google Cloud setup needed!

- ✅ Works with ANY email (Gmail, Outlook, Corporate)
- ✅ Simple email + app password configuration
- ✅ Perfect for neerajkumar4@policybazaar.com
- ✅ No OAuth, no API keys, no complexity

## 🚀 3-Step Quick Start

### 1. Install Dependencies
```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure Email
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emaildumper

# IMAP Email Settings
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_TLS=true
```

**Get App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Copy and paste above

### 3. Start Application
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

Open: **http://localhost:3000**

## 📊 New Data Fields

Your Excel files should have these columns:

**Primary Key:**
- PROPOSAL NUMBER (required)

**Main Fields:**
- PROPOSER CODE
- PROPOSER NAME
- Business Type
- POLICY STATUS
- SUBSTATUS
- CREATED DATE
- Policy Issue date
- Intermediary NAME
- Branch Code
- Net Premium
- Gross Premium
- (and 30+ more fields...)

See sample Excel for complete list!

## 📧 Testing Email Sync

1. Generate sample data:
```powershell
cd backend\sample-data
node generate-sample.js
```

2. Email `sample-customers.xlsx` to your configured email

3. Click **Sync Now** on dashboard OR wait 5 minutes

4. Check for new proposals!

## 📚 Documentation

- **IMAP_SETUP.md** - Detailed email configuration guide
- **README.md** - Full technical documentation  
- **QUICKSTART.md** - Complete setup instructions

## 🔍 Search by Proposal Number

- Go to **Search** page
- Enter: `PROP001`
- View complete details + version history

## 🎉 That's It!

You now have automatic Excel data extraction from email with complete version tracking!

**Questions?** Check IMAP_SETUP.md for troubleshooting.
