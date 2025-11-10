# Quick Deploy Guide - Render Free Tier with Existing Database

This guide covers deploying the EcoBuddy app to Render using the **free tier** with an **existing PostgreSQL database**.

## Prerequisites

- A Render account (sign up at https://render.com)
- An existing PostgreSQL database with connection details
- Your GitHub repository connected to Render

## Free Tier Limitations

- **Web Services**: Sleep after 15 minutes of inactivity, 750 hours/month
- **Static Sites**: No sleep time, unlimited bandwidth
- **Database**: Not included in free tier (you're using an existing database)

---

## Deployment Steps

### 1. Deploy Backend API (Web Service)

1. **Log in to Render** at https://dashboard.render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository: `gang1103app/figmafigmaboi`
   - Configure the service:

3. **Service Configuration**
   ```
   Name:                ecobuddy-api (or any name you prefer)
   Region:              Oregon (US West) or closest to you
   Branch:              copilot/add-interactable-garden-feature (or your main branch)
   Root Directory:      backend
   Runtime:             Node
   Build Command:       npm install
   Start Command:       npm start
   Instance Type:       Free
   ```

4. **Environment Variables**
   
   Click "Advanced" → Add the following environment variables:
   
   ```
   DATABASE_URL=<your-existing-postgres-connection-string>
   JWT_SECRET=<generate-a-random-secure-string>
   NODE_ENV=production
   PORT=3001
   ```

   **Important Notes:**
   - `DATABASE_URL` format: `postgresql://username:password@host:port/database`
   - `JWT_SECRET`: Use a random string (at least 32 characters). You can generate one at https://randomkeygen.com/
   - Example: `JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string`

5. **Click "Create Web Service"**
   
   Render will:
   - Clone your repository
   - Install dependencies
   - Start the backend server
   - Provide a URL like: `https://ecobuddy-api.onrender.com`

6. **Run Database Migration**
   
   After deployment, you need to set up the database tables:
   
   - Go to your web service page
   - Click "Shell" in the left sidebar
   - Run the migration command:
   ```bash
   npm run db:migrate
   ```
   
   This will create all necessary tables and seed initial data.

### 2. Deploy Frontend (Static Site)

1. **Create New Static Site**
   - Go back to dashboard
   - Click "New +" → "Static Site"
   - Select your repository: `gang1103app/figmafigmaboi`

2. **Static Site Configuration**
   ```
   Name:                ecobuddy (or any name you prefer)
   Branch:              copilot/add-interactable-garden-feature (or your main branch)
   Root Directory:      (leave empty, deploy from root)
   Build Command:       npm install && npm run build
   Publish Directory:   dist
   ```

3. **Environment Variables**
   
   Click "Advanced" → Add:
   
   ```
   VITE_API_URL=https://your-backend-api-url.onrender.com/api
   ```
   
   Replace `your-backend-api-url` with the URL from Step 1.5 (e.g., `https://ecobuddy-api.onrender.com/api`)

4. **Click "Create Static Site"**
   
   Render will:
   - Build your React application
   - Deploy it as a static site
   - Provide a URL like: `https://ecobuddy.onrender.com`

### 3. Verification

1. **Visit your frontend URL** (e.g., `https://ecobuddy.onrender.com`)

2. **Test the application**:
   - Sign up for a new account
   - Complete the energy survey
   - View your home page
   - Start a challenge and mark progress
   - Visit the Garden page
   - Earn seeds by completing challenges
   - Purchase plants/backgrounds in the Garden shop

3. **Check Backend Health**:
   - Visit: `https://your-backend-url.onrender.com/api/health` (if health endpoint exists)
   - Should return: `{"status":"ok"}` or similar

---

## Important Configuration Notes

### Database Connection String Format

Your `DATABASE_URL` should look like:
```
postgresql://username:password@hostname:5432/database_name
```

For example, if you're using:
- **Heroku Postgres**: Copy the connection string from Heroku dashboard
- **Neon**: Copy from Neon project dashboard
- **Supabase**: Copy the connection string from project settings
- **Railway**: Copy from Railway database settings
- **Self-hosted**: Use your server's connection details

### CORS Configuration

The backend is already configured to accept requests from any origin in production. If you need to restrict this:

1. Edit `backend/src/server.js`
2. Update the CORS configuration to whitelist only your frontend URL

### Free Tier Sleep

Your backend will sleep after 15 minutes of inactivity. The first request after sleeping will take 30-60 seconds to wake up. This is normal for the free tier.

To keep it awake (optional):
- Use a service like UptimeRobot (free) to ping your backend every 5 minutes
- Note: This will use your 750 free hours faster

---

## Troubleshooting

### Backend Won't Start

1. **Check logs**: Go to your web service → "Logs" tab
2. **Common issues**:
   - Invalid `DATABASE_URL`: Verify connection string format
   - Missing environment variables: Check all required vars are set
   - Database connection failed: Ensure database is accessible from Render

### Frontend Shows API Errors

1. **Check VITE_API_URL**: Must end with `/api` and match your backend URL
2. **Verify backend is running**: Visit backend URL directly
3. **Check browser console**: Look for CORS or network errors

### Database Migration Fails

1. **Access Shell**: Web Service → Shell
2. **Check database connection**:
   ```bash
   node -e "const pool = require('./src/config/database.js').default; pool.query('SELECT NOW()').then(r => console.log(r.rows)).catch(console.error)"
   ```
3. **Run migration again**:
   ```bash
   npm run db:migrate
   ```

### Garden Items Not Showing

1. **Verify migration ran successfully**: Check that `garden_items` table exists
2. **Check backend logs**: Look for database query errors
3. **Verify image paths**: Images should be in `/public` folder

---

## Cost Summary

### Free Forever (with limitations):
- ✅ Frontend Static Site: Unlimited
- ✅ Backend Web Service: 750 hours/month (enough for ~31 days if always on, or unlimited with sleep)
- ❌ PostgreSQL Database: NOT included (you're using existing database)

### Your Costs:
- **Render**: $0/month (using free tier)
- **Database**: Depends on your existing database provider
  - Neon: Free tier available (512 MB storage)
  - Supabase: Free tier available (500 MB storage)
  - Heroku: Paid ($5-$50/month depending on plan)
  - Railway: $5/month credit, then pay-as-you-go

---

## Updating Your Deployment

When you push changes to GitHub:

1. **Backend**: Auto-deploys when you push to the branch you selected
2. **Frontend**: Auto-deploys when you push to the branch you selected

To trigger manual deploy:
- Go to your service/site in Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"

---

## Support

For issues:
1. Check Render logs (Logs tab in dashboard)
2. Review browser console for frontend errors
3. Test API endpoints directly with curl or Postman
4. Consult Render docs: https://render.com/docs

## Next Steps

After deployment:
1. Share your frontend URL with users
2. Monitor usage in Render dashboard
3. Set up custom domain (optional, requires paid plan)
4. Consider upgrading if you exceed free tier limits
