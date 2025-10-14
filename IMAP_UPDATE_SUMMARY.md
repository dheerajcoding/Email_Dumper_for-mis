# ✅ Email Dumper - IMAP Update Complete

## 🎉 What's New

### 1. **IMAP Email Integration** (No Google Cloud Required!)
- Replaced Gmail API with simple IMAP
- Works with ANY email provider
- No OAuth complexity
- Just email + app password

### 2. **Updated Data Model** (40+ Fields)
All your PolicyBazaar fields are now supported:
- PROPOSAL NUMBER (primary key)
- PROPOSER CODE, PROPOSER NAME
- Business Type, SOURCECODE
- POLICY STATUS, SUBSTATUS
- Branch Code, Intermediary CODE
- Net Premium, Gross Premium
- + 30 more fields!

### 3. **New Backend Dependencies**
```json
{
  "imap": "^0.8.19",           // IMAP email client
  "mailparser": "^3.6.5"        // Email parsing
}
```

Removed:
- googleapis (no longer needed)
- nodemailer (not required)

## 📁 Updated Files

### Backend Changes
✅ `package.json` - New IMAP dependencies
✅ `.env.example` - IMAP configuration
✅ `models/Customer.js` - 40+ field schema
✅ `services/imapService.js` - NEW: IMAP email fetcher
✅ `services/excelService.js` - Updated field mappings
✅ `services/databaseService.js` - New field names
✅ `controllers/syncController.js` - IMAP integration
✅ `controllers/customerController.js` - Updated routes
✅ `routes/sync.js` - Removed OAuth routes
✅ `jobs/cronJobs.js` - IMAP sync
✅ `sample-data/generate-sample.js` - New sample data

### Documentation
✅ `IMAP_SETUP.md` - NEW: Complete IMAP guide
✅ `QUICK_START_IMAP.md` - NEW: Quick reference
✅ Updated all references from Gmail API to IMAP

## 🚀 How to Use

### 1. Install New Dependencies
```powershell
cd backend
npm install
```

### 2. Configure .env
```env
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASSWORD=your_app_password
EMAIL_TLS=true
```

### 3. Get App Password
1. https://myaccount.google.com/apppasswords
2. Create password for "Mail"
3. Copy to .env

### 4. Start & Test
```powershell
npm start
```

Test connection:
```
GET http://localhost:5000/api/sync/test-connection
```

## 📊 Sample Data

Generate new sample with 40+ fields:
```powershell
cd backend\sample-data
node generate-sample.js
```

Creates `sample-customers.xlsx` with:
- PROP001 - Rajesh Kumar (Active)
- PROP002 - Priya Sharma (Pending)
- PROP003 - Vikram Singh (Issued)

## 🔍 API Changes

### Updated Endpoints
- `GET /api/customers/:proposalNumber` (was proposalNo)
- Filter by `policyStatus` (was status)
- Search includes intermediaryName

### Removed Endpoints
- `/api/sync/auth-url` (no OAuth needed)
- `/api/sync/oauth-callback` (no OAuth needed)

### New Endpoints
- `/api/sync/test-connection` (test IMAP)

## 📋 Excel Field Mapping

The system recognizes these column names:

| Excel Column | Database Field |
|--------------|----------------|
| PROPOSAL NUMBER | proposalNumber |
| PROPOSER NAME | proposerName |
| POLICY STATUS | policyStatus |
| Net Premium | netPremium |
| Gross Premium | grossPremium |
| (40+ total fields...) |

## 🎯 Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] Update `.env` with IMAP settings
- [ ] Generate app password
- [ ] Test connection endpoint
- [ ] Generate sample Excel
- [ ] Send test email with Excel
- [ ] Trigger manual sync
- [ ] Check dashboard for data
- [ ] Search by PROP001
- [ ] View version history

## 🔐 Security Notes

### Old (Gmail API):
- Required Google Cloud Project
- OAuth2 credentials
- Refresh tokens
- Complex setup

### New (IMAP):
- Just app password
- Stored in .env (not committed)
- Can be revoked anytime
- Simpler & more secure for single-user

## 📞 Support

### Email Not Connecting?
1. Check app password is correct (no spaces)
2. Ensure 2-Step Verification enabled
3. Try generating new app password
4. Check EMAIL_HOST matches your provider

### No Emails Fetched?
1. Email must be **unread**
2. Must have Excel attachment
3. File must be .xlsx or .xls
4. Check INBOX (not spam/other)

### Excel Parsing Issues?
1. Must have "PROPOSAL NUMBER" column
2. Column names are case-insensitive
3. Check sample file for reference

## 🎊 Benefits

### Before (Gmail API):
- ❌ Complex Google Cloud setup
- ❌ OAuth2 configuration
- ❌ Only works with Gmail
- ❌ Refresh token management

### After (IMAP):
- ✅ 5-minute setup
- ✅ Works with any email
- ✅ Corporate email supported
- ✅ Simple app password
- ✅ No API quotas/limits

## 📚 Next Steps

1. **Test thoroughly** with sample data
2. **Customize fields** if needed
3. **Update frontend** to display all fields
4. **Configure real email** account
5. **Set up auto-sync** schedule

---

**All changes complete! IMAP integration ready to use! 🚀**
