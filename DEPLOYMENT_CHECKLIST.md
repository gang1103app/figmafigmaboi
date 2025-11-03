# Render Deployment Checklist

Use this checklist to deploy the Energy Saving Teen App to Render.

## Prerequisites ✓

- [ ] GitHub account with access to `gang1103app/figmafigmaboi`
- [ ] Render account created at [render.com](https://render.com)
- [ ] Latest code pushed to GitHub

## Frontend Deployment Steps

### 1. Setup Render Account
- [ ] Go to [https://render.com](https://render.com)
- [ ] Sign up/Sign in with GitHub
- [ ] Authorize Render to access GitHub repositories

### 2. Create Static Site
- [ ] Click **"New +"** in Render dashboard
- [ ] Select **"Static Site"**
- [ ] Connect to GitHub (if first time)

### 3. Connect Repository
- [ ] Find `gang1103app/figmafigmaboi` in repository list
- [ ] Click **"Connect"**

### 4. Configure Settings
Enter these exact values:

- [ ] **Name**: `energy-teen-app` (or custom name)
- [ ] **Branch**: `main`
- [ ] **Build Command**: `npm run build`
- [ ] **Publish Directory**: `dist`
- [ ] **Auto-Deploy**: Enabled (default)

### 5. Deploy
- [ ] Review all settings
- [ ] Click **"Create Static Site"**
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for any errors

### 6. Verify Deployment
- [ ] Site shows **"Live"** status (green indicator)
- [ ] Click the provided URL
- [ ] Test Analytics page loads
- [ ] Test Leaderboard page loads
- [ ] Test Challenges page loads
- [ ] Test Profile page loads
- [ ] Test navigation between pages works
- [ ] Test charts display correctly

### 7. Post-Deployment (Optional)
- [ ] Set up custom domain (if desired)
- [ ] Configure build notifications
- [ ] Add uptime monitoring
- [ ] Document live URL for team

## Configuration Quick Reference

```
Service Type: Static Site
Repository: gang1103app/figmafigmaboi
Branch: main
Build Command: npm run build
Publish Directory: dist
Environment Variables: None required
```

## No Backend Required

This app currently has:
- ✅ No backend server
- ✅ No database
- ✅ No API endpoints
- ✅ All data embedded client-side

## Future Backend Setup (If Needed)

If you decide to add a backend later:

### Backend Service Checklist
- [ ] Create new **Web Service** on Render
- [ ] Configure build and start commands
- [ ] Add environment variables (database URL, API keys, etc.)
- [ ] Deploy backend service
- [ ] Get backend service URL

### Connect Frontend to Backend
- [ ] Add `VITE_API_URL` environment variable to Static Site
- [ ] Update frontend code to use API
- [ ] Redeploy frontend

## Troubleshooting Checklist

If build fails:
- [ ] Check build logs for error messages
- [ ] Verify `package.json` exists and has correct scripts
- [ ] Test build locally: `npm install && npm run build`
- [ ] Check that all dependencies are listed in `package.json`

If site is blank/404:
- [ ] Verify Publish Directory is `dist` (not `build`)
- [ ] Check that build completed successfully
- [ ] Look for errors in browser console
- [ ] Verify using "Static Site" not "Web Service"

If routes don't work:
- [ ] Verify you created a "Static Site" (handles SPA routing automatically)
- [ ] Check React Router configuration (already correct in this app)

## Support Resources

- [ ] Bookmark [Render Documentation](https://render.com/docs)
- [ ] Join [Render Community](https://community.render.com)
- [ ] Check [Status Page](https://status.render.com) if issues occur

## Maintenance

### Regular Updates
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push origin main
# Render auto-deploys!
```

- [ ] Test changes locally before pushing
- [ ] Monitor deploy status in Render dashboard
- [ ] Check site after deployment completes

---

**Deployment Complete?** 
Share your live URL with the team! 🎉

**Need Help?**
See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed guide.
