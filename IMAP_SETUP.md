# 📧 IMAP Email Setup Guide

## ✅ Why IMAP is Better for You

- **No Google Cloud Setup Required** - No OAuth, no API credentials
- **Works with ANY Email** - Gmail, Outlook, Yahoo, Corporate emails
- **Simple Configuration** - Just email + password
- **Corporate Email Supported** - Perfect for neerajkumar4@policybazaar.com

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Email Settings

For **Google Workspace** (policybazaar.com):
```
Host: imap.gmail.com
Port: 993
TLS: Yes
```

For **Gmail** (gmail.com):
```
Host: imap.gmail.com
Port: 993
TLS: Yes
```

For **Outlook/Office365**:
```
Host: outlook.office365.com
Port: 993
TLS: Yes
```

For **Yahoo Mail**:
```
Host: imap.mail.yahoo.com
Port: 993
TLS: Yes
```

### Step 2: Generate App Password

#### For Google Workspace / Gmail:

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select app: **Mail**
7. Select device: **Other (Custom name)**
8. Name it: "Email Dumper"
9. Click **Generate**
10. **Copy the 16-character password** (Example: `abcd efgh ijkl mnop`)

#### For Outlook/Office365:

1. Go to: https://account.microsoft.com/security
2. Click **Advanced security options**
3. Under **App passwords**, click **Create a new app password**
4. Copy the generated password

### Step 3: Configure Backend

Edit `backend/.env`:

```env
# Email Configuration (IMAP)
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_TLS=true
```

**Important:**
- Use the **app password**, not your regular email password
- Remove spaces from app password (if any)
- Keep quotes if password has special characters

### Step 4: Test Connection

Start the backend:
```powershell
cd backend
npm start
```

Test the email connection:
```
Open: http://localhost:5000/api/sync/test-connection
```

You should see:
```json
{
  "success": true,
  "message": "Email connection successful"
}
```

## 📨 How It Works

1. **IMAP connects to your email server** (imap.gmail.com)
2. **Searches for unread emails**
3. **Downloads Excel attachments** (.xlsx, .xls)
4. **Saves files to uploads folder**
5. **Parses Excel data**
6. **Stores in MongoDB**
7. **Marks emails as read**
8. **Repeats every 5 minutes**

## 🎯 Testing

### Send Test Email

1. **Create an Excel file** with your data
2. **Email it** to neerajkumar4@policybazaar.com
3. **Keep it unread** (important!)
4. **Wait for sync** (auto every 5 min) OR click "Sync Now"
5. **Check dashboard** for new data

### Excel File Requirements

Must have column: **PROPOSAL NUMBER** (primary key)

Other columns (optional):
- PROPOSER CODE
- PROPOSER NAME
- POLICY STATUS
- Business Type
- (all other fields from your list)

## 🔧 Troubleshooting

### "Authentication failed"
- **Check app password** is correct
- Remove spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- Generate new app password
- Make sure 2-Step Verification is enabled

### "Connection timeout"
- **Check EMAIL_HOST** is correct
- For Google Workspace: use `imap.gmail.com`
- Check internet connection
- Firewall may be blocking port 993

### "No emails found"
- **Email must be unread**
- **Must have Excel attachment** (.xlsx or .xls)
- Check email is in INBOX (not spam/other folders)

### "App password not available"
- Enable **2-Step Verification** first
- May take a few minutes to appear
- Use Google Account settings, not Gmail settings

## 📋 Configuration Examples

### Example 1: Google Workspace Email
```env
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=neerajkumar4@policybazaar.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_TLS=true
```

### Example 2: Personal Gmail
```env
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=yourapppassword
EMAIL_TLS=true
```

### Example 3: Outlook/Office365
```env
EMAIL_HOST=outlook.office365.com
EMAIL_PORT=993
EMAIL_USER=yourname@company.com
EMAIL_PASSWORD=yourapppassword
EMAIL_TLS=true
```

## 🔐 Security Best Practices

1. **Use App Password** - Never use your main email password
2. **Store in .env** - Never commit passwords to git
3. **Limit Access** - Only use for this application
4. **Revoke When Done** - Delete app password when not needed
5. **Monitor Activity** - Check email for suspicious login alerts

## 🎉 You're Ready!

Once configured:
- ✅ Automatic email checking every 5 minutes
- ✅ Excel files processed automatically
- ✅ Data stored with version history
- ✅ No manual work required!

## 📞 Need Help?

**Common Issues:**
1. App password not working → Generate new one
2. Can't find App passwords → Enable 2-Step Verification
3. Connection fails → Check EMAIL_HOST and port
4. No emails fetched → Ensure emails are unread

**Check Logs:**
```powershell
# Backend console shows all activity:
# - Connection status
# - Emails found
# - Files downloaded
# - Processing results
```

---

**That's it! Much simpler than Gmail API setup! 🎊**
