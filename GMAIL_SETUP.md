# 🎯 Gmail API Setup - Complete Guide

This guide will help you set up Gmail API access for the Email Dumper application.

## 📋 Prerequisites

- Google account
- 10 minutes of your time

## Step-by-Step Instructions

### 1. Create Google Cloud Project

1. **Visit Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown (top left)
   - Click **"New Project"**
   - Project name: `Email Dumper`
   - Click **"Create"**
   - Wait for project creation (15-30 seconds)

3. **Select Your Project**
   - Make sure "Email Dumper" is selected in the project dropdown

### 2. Enable Gmail API

1. **Open API Library**
   - Click hamburger menu (☰) → **APIs & Services** → **Library**
   
2. **Search and Enable Gmail API**
   - Search for: `Gmail API`
   - Click on **Gmail API** in results
   - Click **"Enable"** button
   - Wait for activation

### 3. Configure OAuth Consent Screen

1. **Open OAuth Consent**
   - Go to: **APIs & Services** → **OAuth consent screen**

2. **Choose User Type**
   - Select: **External**
   - Click **"Create"**

3. **Fill App Information**
   - App name: `Email Dumper`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**

4. **Scopes** (Step 2)
   - Click **"Save and Continue"** (no changes needed)

5. **Test Users** (Step 3)
   - Click **"Add Users"**
   - Add your Gmail address
   - Click **"Save and Continue"**

6. **Summary**
   - Review and click **"Back to Dashboard"**

### 4. Create OAuth 2.0 Credentials

1. **Open Credentials**
   - Go to: **APIs & Services** → **Credentials**

2. **Create Credentials**
   - Click **"+ Create Credentials"** (top)
   - Select **"OAuth client ID"**

3. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: `Email Dumper Web Client`
   
4. **Add Redirect URI**
   - Under **"Authorized redirect URIs"**
   - Click **"+ Add URI"**
   - Enter: `http://localhost:5000/oauth2callback`
   - Click **"Create"**

5. **Save Credentials**
   - A popup will show your credentials
   - **IMPORTANT:** Copy these values:
     - Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
     - Client Secret (random string)
   - Click **"OK"**

### 5. Add Credentials to Backend

1. **Open backend .env file**
   ```powershell
   cd backend
   notepad .env
   ```

2. **Add these lines:**
   ```env
   GMAIL_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
   GMAIL_CLIENT_SECRET=paste_your_client_secret_here
   GMAIL_REDIRECT_URI=http://localhost:5000/oauth2callback
   GMAIL_USER=your-email@gmail.com
   ```

3. **Save the file** (Ctrl+S)

4. **Restart backend server**
   ```powershell
   # Press Ctrl+C to stop
   npm start
   ```

### 6. Get Refresh Token

1. **Open Application**
   - Frontend: http://localhost:3000
   - Make sure backend is running

2. **Go to Settings Page**
   - Click **Settings** in navbar

3. **Connect Gmail**
   - Click **"Connect Gmail Account"** button
   - A popup will open with Google login

4. **Authorize App**
   - Choose your Google account
   - You may see "Google hasn't verified this app" warning
   - Click **"Advanced"** → **"Go to Email Dumper (unsafe)"**
   - This is safe - it's your own app!
   - Click **"Allow"** to grant permissions

5. **Copy Refresh Token**
   - After authorization, you'll see the refresh token
   - Copy the entire token

6. **Add to .env**
   ```powershell
   cd backend
   notepad .env
   ```
   
   Add this line:
   ```env
   GMAIL_REFRESH_TOKEN=paste_your_refresh_token_here
   ```

7. **Final Restart**
   - Restart backend one more time
   ```powershell
   # Press Ctrl+C
   npm start
   ```

### 7. Test Gmail Integration

1. **Prepare Test Email**
   - Create or use `sample-customers.xlsx`
   - Send email to your Gmail address
   - **Important:** Attach the Excel file

2. **Wait and Sync**
   - Option A: Wait 5 minutes for auto-sync
   - Option B: Click **"Sync Now"** on Dashboard

3. **Check Results**
   - Go to Dashboard
   - See "Last Sync" section
   - Check if customers were imported

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Gmail API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID added to .env
- [ ] Client Secret added to .env
- [ ] Refresh token obtained
- [ ] Refresh token added to .env
- [ ] Backend restarted
- [ ] Test email sent
- [ ] Sync successful

## 🔍 What Each Setting Does

### Client ID
- Identifies your application to Google
- Public identifier
- Format: `xxxxx-xxxxx.apps.googleusercontent.com`

### Client Secret
- Secret key for your application
- Keep it private!
- Random alphanumeric string

### Redirect URI
- Where Google sends users after authentication
- Must match exactly: `http://localhost:5000/oauth2callback`

### Refresh Token
- Long-lived token for accessing Gmail
- Allows app to read emails without repeated login
- Never expires unless revoked

## 🐛 Troubleshooting

### "Redirect URI Mismatch" Error
**Problem:** URI doesn't match
**Solution:** 
- Check spelling: `http://localhost:5000/oauth2callback`
- No trailing slash
- Exact port number (5000)

### "Access Blocked: App Not Verified"
**Problem:** Google warning about unverified app
**Solution:**
- Click "Advanced" → "Go to Email Dumper (unsafe)"
- This is normal for personal apps
- You're authorizing your own application

### "Invalid Client" Error
**Problem:** Wrong Client ID or Secret
**Solution:**
- Re-copy from Google Cloud Console
- Check for extra spaces
- Verify .env file saved

### Token Not Working After Some Time
**Problem:** Refresh token expired or revoked
**Solution:**
- Go to Settings page
- Reconnect Gmail account
- Get new refresh token

### No Emails Being Fetched
**Problem:** Emails not being detected
**Solution:**
- Check email is unread
- Verify Excel file is attached
- File must be .xlsx or .xls
- Check backend logs for errors

## 🔐 Security Best Practices

1. **Never share your Client Secret**
2. **Never commit .env to git** (already in .gitignore)
3. **Use test Gmail account** for development
4. **Revoke access** when not needed:
   - Go to: https://myaccount.google.com/permissions
   - Remove "Email Dumper" if needed

## 📚 Additional Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com)

## 🎉 Success!

Once you see "Sync completed" with processed emails, your Gmail integration is working perfectly!

You can now:
- ✅ Receive Excel files via email
- ✅ Auto-process them every 5 minutes
- ✅ Track all customer data changes
- ✅ Never miss an update!

---

**Questions?** Check the main README.md or backend server logs for more details.
