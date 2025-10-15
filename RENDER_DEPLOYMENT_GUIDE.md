# 🚀 Render Deployment Guide

Complete guide to deploy Email Dumper MIS on Render.

---

## 📋 Pre-Deployment Checklist

### ✅ Required Accounts:
- [x] GitHub account
- [x] Render account (https://render.com)
- [x] MongoDB Atlas account (https://cloud.mongodb.com)
- [x] Gmail account with App Password

### ✅ Required Information:
- [x] MongoDB connection string
- [x] Gmail email address
- [x] Gmail app password
- [x] GitHub repository URL

---

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Cluster

1. Go to https://cloud.mongodb.com
2. Create free M0 cluster (512MB)
3. Choose region (Singapore recommended)
4. Wait for cluster creation (~3 minutes)

### 1.2 Create Database User

1. **Security** → **Database Access**
2. **Add New Database User**
   - Username: `emaildumper`
   - Password: Generate secure password (save it!)
   - Privileges: Read and write to any database

### 1.3 Whitelist Render IPs

1. **Security** → **Network Access**
2. **Add IP Address**
3. **Allow Access from Anywhere**: `0.0.0.0/0`
   - (Render uses dynamic IPs, so this is required)

### 1.4 Get Connection String

1. **Deployment** → **Database** → **Connect**
2. Choose **Connect your application**
3. Driver: **Node.js**
4. Copy connection string:
   ```
   mongodb+srv://emaildumper:<password>@cluster.mongodb.net/emaildumper
   ```
5. Replace `<password>` with your database password
6. **Save this string!**

---

## 🐙 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
cd "c:\Users\int0003\desktop\new folder\Email_Dumper_for-mis"
git init
git add .
git commit -m "Initial commit - Email Dumper MIS"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com
2. Click **New repository**
3. Name: `email-dumper-mis`
4. Visibility: Private (recommended)
5. **Do NOT** initialize with README
6. Create repository

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/email-dumper-mis.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy Backend on Render

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. **If prompted**: Authorize Render to access repository

### 3.2 Configure Backend Service

**Basic Settings:**
- **Name**: `emaildumper-backend`
- **Region**: Singapore (or closest to you)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- **Plan**: Free (or Starter if you need more)

### 3.3 Add Environment Variables

Click **Advanced** → **Environment Variables** → **Add Environment Variable**

Add each of these:

```env
NODE_ENV = production
PORT = 5000
MONGO_URI = mongodb+srv://emaildumper:YOUR_PASSWORD@cluster.mongodb.net/emaildumper
EMAIL_HOST = imap.gmail.com
EMAIL_PORT = 993
EMAIL_USER = neerajkumar4@policybazaar.com
EMAIL_PASSWORD = qfrydpwiewurwxed
EMAIL_TLS = true
CORS_ORIGIN = https://emaildumper-frontend.onrender.com
UPLOAD_FOLDER = ./uploads
CRON_SCHEDULE = 0 * * * *
```

⚠️ **Important**: 
- Replace `YOUR_PASSWORD` in MONGO_URI with your MongoDB password
- `CORS_ORIGIN` will be updated after frontend is deployed

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (~5 minutes)
3. You'll see logs in real-time
4. **Copy your backend URL**: `https://emaildumper-backend.onrender.com`

### 3.5 Verify Backend

Visit: `https://emaildumper-backend.onrender.com/api/dashboard/stats`

Should see JSON response:
```json
{
  "success": true,
  "data": {
    "totalCustomers": 0,
    ...
  }
}
```

✅ Backend is running!

---

## 🎨 Step 4: Deploy Frontend on Render

### 4.1 Create Static Site

1. Go to https://dashboard.render.com
2. Click **New** → **Static Site**
3. Select same GitHub repository

### 4.2 Configure Frontend Service

**Basic Settings:**
- **Name**: `emaildumper-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 4.3 Add Environment Variable

Click **Advanced** → **Environment Variables**

```env
REACT_APP_API_URL = https://emaildumper-backend.onrender.com/api
```

⚠️ **Replace with YOUR backend URL from Step 3.4**

### 4.4 Deploy

1. Click **Create Static Site**
2. Wait for build (~3-5 minutes)
3. **Copy your frontend URL**: `https://emaildumper-frontend.onrender.com`

---

## 🔄 Step 5: Update CORS Origin

### 5.1 Update Backend Environment Variable

1. Go to backend service in Render dashboard
2. **Environment** tab
3. Find `CORS_ORIGIN`
4. Update value: `https://emaildumper-frontend.onrender.com`
5. Click **Save Changes**
6. Service will automatically redeploy

### 5.2 Verify

1. Visit your frontend URL
2. Should see Email Dumper MIS dashboard
3. Try clicking "Sync Now"
4. Check if data loads

✅ Deployment Complete!

---

## 🧪 Step 6: Testing

### Test Backend:
```bash
# Health check
curl https://emaildumper-backend.onrender.com/api/dashboard/stats

# Test sync (from frontend or Postman)
POST https://emaildumper-backend.onrender.com/api/sync/refresh
```

### Test Frontend:
1. Open: `https://emaildumper-frontend.onrender.com`
2. Navigate through all pages:
   - ✅ Dashboard
   - ✅ All Data
   - ✅ Search
   - ✅ Upload
   - ✅ Settings
3. Click **"🔄 Sync Now"**
4. Verify data appears

---

## ⚙️ Step 7: Configure Auto-Deploy (Optional)

### Enable Auto-Deploy from GitHub

**Backend:**
1. Render Dashboard → Backend Service
2. **Settings** → **Build & Deploy**
3. **Auto-Deploy**: `Yes`
4. Now every push to `main` branch auto-deploys

**Frontend:**
1. Render Dashboard → Frontend Service
2. **Settings** → **Build & Deploy**
3. **Auto-Deploy**: `Yes`

---

## 📊 Step 8: Monitor & Manage

### View Logs:
- **Backend**: Render Dashboard → Backend Service → **Logs**
- **Frontend**: Render Dashboard → Frontend Service → **Logs**

### Check Health:
- **Backend**: Should show "Server running on port 5000"
- **Frontend**: Should show "Compiled successfully"

### CRON Jobs:
- Auto-sync runs every hour at :00
- Check logs at top of hour to verify

---

## 🐛 Troubleshooting

### Backend Not Starting:

**Check:**
1. ✅ All environment variables set?
2. ✅ MongoDB connection string correct?
3. ✅ MongoDB IP whitelist has 0.0.0.0/0?

**View Logs:**
- Render Dashboard → Service → Logs
- Look for error messages

### Frontend Can't Connect to Backend:

**Check:**
1. ✅ `REACT_APP_API_URL` correct?
2. ✅ `CORS_ORIGIN` on backend matches frontend URL?
3. ✅ Backend is running (visit API URL)?

**Fix:**
- Update environment variables
- Redeploy both services

### IMAP Connection Fails:

**Check:**
1. ✅ Gmail App Password correct?
2. ✅ IMAP enabled in Gmail?
3. ✅ Email credentials in environment variables?

**Test:**
- Try manual sync from frontend
- Check backend logs for IMAP errors

### MongoDB Connection Fails:

**Check:**
1. ✅ Connection string format correct?
2. ✅ Password doesn't have special characters (encode them)?
3. ✅ Network access allows all IPs?

**Fix:**
- Test connection string locally first
- Use MongoDB Compass to verify

---

## 💰 Cost Estimate

### Free Tier (Render):
- ✅ **Backend**: Free (512 MB RAM, sleeps after 15 min inactivity)
- ✅ **Frontend**: Free (100 GB bandwidth/month)
- ✅ **MongoDB**: Free M0 (512 MB storage)

**Total: $0/month**

### Starter Tier (Recommended for production):
- 💰 **Backend**: $7/month (always on, 512 MB RAM)
- ✅ **Frontend**: Free
- 💰 **MongoDB M10**: $9/month (2 GB storage, backups)

**Total: $16/month**

---

## 🔒 Security Best Practices

### 1. Environment Variables:
- ✅ Never commit .env files
- ✅ Use different passwords for dev/prod
- ✅ Rotate Gmail App Password regularly

### 2. MongoDB:
- ✅ Use strong database password
- ✅ Enable 2FA on MongoDB Atlas account
- ✅ Regular backups (M10+ tier)

### 3. Render:
- ✅ Enable 2FA on Render account
- ✅ Use GitHub deploy keys
- ✅ Monitor logs regularly

---

## 📝 Post-Deployment Checklist

- [ ] Backend accessible via URL
- [ ] Frontend loads without errors
- [ ] Can login/view dashboard
- [ ] Sync button works
- [ ] Data displays correctly
- [ ] Search works
- [ ] Upload works
- [ ] Auto-sync runs every hour
- [ ] MongoDB connected
- [ ] IMAP fetches emails
- [ ] No console errors
- [ ] Logs show no errors

---

## 🎉 Success!

Your Email Dumper MIS is now live at:

- **Frontend**: https://emaildumper-frontend.onrender.com
- **Backend**: https://emaildumper-backend.onrender.com
- **API**: https://emaildumper-backend.onrender.com/api

**Next Steps:**
1. Bookmark your frontend URL
2. Test all features
3. Share URL with team
4. Monitor logs for first few days
5. Consider upgrading to paid tier for production

---

## 📞 Support

**Issues?**
- Check TROUBLESHOOTING.md
- Review deployment logs
- Verify environment variables

**Need Help?**
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- GitHub Issues: Create issue in your repo

---

**Congratulations on deploying your application!** 🚀
