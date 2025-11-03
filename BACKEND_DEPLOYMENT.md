# Backend Deployment Guide - Render

This guide explains how to deploy the Energy Teen App backend with PostgreSQL database on Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your GitHub repository connected to Render
- The backend code in the `backend/` directory

## Step 1: Create PostgreSQL Database

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `energy-teen-db` (or your preferred name)
   - **Database**: `energyteen` (will be created automatically)
   - **User**: `energyteen` (will be created automatically)
   - **Region**: Choose the closest region to your users
   - **PostgreSQL Version**: 15 (or latest)
   - **Plan**: Free (or choose paid for production)
4. Click **"Create Database"**
5. Wait 2-5 minutes for the database to be provisioned
6. Once ready, note down the **Internal Database URL** from the database page (we'll use this for the backend)

## Step 2: Deploy Backend Web Service

1. From your Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository if not already connected
3. Select your repository: `gang1103app/figmafigmaboi`
4. Configure the web service:
   - **Name**: `energy-teen-api` (or your preferred name)
   - **Branch**: `1.4`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for production)

5. Add Environment Variables (click **"Advanced"** → **"Add Environment Variable"**):
   
   ```
   DATABASE_URL = [Your PostgreSQL Internal Database URL from Step 1]
   JWT_SECRET = [Generate a strong random string]
   NODE_ENV = production
   FRONTEND_URL = [Your frontend URL once deployed]
   PORT = 10000
   ```

   **Important Notes:**
   - For `DATABASE_URL`: Copy the **Internal Database URL** from your PostgreSQL database page
   - For `JWT_SECRET`: Generate a strong random secret (e.g., use `openssl rand -base64 32`)
   - For `FRONTEND_URL`: You can update this later after deploying the frontend
   - `PORT`: Render automatically sets this to 10000 for web services

6. Click **"Create Web Service"**
7. Wait for the deployment to complete (5-10 minutes)
8. Once deployed, note down your backend URL: `https://energy-teen-api.onrender.com`

## Step 3: Initialize Database

After your backend is deployed, you need to run the database migration to create all tables.

### Option A: Using Render Shell (Recommended)

1. Go to your backend web service on Render
2. Click on the **"Shell"** tab in the left sidebar
3. Run the migration command:
   ```bash
   npm run db:migrate
   ```
4. You should see output confirming all tables were created

### Option B: Using Render Connect

1. Install the Render CLI: `npm install -g render-cli`
2. Connect to your service: `render connect energy-teen-api`
3. Run: `npm run db:migrate`

## Step 4: Update Frontend Environment Variables

1. Go to your frontend static site on Render
2. Go to **"Environment"** tab
3. Add environment variable:
   ```
   VITE_API_URL = https://energy-teen-api.onrender.com/api
   ```
4. Save and trigger a redeploy

## Step 5: Update Backend CORS Settings

1. Go back to your backend web service
2. Go to **"Environment"** tab
3. Update the `FRONTEND_URL` variable with your actual frontend URL:
   ```
   FRONTEND_URL = https://your-frontend-app.onrender.com
   ```
4. Save and Render will automatically redeploy

## Verification

Once everything is deployed, verify your setup:

1. **Health Check**: Visit `https://energy-teen-api.onrender.com/api/health`
   - Should return: `{"status": "ok", "message": "Energy Teen API is running", ...}`

2. **Test Signup**: Go to your frontend URL and try creating a new account

3. **Test Login**: Try logging in with the account you created

4. **Check Database**: In Render dashboard, go to your PostgreSQL database and click "Connect" → "External Connection" to view data using a database client

## Troubleshooting

### Database Connection Issues
- Verify the `DATABASE_URL` environment variable is set correctly
- Make sure you're using the **Internal Database URL** from Render (not external)
- Check backend logs for connection errors

### CORS Errors
- Verify `FRONTEND_URL` in backend environment variables matches your frontend URL
- Make sure there are no trailing slashes in the URL

### Migration Failed
- Check if the database is accessible
- View logs in Render dashboard for detailed error messages
- Make sure PostgreSQL is fully provisioned before running migrations

### API Not Responding
- Check if the backend service is running (green status in Render)
- Verify `PORT` environment variable is set to 10000
- Check the logs for any startup errors

## Free Tier Limitations

Render's free tier has the following limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds to respond
- 750 hours per month of runtime (across all free services)
- PostgreSQL free tier: 1GB storage, 1GB RAM

For production use, consider upgrading to a paid plan.

## Database Backups

On the free tier, Render does not provide automatic backups. For production:
1. Upgrade to a paid database plan for automatic backups
2. Or manually backup using `pg_dump`:
   ```bash
   pg_dump [DATABASE_URL] > backup.sql
   ```

## Monitoring

Monitor your backend service:
1. **Render Dashboard**: View logs, metrics, and service health
2. **API Health Endpoint**: Set up monitoring for `/api/health`
3. **Database Metrics**: View connection count, storage usage in Render dashboard

## Security Best Practices

1. ✅ Always use environment variables for secrets (never commit them)
2. ✅ Use strong JWT_SECRET (minimum 32 characters)
3. ✅ Enable HTTPS (automatic on Render)
4. ✅ Regularly update dependencies: `npm audit fix`
5. ✅ Monitor API logs for suspicious activity
6. ✅ Consider adding rate limiting for production

## Scaling

To scale your application:
1. Upgrade to a paid plan for:
   - More CPU and memory
   - Faster response times
   - Multiple instances
   - Auto-scaling
2. Add Redis for session management and caching
3. Implement database indexing for better query performance
4. Use connection pooling (already configured)

## Support

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

## Next Steps

After deployment:
1. Test all features thoroughly
2. Monitor performance and errors
3. Set up error tracking (e.g., Sentry)
4. Configure custom domain (if needed)
5. Set up monitoring and alerts
6. Plan for regular backups
