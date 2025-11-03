# Deployment Verification Checklist

Use this checklist to verify your deployment on Render is working correctly.

## Pre-Deployment Checklist

### Database
- [ ] PostgreSQL database created on Render
- [ ] Database is in "Available" status
- [ ] Internal Database URL copied

### Backend API
- [ ] Backend web service created
- [ ] Branch set to `1.4`
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `DATABASE_URL` (from PostgreSQL internal URL)
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `FRONTEND_URL` (will set after frontend deploys)

### Frontend
- [ ] Static site created
- [ ] Branch set to `1.4`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL` (will set after backend deploys)

## Post-Deployment Checklist

### 1. Database Migration
- [ ] Backend is deployed and running
- [ ] Access Render Shell for backend service
- [ ] Run migration command: `npm run db:migrate`
- [ ] Verify all tables created successfully
- [ ] Check logs for any errors

### 2. Backend Health Check
- [ ] Visit: `https://your-backend-api.onrender.com/api/health`
- [ ] Should return: `{"status":"ok","message":"Energy Teen API is running",...}`
- [ ] Status code: 200 OK
- [ ] Response time: < 5 seconds (first request may be slower)

### 3. Backend Root Endpoint
- [ ] Visit: `https://your-backend-api.onrender.com/`
- [ ] Should return API version and endpoints
- [ ] Verify version is `1.4.0`

### 4. Update Environment Variables
- [ ] Copy backend URL
- [ ] Go to frontend static site → Environment
- [ ] Set `VITE_API_URL=https://your-backend-api.onrender.com/api`
- [ ] Trigger manual redeploy of frontend
- [ ] Go to backend service → Environment
- [ ] Set `FRONTEND_URL=https://your-frontend-app.onrender.com`
- [ ] Backend will auto-redeploy

### 5. Frontend Access
- [ ] Visit your frontend URL
- [ ] Page loads without errors
- [ ] No CORS errors in browser console (F12)
- [ ] Login page displays correctly

### 6. Test Authentication Flow

#### Signup
- [ ] Click "Sign up" or go to signup page
- [ ] Fill in all fields:
  - [ ] Name
  - [ ] Username
  - [ ] Email
  - [ ] Password (min 6 characters)
  - [ ] Confirm Password (must match)
- [ ] Click "Create Account"
- [ ] Should redirect to home/dashboard
- [ ] Should see user interface (not login page)
- [ ] Check browser console - no errors

#### Logout & Login
- [ ] Log out from settings or profile
- [ ] Should redirect to login page
- [ ] Try logging in with wrong password
  - [ ] Should show error message
- [ ] Log in with correct credentials
- [ ] Should redirect to dashboard
- [ ] Should see your profile data

### 7. Test Data Persistence

#### User Profile
- [ ] Navigate to Profile page
- [ ] Check if user data is displayed
- [ ] Note your current level/XP/points
- [ ] Log out
- [ ] Log back in
- [ ] Verify data persists (same level/XP/points)

#### Database Verification
- [ ] Go to Render → PostgreSQL database
- [ ] Click "Connect" → "External Connection"
- [ ] Use provided credentials to connect with psql or GUI tool
- [ ] Run: `SELECT * FROM users;`
- [ ] Verify your user account exists
- [ ] Run: `SELECT * FROM user_progress;`
- [ ] Verify your progress data exists

### 8. Test Core Features

#### Challenges
- [ ] Navigate to Challenges/Tasks page
- [ ] Available challenges are displayed
- [ ] Start a challenge
- [ ] Update progress (if feature implemented in UI)
- [ ] Verify challenge appears in active list

#### Leaderboard
- [ ] Navigate to Leaderboard page
- [ ] Leaderboard loads without errors
- [ ] Your user appears in the list
- [ ] Rankings are displayed correctly

#### Analytics
- [ ] Navigate to Analytics page
- [ ] Page loads without errors
- [ ] Charts render (even if no data yet)

#### Settings
- [ ] Navigate to Settings page
- [ ] Logout button works
- [ ] Other settings display correctly

### 9. Performance Testing

#### Cold Start (Free Tier)
- [ ] Wait 15+ minutes of inactivity
- [ ] Try accessing the frontend
- [ ] First API request takes 30-60 seconds (expected on free tier)
- [ ] Subsequent requests are fast

#### Response Times
- [ ] Login: < 2 seconds (after warm-up)
- [ ] Get profile: < 1 second
- [ ] Leaderboard: < 2 seconds
- [ ] Page navigation: Instant

### 10. Error Handling

#### Invalid Login
- [ ] Try logging in with non-existent email
- [ ] Should show: "Invalid credentials"
- [ ] Should NOT crash or show technical errors

#### Duplicate Signup
- [ ] Try signing up with existing email
- [ ] Should show: "Email already registered"
- [ ] Should NOT crash

#### Network Errors
- [ ] Open browser DevTools → Network tab
- [ ] Simulate offline mode
- [ ] Try any action
- [ ] Should show appropriate error message
- [ ] Turn online back - app should work again

### 11. Security Verification

#### Password Security
- [ ] Passwords are not visible in:
  - [ ] Browser console
  - [ ] Network requests (should be sent via HTTPS)
  - [ ] Database (check - should see hash, not plain text)

#### JWT Tokens
- [ ] Token is stored in localStorage
- [ ] Token is sent in Authorization header
- [ ] Token expires after 7 days (not testable immediately)

#### CORS
- [ ] No CORS errors in browser console
- [ ] API only accepts requests from frontend URL

### 12. Mobile Testing
- [ ] Open frontend on mobile device
- [ ] Responsive layout works
- [ ] All features accessible
- [ ] Login/signup works
- [ ] Navigation works

### 13. Monitor Logs

#### Backend Logs
- [ ] Go to backend service → Logs
- [ ] Watch for errors during testing
- [ ] Verify API requests are logged
- [ ] Check for database connection issues

#### Frontend Build Logs
- [ ] Go to frontend static site → Events
- [ ] Verify build completed successfully
- [ ] No build errors or warnings

## Common Issues & Solutions

### ❌ Database Connection Failed
**Symptoms:** Backend logs show "database connection failed"

**Fix:**
1. Verify DATABASE_URL is set correctly
2. Use Internal Database URL (not External)
3. Ensure database is running (check status)

### ❌ CORS Errors
**Symptoms:** Browser console shows CORS policy errors

**Fix:**
1. Verify `FRONTEND_URL` in backend matches actual frontend URL
2. No trailing slash in URLs
3. Redeploy backend after changing

### ❌ 404 on API Calls
**Symptoms:** API calls return 404

**Fix:**
1. Verify `VITE_API_URL` is set correctly in frontend
2. Ensure it includes `/api` at the end
3. Redeploy frontend after changing

### ❌ Backend Won't Start
**Symptoms:** Backend service shows error status

**Fix:**
1. Check logs for specific error
2. Verify all dependencies installed
3. Check environment variables are set
4. Ensure `PORT=10000` is set

### ❌ Frontend Shows White Screen
**Symptoms:** Frontend loads but shows blank page

**Fix:**
1. Open browser console for errors
2. Check if API URL is correct
3. Verify backend is running and accessible
4. Clear browser cache

## Success Criteria

Your deployment is successful when:

✅ Backend health check returns 200 OK
✅ Database contains user data
✅ Users can signup and login
✅ User data persists across sessions
✅ All pages load without errors
✅ No CORS errors
✅ Mobile responsive design works
✅ Logout and re-login works
✅ Data is saved to database

## Monitoring

Set up ongoing monitoring:

1. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor: `https://your-backend-api.onrender.com/api/health`
   - Alert if down for > 5 minutes

2. **Error Tracking**
   - Check Render logs daily
   - Set up log alerts in Render dashboard
   - Consider: Sentry, LogRocket, or similar

3. **Database Usage**
   - Monitor database size (1GB free tier limit)
   - Check connection count
   - Review slow queries

4. **Performance**
   - Monitor response times
   - Track cold start times on free tier
   - Consider upgrading if consistently slow

## Post-Launch Tasks

After successful deployment:

- [ ] Document your deployment URLs
- [ ] Share with stakeholders
- [ ] Set up monitoring
- [ ] Plan first backup (if on paid tier)
- [ ] Review free tier limitations
- [ ] Consider upgrade path for production
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on Render)

## Need Help?

- Review [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md)
- Check [QUICKSTART.md](QUICKSTART.md) for local setup
- Review backend logs on Render
- Check database connectivity
- Verify all environment variables

---

**Congratulations!** 🎉 If you've checked all items, your Energy Teen App is successfully deployed with full backend functionality!
