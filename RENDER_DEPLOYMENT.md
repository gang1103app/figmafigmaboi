# Render Deployment Guide - Energy Saving Teen App

⚠️ **IMPORTANT**: This guide is for **frontend-only deployment** (older versions on `main` branch).

For **full-stack deployment** with backend and database (v1.4 on branch `1.4`), see:
👉 **[DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md)** - Complete deployment guide with all details

---

## Overview

**This Guide Covers:** Frontend-only deployment (React + Vite static site)
- All data is embedded client-side
- No API server required
- No database needed
- Deploys as a static site on Render

**Not Covered Here:** Backend API, PostgreSQL database, authentication (see DEPLOY_TO_RENDER.md for full-stack)

## Frontend Deployment (Static Site)

### Prerequisites

Before deploying to Render, ensure you have:
- A GitHub account with access to the repository
- A Render account (free tier available at [render.com](https://render.com))
- Your repository pushed to GitHub

### Step-by-Step Deployment Instructions

#### 1. Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended for easy integration)
4. Authorize Render to access your GitHub repositories

#### 2. Create a New Static Site

1. From your Render Dashboard, click **"New +"** button in the top right
2. Select **"Static Site"** from the dropdown menu
3. If this is your first time:
   - Click **"Connect GitHub"** to link your GitHub account
   - Authorize Render to access your repositories

#### 3. Connect Your Repository

1. In the repository list, find `gang1103app/figmafigmaboi`
   - You may need to click **"Configure GitHub App"** to grant access to specific repositories
2. Click **"Connect"** next to the repository name

#### 4. Configure Static Site Settings

Fill in the following configuration details:

| Setting | Value | Description |
|---------|-------|-------------|
| **Name** | `energy-teen-app` | Your site's name (or choose your own) |
| **Branch** | `main` | The branch to deploy from |
| **Build Command** | `npm run build` | Command to build your app |
| **Publish Directory** | `dist` | Where Vite outputs the built files |

**Advanced Settings (Optional):**
- **Auto-Deploy**: Leave enabled (default) to automatically redeploy on git push
- **Environment Variables**: None required for this app
- **Build Command Override**: Not needed

#### 5. Deploy

1. Review your settings
2. Click **"Create Static Site"**
3. Render will:
   - Clone your repository
   - Run `npm install` to install dependencies
   - Run `npm run build` to build the production bundle
   - Deploy the `dist` folder to a CDN

#### 6. Monitor Deployment

1. You'll be redirected to your site's dashboard
2. Watch the build logs in real-time
3. The first deploy typically takes 2-5 minutes
4. Once complete, you'll see:
   - **Live Status**: Green indicator
   - **URL**: Your site's public URL (e.g., `https://energy-teen-app.onrender.com`)

#### 7. Access Your App

1. Click the URL at the top of the dashboard
2. Your Energy Saving Teen App should load successfully
3. Test all features:
   - Analytics page with charts
   - Leaderboard rankings
   - Challenges page
   - Profile & EcoBuddy page
   - Navigation between pages

### Post-Deployment Configuration

#### Custom Domain (Optional)

To use your own domain:

1. Go to your Static Site settings
2. Scroll to **"Custom Domains"** section
3. Click **"Add Custom Domain"**
4. Enter your domain name
5. Follow DNS configuration instructions provided by Render

#### Automatic Deploys

Render automatically deploys when you push to your configured branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
# Render will automatically detect and deploy
```

To disable auto-deploy:
1. Go to site Settings
2. Toggle **"Auto-Deploy"** off

#### Build Notifications

Set up notifications for build status:

1. Go to site Settings
2. Scroll to **"Notifications"**
3. Add email or Slack webhook URL
4. Select which events to be notified about

## Environment Variables

This app currently requires **no environment variables** because:
- All data is embedded in the frontend code
- No API calls are made
- No backend services are used

### Future Environment Variables (If Backend Added)

If you add a backend later, you might need:

```
VITE_API_URL=https://your-backend-api.onrender.com
VITE_API_KEY=your_api_key_here
```

To add environment variables:
1. Go to your Static Site dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter key and value
5. Click **"Save Changes"**
6. Trigger a manual redeploy

## Troubleshooting

### Build Fails

**Symptom:** Build fails with error messages

**Solutions:**
1. Check build logs for specific error messages
2. Ensure `package.json` has correct build script
3. Verify all dependencies are in `package.json` (not just `package-lock.json`)
4. Test build locally: `npm install && npm run build`

### Site Shows 404 or Blank Page

**Symptom:** Site loads but shows 404 or blank white page

**Solutions:**
1. Verify **Publish Directory** is set to `dist` (not `build` or `public`)
2. Check that build completed successfully in logs
3. Ensure `index.html` exists in the built output
4. For React Router, ensure routes are configured correctly (already done in this app)

### Routes Don't Work (404 on Refresh)

**Symptom:** Clicking links works, but refreshing page shows 404

**Solutions:**
This is handled by Render's static site hosting automatically. If issues occur:
1. Check that you're using a "Static Site" not a "Web Service"
2. Render automatically handles SPA routing

### CSS or Assets Not Loading

**Symptom:** Site loads but styling is broken

**Solutions:**
1. Check browser console for 404 errors on assets
2. Verify Vite base path is configured correctly (default `/` works for Render)
3. Ensure `vite.config.js` doesn't have custom base URL

### Slow Build Times

**Symptom:** Builds take longer than expected

**Solutions:**
1. Normal build time: 2-5 minutes for first build, 1-2 minutes for subsequent
2. Check for excessive dependencies in `package.json`
3. Consider using Render's paid plans for faster build servers

## Adding a Backend (Future Enhancement)

Currently, this app has **no backend**. If you want to add one, here are Render deployment options:

### Option 1: Node.js/Express Backend

1. Create a new **Web Service** on Render
2. Add your backend code to a `/server` directory
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**: Add database URLs, API keys, etc.
4. Update frontend to call backend API

### Option 2: Python/Flask Backend

1. Create a new **Web Service** on Render
2. Add Python backend code
3. Add `requirements.txt` with dependencies
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: Python 3

### Option 3: Database

If you need a database:

1. From Render Dashboard, click **"New +"**
2. Select **PostgreSQL** (or your preferred database)
3. Configure database settings
4. Copy the **Internal Database URL** from the database dashboard
5. Add it as an environment variable to your backend service

### Connecting Frontend to Backend

Once backend is deployed:

1. Get your backend URL from Render (e.g., `https://energy-teen-api.onrender.com`)
2. Add environment variable to your Static Site:
   ```
   VITE_API_URL=https://energy-teen-api.onrender.com
   ```
3. Update frontend code to use `import.meta.env.VITE_API_URL`
4. Redeploy frontend

## Cost Estimation

### Free Tier (Current Setup)

- **Static Sites**: Free with some limitations
  - 100 GB bandwidth/month
  - Automatic SSL
  - Global CDN
  - Custom domains

### Free Tier Limitations

- Sites may spin down after inactivity
- Limited build minutes per month (500 minutes free)
- Shared resources

### Paid Plans (If Needed Later)

- **Starter**: $7/month per service
  - No spin down
  - More build minutes
  - Faster builds
  - Priority support

## Support and Resources

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **Render Community**: [https://community.render.com](https://community.render.com)
- **Status Page**: [https://status.render.com](https://status.render.com)

## Quick Reference Card

```
Repository: gang1103app/figmafigmaboi
Branch: main
Service Type: Static Site
Build Command: npm run build
Publish Directory: dist
Build Time: ~2-5 minutes
No Environment Variables Required
No Backend Required
```

## Maintenance and Updates

### Regular Updates

```bash
# Local development
npm install          # Install dependencies
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build locally

# Deploy to Render
git add .
git commit -m "Your update message"
git push origin main  # Triggers automatic deployment
```

### Monitoring

- Check Render dashboard for deploy status
- View build logs for any issues
- Monitor site health from dashboard
- Set up uptime monitoring (optional)

---

**Need Help?** 
- Open an issue in the GitHub repository
- Contact Render support through their dashboard
- Check Render community forums
