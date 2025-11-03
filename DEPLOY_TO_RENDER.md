# Complete Render Deployment Guide - Energy Saving Teen App

**This is the definitive guide for deploying the Energy Saving Teen App to Render with ALL specific details.**

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Option 1: Blueprint Deployment (Easiest - Recommended)](#option-1-blueprint-deployment-easiest---recommended)
5. [Option 2: Manual Deployment (Step-by-Step)](#option-2-manual-deployment-step-by-step)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Cost & Scaling](#cost--scaling)

---

## Overview

### What This App Is
- **Full-stack React application** with:
  - Frontend: React 18 + Vite 5 + Tailwind CSS
  - Backend: Node.js + Express API
  - Database: PostgreSQL
  - Authentication: JWT-based user accounts

### Architecture
```
┌─────────────────────────────┐
│   Frontend (Static Site)    │  React + Vite
│   https://your-app.onrender  │  Deployed from /
└──────────┬──────────────────┘
           │ HTTPS API Calls
           ▼
┌─────────────────────────────┐
│   Backend API (Web Service) │  Node.js + Express
│   https://your-api.onrender  │  Deployed from /backend
└──────────┬──────────────────┘
           │ PostgreSQL Connection
           ▼
┌─────────────────────────────┐
│   PostgreSQL Database       │  Managed Database
│   Internal on Render        │  1GB Free Tier
└─────────────────────────────┘
```

### Branches
- **main**: Development/stable branch (frontend-only in older versions)
- **1.4**: Full-stack with backend (USE THIS FOR FULL DEPLOYMENT)

---

## Prerequisites

Before you start, ensure you have:

✅ **GitHub Account** with access to `gang1103app/figmafigmaboi`  
✅ **Render Account** (free tier available at [render.com](https://render.com))  
✅ **Code pushed** to GitHub on branch `1.4` (for full-stack) or `main` (for frontend-only)

### Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (recommended for easy integration)
4. Authorize Render to access your repositories

---

## Deployment Options

### Choose Your Deployment Path

| Option | Complexity | Time | Best For |
|--------|-----------|------|----------|
| **Blueprint Deploy** | Easy | 10 min | First-time deployment, automated setup |
| **Manual Deploy** | Medium | 20-30 min | Learning purposes, custom configuration |

Both options deploy the same full-stack application with database.

---

## Option 1: Blueprint Deployment (Easiest - Recommended)

Blueprint deployment uses the `render.yaml` file to automatically create all services.

### Step 1: Start Blueprint Deploy

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button (top right)
3. Select **"Blueprint"**

### Step 2: Connect Repository

1. Click **"Connect GitHub"** (if not already connected)
2. Find and select: **`gang1103app/figmafigmaboi`**
3. Click **"Connect"**

### Step 3: Configure Blueprint

1. **Select Branch**: Choose **`1.4`** (critical - this has the backend)
2. **Blueprint Name**: `energy-teen-app` (or your choice)
3. Render will detect `render.yaml` automatically

### Step 4: Review Services

Render will create 3 services:

| Service | Type | Name | Purpose |
|---------|------|------|---------|
| Database | PostgreSQL | `energy-teen-db` | Stores user data |
| Backend | Web Service | `energy-teen-api` | API server |
| Frontend | Static Site | `energy-teen-app` | User interface |

### Step 5: Set Environment Variables

**CRITICAL**: You must set these manually after initial deployment:

#### Backend Service (`energy-teen-api`)
Most variables are auto-configured, but verify:
- ✅ `DATABASE_URL` - Auto-linked from database
- ✅ `JWT_SECRET` - Auto-generated
- ✅ `NODE_ENV=production` - Pre-set
- ✅ `PORT=10000` - Pre-set
- ⚠️ `FRONTEND_URL` - **SET MANUALLY** after frontend deploys

#### Frontend Service (`energy-teen-app`)
- ⚠️ `VITE_API_URL` - **SET MANUALLY** after backend deploys

### Step 6: Deploy

1. Click **"Apply"** or **"Create Blueprint"**
2. Render will:
   - Create PostgreSQL database (2-3 min)
   - Deploy backend API (3-5 min)
   - Deploy frontend (2-3 min)
3. Total time: **~10 minutes**

### Step 7: Complete Configuration (CRITICAL)

After all services are deployed:

#### A. Get Your Service URLs

1. Go to your Render Dashboard
2. Note your service URLs:
   - Backend: `https://energy-teen-api-XXXX.onrender.com`
   - Frontend: `https://energy-teen-app-XXXX.onrender.com`

#### B. Update Backend Environment Variables

1. Go to **Backend Service** (`energy-teen-api`)
2. Click **"Environment"** tab
3. Add/Update:
   ```
   FRONTEND_URL=https://energy-teen-app-XXXX.onrender.com
   ```
   (Replace with YOUR actual frontend URL, NO trailing slash)
4. Click **"Save Changes"** - Backend will auto-redeploy

#### C. Update Frontend Environment Variables

1. Go to **Frontend Static Site** (`energy-teen-app`)
2. Click **"Environment"** tab
3. Add:
   ```
   VITE_API_URL=https://energy-teen-api-XXXX.onrender.com/api
   ```
   (Replace with YOUR actual backend URL, MUST include `/api`)
4. Click **"Save Changes"**
5. Trigger **Manual Deploy** (required for static sites)

#### D. Verify Database Migration

**Good news!** The database migration runs automatically when the backend starts. You just need to verify it completed successfully:

1. Go to **Backend Service** (`energy-teen-api`)
2. Click **"Logs"** tab (left sidebar)
3. Look for migration success messages:
   ```
   🔄 Running database migrations on startup...
   ✅ Users table created
   ✅ User progress table created
   ✅ Challenges table created
   ✅ Database migration completed successfully!
   ```

**If migration didn't run automatically**, you can trigger it manually:

**Option 1: Via API (No shell access needed)**
```bash
curl -X POST https://your-backend-api.onrender.com/api/migrate
```
Replace with your actual backend URL. You should get a success response.

**Option 2: Via Shell (If you have access)**
1. Click **"Shell"** tab (left sidebar)
2. Run:
   ```bash
   npm run db:migrate
   ```

### Step 8: Verify Deployment

See [Verification](#verification) section below.

**✅ Blueprint Deployment Complete!** Skip to [Post-Deployment Configuration](#post-deployment-configuration).

---

## Option 2: Manual Deployment (Step-by-Step)

Deploy each service manually for more control.

### Part 1: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `energy-teen-db`
   - **Database**: `energyteen` (auto-created)
   - **User**: `energyteen` (auto-created)
   - **Region**: Choose closest to your users (e.g., `Oregon`)
   - **PostgreSQL Version**: `16` (or latest)
   - **Plan**: `Free` (1GB storage, sufficient for demo)
3. Click **"Create Database"**
4. Wait 2-3 minutes for provisioning
5. Once ready, click on the database
6. **Copy the Internal Database URL** (format: `postgresql://user:pass@host/db`)
   - Find it under **"Connections"** → **"Internal Database URL"**
   - ⚠️ Use INTERNAL, not External

### Part 2: Deploy Backend API

1. From Dashboard, click **"New +"** → **"Web Service"**
2. Connect GitHub repository (if not already):
   - Click **"Connect GitHub"**
   - Authorize Render
   - Find `gang1103app/figmafigmaboi`
3. Click **"Connect"**
4. Configure Web Service:

   | Setting | Value | Notes |
   |---------|-------|-------|
   | **Name** | `energy-teen-api` | Your choice |
   | **Region** | `Oregon` (or same as DB) | Match DB region |
   | **Branch** | `1.4` | ⚠️ Critical - has backend |
   | **Root Directory** | `backend` | Path to backend code |
   | **Environment** | `Node` | Auto-detected |
   | **Build Command** | `npm install` | Default is fine |
   | **Start Command** | `npm start` | Runs `node src/server.js` |
   | **Plan** | `Free` | Or paid for production |

5. **Add Environment Variables** (click "Advanced"):

   ```env
   DATABASE_URL=postgresql://energyteen:PASSWORD@HOST/energyteen
   ```
   (Paste the Internal Database URL from Part 1)
   
   ```env
   JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS
   ```
   (Generate with: `openssl rand -base64 32` or use random string)
   
   ```env
   NODE_ENV=production
   ```
   
   ```env
   PORT=10000
   ```
   (Render sets this automatically, but good to specify)
   
   ```env
   FRONTEND_URL=WILL_SET_AFTER_FRONTEND_DEPLOYS
   ```
   (Placeholder - you'll update this in Part 4)

6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment
8. Once deployed, **copy your backend URL**:
   - Example: `https://energy-teen-api-xyz123.onrender.com`

### Part 3: Deploy Frontend Static Site

1. From Dashboard, click **"New +"** → **"Static Site"**
2. Connect repository (should already be connected)
3. Select `gang1103app/figmafigmaboi`
4. Click **"Connect"**
5. Configure Static Site:

   | Setting | Value | Notes |
   |---------|-------|-------|
   | **Name** | `energy-teen-app` | Your choice |
   | **Branch** | `1.4` | ⚠️ Critical - full-stack version |
   | **Build Command** | `npm install && npm run build` | Installs & builds |
   | **Publish Directory** | `dist` | Vite output folder |

6. **Add Environment Variable**:

   ```env
   VITE_API_URL=https://energy-teen-api-xyz123.onrender.com/api
   ```
   (Use YOUR backend URL from Part 2, MUST include `/api` at end)

7. Click **"Create Static Site"**
8. Wait 2-3 minutes for build and deployment
9. Once deployed, **copy your frontend URL**:
   - Example: `https://energy-teen-app-abc456.onrender.com`

### Part 4: Update Backend CORS

Now that frontend is deployed, update backend to allow requests from it:

1. Go to **Backend Web Service** (`energy-teen-api`)
2. Click **"Environment"** tab
3. Find `FRONTEND_URL` variable
4. Update to your actual frontend URL:
   ```env
   FRONTEND_URL=https://energy-teen-app-abc456.onrender.com
   ```
   (NO trailing slash)
5. Click **"Save Changes"**
6. Backend will automatically redeploy (1-2 min)

### Part 5: Verify Database Initialization

**Good news!** The database migration runs automatically when the backend starts. You just need to verify it completed successfully:

1. Go to **Backend Service** (`energy-teen-api`)
2. Click **"Logs"** tab
3. Verify migration success - look for:
   ```
   🔄 Running database migrations on startup...
   ✅ Users table created
   ✅ User progress table created
   ✅ Challenges table created
   ✅ Database migration completed successfully!
   ```

**If migration didn't run automatically**, you have two options:

**Option 1: Trigger via API (No shell access needed)**
```bash
curl -X POST https://your-backend-api.onrender.com/api/migrate
```
Replace with your actual backend URL.

**Option 2: Use Shell (If you have access)**
1. Click **"Shell"** tab
2. Run:
   ```bash
   npm run db:migrate
   ```

**✅ Manual Deployment Complete!** Continue to [Post-Deployment Configuration](#post-deployment-configuration).

---

## Post-Deployment Configuration

### Verify All Services Are Running

Check Render Dashboard:
- ✅ PostgreSQL: Status = "Available" (green)
- ✅ Backend API: Status = "Live" (green)
- ✅ Frontend: Status = "Live" (green)

### Health Check

1. Visit backend health endpoint:
   ```
   https://your-backend-api.onrender.com/api/health
   ```
2. Should return:
   ```json
   {
     "status": "ok",
     "message": "Energy Teen API is running",
     "timestamp": "2024-11-03T00:00:00.000Z",
     "database": "connected"
   }
   ```

### Test Frontend

1. Visit your frontend URL: `https://your-frontend-app.onrender.com`
2. You should see the login page
3. Open browser console (F12) - should have NO CORS errors

---

## Verification

### Complete Verification Checklist

#### ✅ Backend Verification

1. **Health Check**
   ```bash
   curl https://your-backend-api.onrender.com/api/health
   ```
   Expected: `{"status":"ok",...}`

2. **Root Endpoint**
   ```bash
   curl https://your-backend-api.onrender.com/
   ```
   Expected: API version info

3. **Check Logs**
   - Go to Backend Service → Logs
   - Should see: "Server running on port 10000"
   - Should see: "Database connected successfully"

#### ✅ Frontend Verification

1. **Page Loads**
   - Visit frontend URL
   - Login page displays
   - No white screen/errors

2. **Browser Console**
   - Open DevTools (F12)
   - Console tab
   - Should have NO CORS errors
   - Should have NO 404 errors

3. **Navigation**
   - All links work
   - Pages load correctly

#### ✅ Database Verification

1. **Connect to Database**
   - Go to PostgreSQL service
   - Click "Connect" → "External Connection"
   - Use psql or GUI tool (like TablePlus, DBeaver)

2. **Check Tables**
   ```sql
   \dt
   ```
   Should see:
   - users
   - user_progress
   - challenges
   - user_challenges

#### ✅ Full Integration Test

1. **Sign Up**
   - Go to frontend
   - Click "Sign Up"
   - Fill in details:
     - Name: Test User
     - Username: testuser
     - Email: test@example.com
     - Password: test123456
   - Submit
   - Should redirect to dashboard

2. **Verify in Database**
   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```
   Should see your user

3. **Log Out & Log In**
   - Log out
   - Log back in with same credentials
   - Should work and show same data

4. **Test Features**
   - Navigate to each page:
     - ✅ Analytics
     - ✅ Leaderboard
     - ✅ Challenges
     - ✅ Profile
   - All should load without errors

### Success Criteria

Your deployment is successful when:

✅ All three services show "Live"/"Available" status  
✅ Health check returns 200 OK  
✅ Frontend loads without CORS errors  
✅ Sign up creates new user  
✅ Login works  
✅ User data persists across sessions  
✅ All pages load correctly  
✅ Database contains user data  

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ Issue: Backend Shows "Build Failed"

**Symptoms:**
- Backend build fails
- Error: "Cannot find module" or similar

**Solutions:**
1. Verify Root Directory is set to `backend`
2. Verify Branch is `1.4` (not `main`)
3. Check build logs for specific error
4. Ensure `backend/package.json` exists

#### ❌ Issue: "Database connection failed"

**Symptoms:**
- Backend logs: "Error: connect ECONNREFUSED"
- Health check shows database disconnected

**Solutions:**
1. Verify `DATABASE_URL` environment variable is set
2. Use **Internal Database URL** (not External)
3. Ensure database status is "Available"
4. Check database region matches backend region
5. Format: `postgresql://user:pass@host/database`

#### ❌ Issue: CORS Policy Error

**Symptoms:**
- Browser console: "blocked by CORS policy"
- Frontend can't communicate with backend

**Solutions:**
1. Verify `FRONTEND_URL` in backend environment variables
2. Must match EXACT frontend URL (no trailing slash)
3. Save changes and redeploy backend
4. Clear browser cache and reload

#### ❌ Issue: Frontend Shows 404 on API Calls

**Symptoms:**
- Browser console: "404 Not Found" for API calls
- Login doesn't work

**Solutions:**
1. Verify `VITE_API_URL` in frontend environment variables
2. Must include `/api` at the end
3. Format: `https://your-backend.onrender.com/api`
4. After changing, trigger **Manual Deploy** for static site

#### ❌ Issue: Tables Don't Exist

**Symptoms:**
- Error: "relation users does not exist"
- Can't sign up

**Solutions:**
1. Check backend logs to see if migration ran on startup
2. If not, trigger migration via API (no shell needed):
   ```bash
   curl -X POST https://your-backend-api.onrender.com/api/migrate
   ```
3. Alternatively, if you have Shell access:
   - Go to backend Shell
   - Run: `npm run db:migrate`
4. Verify migration completed successfully in logs

#### ❌ Issue: Slow First Request (30-60 seconds)

**Symptoms:**
- First API call takes very long
- Subsequent calls are fast

**Explanation:**
- This is NORMAL on Render's free tier
- Services "spin down" after 15 minutes of inactivity
- First request "wakes up" the service
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid plan ($7/month) for always-on service
- Or accept this behavior for development/demo

#### ❌ Issue: Frontend Shows White Screen

**Symptoms:**
- Blank white page
- No content visible

**Solutions:**
1. Open browser console (F12) for errors
2. Check if `VITE_API_URL` is set correctly
3. Verify backend is running (check health endpoint)
4. Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Check Network tab for failed requests

#### ❌ Issue: Can't Sign Up - "User already exists"

**Symptom:**
- Error when trying to create account

**Solutions:**
1. Email already registered - use different email
2. Or connect to database and delete test user:
   ```sql
   DELETE FROM users WHERE email = 'test@example.com';
   ```

### Getting Help

If issues persist:

1. **Check Render Status**: [status.render.com](https://status.render.com)
2. **Review Logs**:
   - Backend: Backend Service → Logs
   - Frontend: Static Site → Events → Build Log
   - Database: PostgreSQL → Logs
3. **Render Docs**: [render.com/docs](https://render.com/docs)
4. **Render Community**: [community.render.com](https://community.render.com)
5. **Open GitHub Issue**: In the repository

---

## Cost & Scaling

### Free Tier Details

Your deployment uses Render's free tier:

| Service | Free Tier Limits | Notes |
|---------|------------------|-------|
| **PostgreSQL** | 1GB storage, 1GB RAM | ~10,000 users capacity |
| **Backend** | 750 hrs/month, Spins down after 15 min | Shared CPU |
| **Frontend** | 100GB bandwidth/month | Static files on CDN |

**Total Cost: $0/month** for moderate usage

### Free Tier Limitations

⚠️ Services spin down after 15 minutes of inactivity  
⚠️ First request after spin-down: 30-60 seconds  
⚠️ No automatic backups (manual backup required)  
⚠️ Shared resources (may be slower during peak times)  

### When to Upgrade

Consider paid plans ($7/month per service) when you need:

✅ Always-on services (no spin down)  
✅ Faster performance  
✅ Automatic daily backups  
✅ More storage/bandwidth  
✅ Priority support  
✅ Production-grade reliability  

### Scaling Path

**Phase 1: Free Tier** (Current)
- Perfect for: Development, demos, low-traffic apps
- Cost: $0/month

**Phase 2: Starter Plan**
- Backend: $7/month (always-on)
- Database: $7/month (automatic backups)
- Frontend: Free (still sufficient)
- Cost: $14/month

**Phase 3: Production**
- Backend: $25/month (more resources)
- Database: $25/month (more storage/performance)
- Frontend: Free or Pro ($19/month for more bandwidth)
- Cost: $50-70/month

---

## Quick Reference Card

### Essential Commands

```bash
# Trigger database migration (via API - no shell needed)
curl -X POST https://your-backend.onrender.com/api/migrate

# Database migration (via Shell if you have access)
npm run db:migrate

# Check backend health
curl https://your-backend.onrender.com/api/health

# Connect to database (from Shell)
psql $DATABASE_URL
```

### Essential URLs

```
Backend API: https://your-backend-api.onrender.com
Health Check: https://your-backend-api.onrender.com/api/health
Frontend: https://your-frontend-app.onrender.com
Database: Internal only (connect from backend)
```

### Environment Variables Reference

**Backend (`energy-teen-api`):**
```env
DATABASE_URL=postgresql://user:pass@host/db    # From PostgreSQL service
JWT_SECRET=random_32char_minimum_string        # Generate secure random
NODE_ENV=production                            # Always production
PORT=10000                                     # Render default
FRONTEND_URL=https://your-frontend.onrender.com # Your frontend URL
```

**Frontend (`energy-teen-app`):**
```env
VITE_API_URL=https://your-backend.onrender.com/api  # Your backend URL + /api
```

### Build Configuration

**Backend:**
```yaml
Build Command: npm install
Start Command: npm start
Root Directory: backend
Branch: 1.4
```

**Frontend:**
```yaml
Build Command: npm install && npm run build
Publish Directory: dist
Branch: 1.4
```

---

## Automatic Deployments

### How It Works

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin 1.4
```

- Backend: Auto-deploys in ~2-3 minutes
- Frontend: Auto-deploys in ~1-2 minutes
- Database: No redeployment needed

### Disable Auto-Deploy

If you want manual control:

1. Go to service Settings
2. Toggle "Auto-Deploy" off
3. Use "Manual Deploy" button when ready

---

## Production Checklist

Before going live with real users:

- [ ] Upgrade to paid plans (at least for backend & database)
- [ ] Set up custom domain
- [ ] Configure SSL/HTTPS (automatic on Render)
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Enable database backups (paid plan)
- [ ] Review security: strong JWT_SECRET, rate limiting
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Load test the application
- [ ] Create backup/restore procedures
- [ ] Document your deployment URLs & credentials

---

## Summary

You now have everything needed to deploy the Energy Saving Teen App to Render:

1. ✅ **Three services**: PostgreSQL, Backend API, Frontend
2. ✅ **Two deployment options**: Blueprint (easy) or Manual (detailed)
3. ✅ **Complete configuration**: All environment variables explained
4. ✅ **Verification steps**: Ensure everything works
5. ✅ **Troubleshooting guide**: Fix common issues
6. ✅ **Cost information**: Understand free tier and scaling

**Estimated Total Time**: 15-30 minutes from start to working app.

**Questions?** Check [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md) or [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md) for additional details.

---

**Good luck with your deployment! 🚀**
