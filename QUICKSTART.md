# Email Dumper - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB: `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Use connection string in `.env`

### 3. Configure Backend

```powershell
cd backend
copy .env.example .env
notepad .env
```

**Minimum configuration to start:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emaildumper
CORS_ORIGIN=http://localhost:3000
```

### 4. Configure Frontend

```powershell
cd frontend
copy .env.example .env
notepad .env
```

**Configuration:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

### 6. Test with Sample Data

1. Open http://localhost:3000
2. Go to **Upload** page
3. Generate sample data:
   ```powershell
   cd backend/sample-data
   node generate-sample.js
   ```
4. Upload `sample-customers.xlsx` through the UI
5. Check the **Dashboard** to see imported data

## 📧 Gmail Setup (Optional - For Auto-Sync)

### Step 1: Google Cloud Console

1. Visit https://console.cloud.google.com
2. Create new project: "Email Dumper"
3. Enable Gmail API:
   - Go to **APIs & Services** → **Library**
   - Search "Gmail API"
   - Click **Enable**

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen (if needed):
   - User Type: External
   - App name: Email Dumper
   - Add your email
4. Create OAuth client:
   - Application type: **Web application**
   - Name: Email Dumper OAuth
   - Authorized redirect URIs:
     ```
     http://localhost:5000/oauth2callback
     ```
5. Copy **Client ID** and **Client Secret**

### Step 3: Add Credentials to Backend

Edit `backend/.env`:
```env
GMAIL_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REDIRECT_URI=http://localhost:5000/oauth2callback
GMAIL_USER=your-email@gmail.com
```

### Step 4: Get Refresh Token

1. Restart backend server
2. Open frontend: http://localhost:3000
3. Go to **Settings** page
4. Click **Connect Gmail Account**
5. Complete OAuth flow in popup
6. Copy the refresh token shown
7. Add to `backend/.env`:
   ```env
   GMAIL_REFRESH_TOKEN=your_refresh_token_here
   ```
8. Restart backend server

### Step 5: Test Email Sync

1. Send test email to your Gmail account
2. Attach an Excel file with customer data
3. Wait 5 minutes for auto-sync OR
4. Click **Sync Now** on Dashboard

## 📊 Testing the Complete Workflow

### Test 1: Manual Upload
1. Open http://localhost:3000/upload
2. Upload `sample-customers.xlsx`
3. See results: 8 created

### Test 2: Search
1. Go to **Search** page
2. Search for "P001"
3. View customer details

### Test 3: Update Test
1. Edit `sample-customers.xlsx`
2. Change John Doe's status to "Completed"
3. Upload again
4. Search "P001"
5. Click **View History**
6. See the version history!

### Test 4: Email Sync (if Gmail configured)
1. Create Excel file with new customer
2. Email it to your configured Gmail
3. Click **Sync Now** on Dashboard
4. Check if customer appears

## 🔧 Troubleshooting

### MongoDB Connection Failed
```powershell
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### Port Already in Use
```powershell
# Backend (if 5000 is busy)
# Edit backend/.env: PORT=5001

# Frontend (if 3000 is busy)
# Will auto-suggest port 3001
```

### Gmail Auth Not Working
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly: `http://localhost:5000/oauth2callback`
- Try incognito window for OAuth flow

### Excel Upload Fails
- Ensure file has "ProposalNo" column
- Check file size (max 10MB)
- Verify file format (.xlsx or .xls)

## 📱 Features Overview

| Feature | Page | Description |
|---------|------|-------------|
| Dashboard | / | View stats, recent records, sync status |
| Search | /search | Find customer by Proposal No, view history |
| Upload | /upload | Manually upload Excel files |
| Settings | /settings | Configure Gmail integration |

## 🎯 Next Steps

1. ✅ Basic setup complete
2. ✅ Test with sample data
3. ⏳ Configure Gmail (optional)
4. ⏳ Add your real Excel data
5. ⏳ Customize for your needs

## 📝 Excel Column Names

The app recognizes these column variations:

- **ProposalNo**: ProposalNo, Proposal No, ID, proposal_no
- **CustomerName**: CustomerName, Customer Name, Name, client
- **Status**: Status, status, State
- **Remarks**: Remarks, Comments, Notes, Description
- **Date**: Date, date, Created Date, Timestamp

## 🎉 You're All Set!

Your Email Dumper application is now running!

- Dashboard: http://localhost:3000
- Backend API: http://localhost:5000

**Need help?** Check the main README.md for detailed documentation.
