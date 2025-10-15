# 📧 Email Dumper MIS# 📧 Email Dumper MIS - Automated Email & Excel Data Processing# 📧 Email Dumper - Automated Excel Data Extraction from Gmail



Automated email processing system with Excel data extraction and duplicate tracking.



## 🚀 FeaturesA complete MERN stack application that automatically fetches Excel attachments from Gmail via IMAP, extracts customer data, stores it in MongoDB with **complete duplicate tracking**, and displays all versions on a modern dashboard.A complete MERN stack application that automatically fetches Excel attachments from Gmail, extracts customer data, stores it in MongoDB with version tracking, and displays it on a modern dashboard.



- ✅ IMAP Email Integration

- ✅ Auto-sync every 1 hour

- ✅ Excel parsing (43 columns)## 🚀 Key Features## 🚀 Features

- ✅ Duplicate tracking with version history

- ✅ Advanced search (16 fields)

- ✅ MongoDB with optimization

- ✅ React + TailwindCSS UI- ✅ **IMAP Email Integration** - Fetch emails from specific sender (ABHICL.MIS@adityabirlahealth.com)- ✅ **Gmail Integration** - Automatically fetch Excel attachments from Gmail inbox



## 📦 Tech Stack- ✅ **Date Filtering** - Only process emails from October 1, 2025 onwards- ✅ **Excel Processing** - Parse and extract customer data from .xlsx and .xls files



- **Backend**: Node.js, Express, MongoDB, IMAP- ✅ **Excel Processing** - Parse all 43 columns from Excel Sheet2- ✅ **Version History** - Track all changes to customer records over time

- **Frontend**: React, TailwindCSS, Axios

- **Database**: MongoDB Atlas- ✅ **Complete Duplicate Tracking** - Store ALL versions of every lead update- ✅ **Auto Sync** - CRON job runs every 5 minutes to check for new emails



## 🔧 Environment Variables- ✅ **Version History** - See Version 1, 2, 3, 4, 5... for each proposal with timestamps- ✅ **Search & Filter** - Search by Proposal No and view complete history



### Backend (.env)- ✅ **Auto Sync** - CRON job runs every 5 minutes to check for new emails- ✅ **Manual Upload** - Upload Excel files manually for immediate processing

```env

PORT=5000- ✅ **Advanced Search** - Search across 16 fields with detailed modal view- ✅ **Modern Dashboard** - React + TailwindCSS responsive UI

NODE_ENV=production

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname- ✅ **All Data View** - Paginated view of all records (100 per page) with CSV export- ✅ **Export Data** - Export all customer data to Excel

EMAIL_HOST=imap.gmail.com

EMAIL_PORT=993- ✅ **Modern Dashboard** - React + TailwindCSS showing all Excel fields + tracking columns

EMAIL_USER=your_email@gmail.com

EMAIL_PASSWORD=your_app_password## 📁 Project Structure

EMAIL_TLS=true

CORS_ORIGIN=https://your-frontend.onrender.com---

UPLOAD_FOLDER=./uploads

CRON_SCHEDULE=0 * * * *```

```

## 📁 Clean Project Structureemaildumper/

### Frontend (.env)

```env├── backend/

REACT_APP_API_URL=https://your-backend.onrender.com/api

``````│   ├── config/



## 🌐 Deploy on RenderEmail_Dumper_for-mis/│   │   └── database.js



### Backend Deployment:├── backend/                    # Node.js/Express API server│   ├── controllers/



1. **Create Web Service**│   ├── config/│   │   ├── customerController.js

   - Repository: Connect your Git repo

   - Branch: main│   │   └── database.js         # MongoDB connection│   │   └── syncController.js

   - Root Directory: `backend`

   - Environment: Node│   ├── controllers/│   ├── jobs/

   - Build Command: `npm install`

   - Start Command: `npm start`│   │   ├── customerController.js    # Customer CRUD + duplicate analysis│   │   └── cronJobs.js

   

2. **Add Environment Variables**│   │   └── syncController.js        # Email sync orchestration│   ├── models/

   - Add all variables from backend/.env

   - Set `NODE_ENV=production`│   ├── jobs/│   │   ├── Customer.js



### Frontend Deployment:│   │   └── cronJobs.js        # Auto-sync every 5 minutes│   │   └── SyncLog.js



1. **Create Static Site**│   ├── models/│   ├── routes/

   - Repository: Connect your Git repo

   - Branch: main│   │   ├── Customer.js        # Customer schema (43 fields + tracking)│   │   ├── api.js

   - Root Directory: `frontend`

   - Build Command: `npm install && npm run build`│   │   └── SyncLog.js         # Sync history│   │   └── sync.js

   - Publish Directory: `build`

   │   ├── routes/│   ├── services/

2. **Add Environment Variable**

   - `REACT_APP_API_URL` = Your backend URL│   │   ├── api.js             # Customer & dashboard APIs│   │   ├── databaseService.js



## 📝 Local Development│   │   └── sync.js            # Sync trigger APIs│   │   ├── excelService.js



```bash│   ├── services/│   │   └── gmailService.js

# Backend

cd backend│   │   ├── databaseService.js # MongoDB operations (INSERT-ALL mode)│   ├── uploads/

npm install

npm start│   │   ├── excelService.js    # Excel parsing (Sheet2, 43 columns)│   ├── .env.example



# Frontend  │   │   └── imapService.js     # IMAP email fetching (date filter)│   ├── .gitignore

cd frontend

npm install│   ├── uploads/               # Temporary Excel file storage│   ├── package.json

npm start

```│   ├── .env                   # Environment variables (GITIGNORED)│   └── server.js



## 📚 Documentation│   ├── .env.example           # Template for .env├── frontend/



- START_HERE.md - Quick start guide│   ├── package.json│   ├── public/

- TROUBLESHOOTING.md - Common issues

- GMAIL_SETUP.md - IMAP configuration│   └── server.js              # Express app entry point│   │   └── index.html

- PROJECT_OVERVIEW.md - Technical details

││   ├── src/

## 📄 License

├── frontend/                   # React frontend│   │   ├── components/

ISC

│   ├── public/│   │   │   ├── LoadingSpinner.js

│   │   └── index.html│   │   │   ├── Navbar.js

│   ├── src/│   │   │   └── StatCard.js

│   │   ├── components/│   │   ├── pages/

│   │   │   ├── LoadingSpinner.js│   │   │   ├── Dashboard.js

│   │   │   ├── Navbar.js│   │   │   ├── Search.js

│   │   │   └── StatCard.js│   │   │   ├── Settings.js

│   │   ├── pages/│   │   │   └── Upload.js

│   │   │   ├── Dashboard.js   # Main dashboard (3 tracking + 40 Excel columns)│   │   ├── services/

│   │   │   ├── AllData.js     # All records view (pagination, CSV export)│   │   │   └── api.js

│   │   │   ├── Search.js      # Multi-field search with modal│   │   ├── App.js

│   │   │   ├── Settings.js    # Email & IMAP config│   │   ├── index.css

│   │   │   └── Upload.js      # Manual Excel upload│   │   └── index.js

│   │   ├── services/│   ├── .env.example

│   │   │   └── api.js         # Axios API wrapper│   ├── .gitignore

│   │   ├── App.js             # React Router setup│   ├── package.json

│   │   ├── index.css          # TailwindCSS styles│   ├── postcss.config.js

│   │   └── index.js│   └── tailwind.config.js

│   ├── .env                   # Frontend env (GITIGNORED)└── README.md

│   ├── package.json```

│   ├── postcss.config.js

│   └── tailwind.config.js## 🛠️ Tech Stack

│

├── .gitignore                 # Git ignore rules### Backend

├── install.bat                # Windows installer (npm install both)- **Node.js** + **Express.js** - Server framework

├── install.ps1                # PowerShell installer- **MongoDB** + **Mongoose** - Database

├── start.bat                  # Windows starter (both servers)- **Gmail API** (OAuth2) - Email fetching

├── start.ps1                  # PowerShell starter- **XLSX** - Excel file parsing

├── README.md                  # This file- **node-cron** - Scheduled tasks

├── START_HERE.md              # Quick start guide- **Multer** - File uploads

├── USER_GUIDE.md              # User documentation

├── TROUBLESHOOTING.md         # Common issues & fixes### Frontend

└── ALL_5_VERSIONS_CONFIRMED.md # Duplicate tracking explanation- **React** - UI framework

```- **React Router** - Navigation

- **TailwindCSS** - Styling

---- **Axios** - API requests



## 🛠️ Tech Stack## 📋 Prerequisites



### Backend- **Node.js** (v14 or higher)

- **Node.js** v14+ with **Express.js** - RESTful API server- **MongoDB** (local or Atlas)

- **MongoDB** + **Mongoose** - Database with duplicate tracking- **Gmail Account** with API access

- **IMAP** (node-imap) - Email fetching with date filters- **Google Cloud Project** with Gmail API enabled

- **XLSX** - Excel parsing from Sheet2

- **node-cron** - Scheduled sync every 5 minutes## 🔧 Installation

- **fs-extra** - File system operations

### 1. Clone the Repository

### Frontend

- **React** 18+ - UI framework```bash

- **React Router** v6 - SPA navigationcd emaildumper

- **TailwindCSS** - Modern styling```

- **Axios** - HTTP client

### 2. Backend Setup

---

```bash

## 📋 Prerequisitescd backend

npm install

- **Node.js** v14 or higher ([Download](https://nodejs.org))```

- **MongoDB** - Local or Atlas ([Setup Guide](https://www.mongodb.com/docs/manual/installation/))

- **Gmail Account** with IMAP enabledCreate `.env` file from `.env.example`:



---```bash

copy .env.example .env

## ⚡ Quick Start```



### 1️⃣ Install DependenciesEdit `.env` with your configuration:



**Option A: Using Batch File (Windows)**```env

```bashPORT=5000

install.batMONGO_URI=mongodb://localhost:27017/emaildumper

```GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com

GMAIL_CLIENT_SECRET=your_client_secret

**Option B: Manual Installation**GMAIL_REDIRECT_URI=http://localhost:5000/oauth2callback

```bashGMAIL_REFRESH_TOKEN=your_refresh_token

# BackendGMAIL_USER=your-email@gmail.com

cd backendCORS_ORIGIN=http://localhost:3000

npm installCRON_SCHEDULE=*/5 * * * *

```

# Frontend

cd ../frontend### 3. Frontend Setup

npm install

``````bash

cd ../frontend

### 2️⃣ Configure Environmentnpm install

```

**Backend Configuration** (`backend/.env`):

```envCreate `.env` file:

# Server

PORT=5000```bash

NODE_ENV=developmentcopy .env.example .env

```

# MongoDB

MONGO_URI=mongodb://localhost:27017/emaildumperEdit `.env`:



# IMAP Email Configuration```env

IMAP_USER=neerajkumar4@adityabirlahealth.comREACT_APP_API_URL=http://localhost:5000/api

IMAP_PASSWORD=your_app_password_here```

IMAP_HOST=imap.gmail.com

IMAP_PORT=993## 🔐 Gmail API Setup

IMAP_TLS=true

### Step 1: Create Google Cloud Project

# Email Filter (specific sender)

EMAIL_FILTER_FROM=ABHICL.MIS@adityabirlahealth.com1. Go to [Google Cloud Console](https://console.cloud.google.com)

2. Create a new project or select existing one

# Date Filter (YYYY-MM-DD)3. Enable **Gmail API** for your project

EMAIL_DATE_FILTER=2025-10-01

### Step 2: Create OAuth 2.0 Credentials

# Other

UPLOAD_FOLDER=./uploads1. Go to **APIs & Services** → **Credentials**

CORS_ORIGIN=http://localhost:30002. Click **Create Credentials** → **OAuth client ID**

CRON_SCHEDULE=*/5 * * * *3. Choose **Web application**

```4. Add authorized redirect URI:

   ```

**Frontend Configuration** (`frontend/.env`):   http://localhost:5000/oauth2callback

```env   ```

REACT_APP_API_URL=http://localhost:5000/api5. Copy **Client ID** and **Client Secret**

```

### Step 3: Get Refresh Token

### 3️⃣ Enable Gmail IMAP & Get App Password

1. Add Client ID and Secret to backend `.env`

1. Go to [Gmail Settings](https://mail.google.com/mail/u/0/#settings/fwdandpop)2. Start the backend server

2. Click **Forwarding and POP/IMAP**3. Open frontend and go to **Settings**

3. Enable **IMAP access**4. Click **Connect Gmail Account**

4. Go to [Google Account Security](https://myaccount.google.com/security)5. Complete OAuth flow in popup

5. Enable **2-Step Verification** (required)6. Copy the **refresh token** to backend `.env`

6. Go to [App Passwords](https://myaccount.google.com/apppasswords)7. Restart backend server

7. Generate password for "Mail" → "Windows Computer"

8. Copy the 16-character password## 🚀 Running the Application

9. Paste into `IMAP_PASSWORD` in backend `.env`

### Start MongoDB (if using local)

### 4️⃣ Start Application

```bash

**Option A: Using Batch File (Windows)**mongod

```bash```

start.bat

```### Start Backend Server



**Option B: Manual Start**```bash

```bashcd backend

# Terminal 1 - Backendnpm start

cd backend# or for development with auto-reload:

npm startnpm run dev

```

# Terminal 2 - Frontend

cd frontendBackend will run on `http://localhost:5000`

npm start

```### Start Frontend



### 5️⃣ Access Application```bash

cd frontend

- **Frontend**: http://localhost:3000npm start

- **Backend API**: http://localhost:5000```

- **API Docs**: http://localhost:5000/api/dashboard/stats

Frontend will run on `http://localhost:3000`

---

## 📊 Usage

## 📊 How It Works

### 1. Dashboard

### Email Processing Flow- View total customers and statistics

- See recent customer records

```- Last sync information

1. CRON Job (Every 5 min)- Manual sync button

   ↓

2. IMAP Connect → Search unread emails### 2. Search

   ↓ Filter: FROM = ABHICL.MIS@adityabirlahealth.com- Search customers by Proposal No

   ↓ Filter: SINCE = October 1, 2025- View complete customer details

   ↓- See version history with all changes

3. Download Excel attachments- Track how many times data has been updated

   ↓ Save to: backend/uploads/

   ↓### 3. Upload

4. Parse Excel (Sheet2, 43 columns)- Manually upload Excel files

   ↓- Drag & drop or browse files

5. Insert ALL records to MongoDB- Instant processing and results

   ↓ INSERT mode (not UPSERT)- See created/updated/error counts

   ↓ Check existing count for same proposalNumber

   ↓ Set updateCount = existing + 1### 4. Settings

   ↓ Set isDuplicate = true if updateCount > 1- Connect Gmail account

   ↓ Set importedAt = current timestamp- View setup instructions

   ↓- Configure sync schedule

6. Mark email as READ- Environment variable reference

   ↓

7. Delete Excel file## 📄 Excel File Format

   ↓

8. Display on dashboard with Version, Duplicate flag, DateYour Excel file should have these columns (case-insensitive):

```

| Column | Aliases | Required |

### Duplicate Tracking Logic|--------|---------|----------|

| ProposalNo | Proposal No, ID, proposal_no | ✅ Yes |

**If proposal `QE123` comes 5 times:**| CustomerName | Customer Name, Name, client | No |

| Status | status, State | No |

| Insert | proposalNumber | updateCount | isDuplicate | importedAt || Remarks | Comments, Notes, Description | No |

|--------|----------------|-------------|-------------|------------|| Date | date, Created Date, Timestamp | No |

| 1st    | QE123          | 1           | false       | Oct 1, 9 AM |

| 2nd    | QE123          | 2           | true        | Oct 2, 9 AM |**Example:**

| 3rd    | QE123          | 3           | true        | Oct 3, 9 AM |

| 4th    | QE123          | 4           | true        | Oct 5, 9 AM || ProposalNo | CustomerName | Status | Remarks | Date |

| 5th    | QE123          | 5           | true        | Oct 8, 9 AM ||------------|--------------|--------|---------|------|

| P001 | John Doe | Active | Initial proposal | 2025-01-15 |

**Result**: Database has 5 separate records, all visible on dashboard!| P002 | Jane Smith | Pending | Awaiting approval | 2025-01-20 |



---## 🔄 How It Works



## 📱 Dashboard Pages### Automatic Sync (CRON)

1. CRON job runs every 5 minutes

### 🏠 Dashboard2. Checks Gmail for unread emails with Excel attachments

- **Stats Cards**: Total Customers, Today's Syncs, Last Sync Time3. Downloads attachments to `backend/uploads/`

- **Recent Data Table**: 4. Parses Excel files and extracts data

  - **First 3 columns**: Version | Duplicate? | Imported At5. Creates new records or updates existing ones

  - **Next 40 columns**: All Excel fields (Proposal No, Name, Status, etc.)6. Saves old data to version history

  - **Sticky header** with dark theme7. Marks emails as read

  - **Color-coded badges**: ✨ New (green) | 🔄 Duplicate (orange)8. Deletes processed files

  - Shows last 50 records

### Version History

### 📋 All Data- When a record is updated, the old data is saved in the `history` array

- **Complete view** of all records with pagination- Each history entry includes:

- **100 records per page**  - Previous values for all fields

- **CSV Export** button (exports current page)  - Timestamp of the change

- **Same tracking columns**: Row | Version | Duplicate? | Imported At- You can view the complete change log for any customer

- **All 40 Excel fields**

- **Navigation**: First, Previous, Page X of Y, Next, Last## 📡 API Endpoints



### 🔍 Search### Customer APIs

- **Multi-field search** across 16 fields:- `GET /api/customers` - Get all customers (with pagination)

  - Proposal Number, Proposer Name, Policy Status, Sub Status- `GET /api/customers/:proposalNo` - Get single customer with history

  - Product Name, Business Type, Branch, City, State- `POST /api/upload` - Upload Excel file manually

  - Email, Mobile, Gender, Created Date, etc.- `GET /api/dashboard/stats` - Get dashboard statistics

- **Detailed Modal** shows all 43 fields when clicking a row- `GET /api/export` - Export all customers to Excel

- **Live search** - updates as you type- `GET /api/sync/history` - Get sync history logs



### ⚙️ Settings### Sync APIs

- **Email Configuration**: View IMAP settings- `POST /api/sync/refresh` - Trigger manual Gmail sync

- **Sync Configuration**: CRON schedule- `GET /api/sync/auth-url` - Get Gmail OAuth URL

- **Environment Info**: Node version, MongoDB status- `GET /api/sync/oauth-callback?code=...` - Handle OAuth callback

- **Setup Instructions**: IMAP setup guide

## 🐛 Troubleshooting

### 📤 Upload

- **Drag & Drop** or browse Excel files### MongoDB Connection Error

- **Instant processing**- Ensure MongoDB is running

- **Results**: Shows created, updated, errors- Check `MONGO_URI` in `.env`

- **Supports**: .xlsx, .xls formats- For Atlas, ensure IP is whitelisted



---### Gmail Authentication Error

- Verify Client ID and Secret are correct

## 📄 Excel File Format (Sheet2)- Check redirect URI matches exactly

- Ensure Gmail API is enabled

Your Excel file must have **Sheet2** with these **43 columns**:- Generate new refresh token if expired



| # | Column Name | Example |### Excel Parsing Error

|---|-------------|---------|- Ensure file is .xlsx or .xls format

| 1 | proposalNumber | QE0663275702510 |- Check that ProposalNo column exists

| 2 | proposerName | Deepak Jain |- Verify column names match expected format

| 3 | policyStatus | DRAFT |

| 4 | subStatus | PENDING KYC |### CORS Error

| 5 | productName | ACTIV HEALTH ESSENTIAL |- Check `CORS_ORIGIN` in backend `.env`

| 6 | planName | Essential Plan |- Ensure frontend URL is correct

| 7 | businessType | NEW |- Restart backend after changing `.env`

| 8 | branch | Delhi |

| 9 | city | New Delhi |## 🔒 Security Notes

| 10 | state | Delhi |

| 11-43 | (34 more fields) | ... |- Never commit `.env` files to git

- Keep OAuth credentials secure

**See USER_GUIDE.md for complete field list**- Use environment variables for all secrets

- Regularly rotate refresh tokens

---- Consider using HTTPS in production



## 🔧 API Endpoints## 📦 Production Deployment



### Customer APIs### Backend

```1. Set `NODE_ENV=production`

GET    /api/customers              # Get all customers (paginated)2. Use process manager (PM2)

GET    /api/customers/:id          # Get single customer3. Enable HTTPS

POST   /api/upload                 # Upload Excel file4. Use MongoDB Atlas

GET    /api/dashboard/stats        # Dashboard statistics5. Set secure CORS origins

GET    /api/dashboard/duplicates   # Duplicate analysis

```### Frontend

1. Run `npm run build`

### Sync APIs2. Serve build folder with nginx/Apache

```3. Update API URL to production backend

POST   /api/sync/refresh           # Manual sync trigger4. Enable HTTPS

GET    /api/sync/history           # Sync logs

```## 📝 Sample Data



---A sample Excel file is available in the repository for testing:

- Location: `backend/sample-data/sample-customers.xlsx`

## 🐛 Troubleshooting- Contains 5 sample customer records

- Can be uploaded via the Upload page

### Backend won't start

```bash## 🤝 Contributing

# Check if MongoDB is running

mongo --versionContributions are welcome! Please feel free to submit a Pull Request.



# Check .env file exists## 📄 License

ls backend/.env

ISC License

# Clear node_modules and reinstall

cd backend## 👨‍💻 Author

rm -rf node_modules

npm installCreated as a complete MERN application for automated email and Excel data processing.

```

## 🆘 Support

### Frontend won't start

```bashFor issues or questions:

# Clear cache and reinstall1. Check the troubleshooting section

cd frontend2. Review environment variable configuration

rm -rf node_modules3. Check browser console for frontend errors

npm install4. Check backend server logs for API errors

```

---

### IMAP authentication failed

- ✅ Check IMAP is enabled in Gmail settings**Happy Coding! 🚀**

- ✅ Use App Password, not regular password
- ✅ Verify email and password in `.env`
- ✅ Check firewall allows port 993

### No emails being synced
- ✅ Check emails are from: ABHICL.MIS@adityabirlahealth.com
- ✅ Check emails are dated after: October 1, 2025
- ✅ Check emails are UNREAD
- ✅ Check emails have Excel attachments

### Excel parsing errors
- ✅ Ensure file is .xlsx or .xls
- ✅ Ensure data is in **Sheet2** (not Sheet1)
- ✅ Ensure proposalNumber column exists

**See TROUBLESHOOTING.md for more solutions**

---

## 🚀 Production Deployment

### Backend (Render/Heroku/DigitalOcean)
```bash
# Set environment variables
NODE_ENV=production
MONGO_URI=mongodb+srv://...atlas...
CORS_ORIGIN=https://your-frontend.com

# Start with PM2
npm install -g pm2
pm2 start server.js --name email-dumper
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Set env variable
REACT_APP_API_URL=https://your-backend.com/api

# Deploy
vercel deploy
```

---

## 📚 Documentation

- **START_HERE.md** - Quick setup walkthrough
- **USER_GUIDE.md** - Complete user manual
- **TROUBLESHOOTING.md** - Common issues and fixes
- **ALL_5_VERSIONS_CONFIRMED.md** - Duplicate tracking explanation
- **GMAIL_SETUP.md** - IMAP setup guide
- **IMAP_SETUP.md** - Detailed IMAP configuration

---

## 🔒 Security

- ✅ Never commit `.env` files
- ✅ Use App Passwords, not regular passwords
- ✅ Keep MongoDB credentials secure
- ✅ Use HTTPS in production
- ✅ Whitelist IP addresses for MongoDB Atlas
- ✅ Set secure CORS origins

---

## 📝 License

ISC License - Free to use and modify

---

## 👨‍💻 Support

For issues or questions:
1. Check **TROUBLESHOOTING.md**
2. Review **USER_GUIDE.md**
3. Check browser console for frontend errors
4. Check terminal logs for backend errors

---

## 🎯 Current Status

✅ **Production Ready**
- All features implemented and tested
- IMAP email fetching working
- Date filtering from Oct 1, 2025
- Complete duplicate tracking with versions
- Dashboard shows all 43 Excel columns
- Search across 16 fields
- CSV export working
- Auto-sync every 5 minutes

**Database**: 4,252+ customers (growing with duplicates)

---

**Built with ❤️ for MIS Department**

🚀 **Happy Data Processing!**
