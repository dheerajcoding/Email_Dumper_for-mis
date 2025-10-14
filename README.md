# 📧 Email Dumper - Automated Excel Data Extraction from Gmail

A complete MERN stack application that automatically fetches Excel attachments from Gmail, extracts customer data, stores it in MongoDB with version tracking, and displays it on a modern dashboard.

## 🚀 Features

- ✅ **Gmail Integration** - Automatically fetch Excel attachments from Gmail inbox
- ✅ **Excel Processing** - Parse and extract customer data from .xlsx and .xls files
- ✅ **Version History** - Track all changes to customer records over time
- ✅ **Auto Sync** - CRON job runs every 5 minutes to check for new emails
- ✅ **Search & Filter** - Search by Proposal No and view complete history
- ✅ **Manual Upload** - Upload Excel files manually for immediate processing
- ✅ **Modern Dashboard** - React + TailwindCSS responsive UI
- ✅ **Export Data** - Export all customer data to Excel

## 📁 Project Structure

```
emaildumper/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── customerController.js
│   │   └── syncController.js
│   ├── jobs/
│   │   └── cronJobs.js
│   ├── models/
│   │   ├── Customer.js
│   │   └── SyncLog.js
│   ├── routes/
│   │   ├── api.js
│   │   └── sync.js
│   ├── services/
│   │   ├── databaseService.js
│   │   ├── excelService.js
│   │   └── gmailService.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── StatCard.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Search.js
│   │   │   ├── Settings.js
│   │   │   └── Upload.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Gmail API** (OAuth2) - Email fetching
- **XLSX** - Excel file parsing
- **node-cron** - Scheduled tasks
- **Multer** - File uploads

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - API requests

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **Gmail Account** with API access
- **Google Cloud Project** with Gmail API enabled

## 🔧 Installation

### 1. Clone the Repository

```bash
cd emaildumper
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```bash
copy .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/emaildumper
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:5000/oauth2callback
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your-email@gmail.com
CORS_ORIGIN=http://localhost:3000
CRON_SCHEDULE=*/5 * * * *
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:

```bash
copy .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Gmail API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Gmail API** for your project

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URI:
   ```
   http://localhost:5000/oauth2callback
   ```
5. Copy **Client ID** and **Client Secret**

### Step 3: Get Refresh Token

1. Add Client ID and Secret to backend `.env`
2. Start the backend server
3. Open frontend and go to **Settings**
4. Click **Connect Gmail Account**
5. Complete OAuth flow in popup
6. Copy the **refresh token** to backend `.env`
7. Restart backend server

## 🚀 Running the Application

### Start MongoDB (if using local)

```bash
mongod
```

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Usage

### 1. Dashboard
- View total customers and statistics
- See recent customer records
- Last sync information
- Manual sync button

### 2. Search
- Search customers by Proposal No
- View complete customer details
- See version history with all changes
- Track how many times data has been updated

### 3. Upload
- Manually upload Excel files
- Drag & drop or browse files
- Instant processing and results
- See created/updated/error counts

### 4. Settings
- Connect Gmail account
- View setup instructions
- Configure sync schedule
- Environment variable reference

## 📄 Excel File Format

Your Excel file should have these columns (case-insensitive):

| Column | Aliases | Required |
|--------|---------|----------|
| ProposalNo | Proposal No, ID, proposal_no | ✅ Yes |
| CustomerName | Customer Name, Name, client | No |
| Status | status, State | No |
| Remarks | Comments, Notes, Description | No |
| Date | date, Created Date, Timestamp | No |

**Example:**

| ProposalNo | CustomerName | Status | Remarks | Date |
|------------|--------------|--------|---------|------|
| P001 | John Doe | Active | Initial proposal | 2025-01-15 |
| P002 | Jane Smith | Pending | Awaiting approval | 2025-01-20 |

## 🔄 How It Works

### Automatic Sync (CRON)
1. CRON job runs every 5 minutes
2. Checks Gmail for unread emails with Excel attachments
3. Downloads attachments to `backend/uploads/`
4. Parses Excel files and extracts data
5. Creates new records or updates existing ones
6. Saves old data to version history
7. Marks emails as read
8. Deletes processed files

### Version History
- When a record is updated, the old data is saved in the `history` array
- Each history entry includes:
  - Previous values for all fields
  - Timestamp of the change
- You can view the complete change log for any customer

## 📡 API Endpoints

### Customer APIs
- `GET /api/customers` - Get all customers (with pagination)
- `GET /api/customers/:proposalNo` - Get single customer with history
- `POST /api/upload` - Upload Excel file manually
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/export` - Export all customers to Excel
- `GET /api/sync/history` - Get sync history logs

### Sync APIs
- `POST /api/sync/refresh` - Trigger manual Gmail sync
- `GET /api/sync/auth-url` - Get Gmail OAuth URL
- `GET /api/sync/oauth-callback?code=...` - Handle OAuth callback

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas, ensure IP is whitelisted

### Gmail Authentication Error
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly
- Ensure Gmail API is enabled
- Generate new refresh token if expired

### Excel Parsing Error
- Ensure file is .xlsx or .xls format
- Check that ProposalNo column exists
- Verify column names match expected format

### CORS Error
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL is correct
- Restart backend after changing `.env`

## 🔒 Security Notes

- Never commit `.env` files to git
- Keep OAuth credentials secure
- Use environment variables for all secrets
- Regularly rotate refresh tokens
- Consider using HTTPS in production

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use process manager (PM2)
3. Enable HTTPS
4. Use MongoDB Atlas
5. Set secure CORS origins

### Frontend
1. Run `npm run build`
2. Serve build folder with nginx/Apache
3. Update API URL to production backend
4. Enable HTTPS

## 📝 Sample Data

A sample Excel file is available in the repository for testing:
- Location: `backend/sample-data/sample-customers.xlsx`
- Contains 5 sample customer records
- Can be uploaded via the Upload page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License

## 👨‍💻 Author

Created as a complete MERN application for automated email and Excel data processing.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variable configuration
3. Check browser console for frontend errors
4. Check backend server logs for API errors

---

**Happy Coding! 🚀**
