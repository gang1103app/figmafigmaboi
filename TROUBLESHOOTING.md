# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the EcoBuddy application.

## Table of Contents
- [Application Won't Start](#application-wont-start)
- [Signup/Login Fails](#signuplogin-fails)
- [Database Connection Issues](#database-connection-issues)
- [API Connection Issues](#api-connection-issues)
- [Build Failures](#build-failures)

## Application Won't Start

### Frontend Won't Start

**Symptom**: Running `npm run dev` fails or shows errors

**Solutions**:

1. **Missing dependencies**
   ```bash
   npm install
   ```

2. **Missing `.env` file**
   - Create `.env` in the root directory
   - Add:
     ```env
     VITE_API_URL=http://localhost:3001/api
     ```

3. **Port already in use**
   - Vite will automatically try another port
   - Or kill the process using the port:
     ```bash
     lsof -ti:5173 | xargs kill -9
     ```

### Backend Won't Start

**Symptom**: Running `npm run dev` in `backend/` fails

**Solutions**:

1. **Missing dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Missing `backend/.env` file**
   - Create `backend/.env`
   - Add required variables (see [Backend Setup](#backend-setup-checklist))

3. **Database connection failed**
   - Make sure PostgreSQL is running
   - Check DATABASE_URL is correct
   - See [Database Connection Issues](#database-connection-issues)

## Signup/Login Fails

### HTTP 400 Error

**Symptom**: "HTTP error! status: 400" or validation errors

**Causes & Solutions**:

1. **Validation failed**
   - Error message will show which field is invalid
   - Common issues:
     - Email format invalid
     - Username too short (min 3 characters)
     - Password too short (min 6 characters)
     - Username/email already exists

2. **Database tables don't exist**
   - Run database migration:
     ```bash
     cd backend
     npm run db:migrate
     ```

3. **Database not connected**
   - Check backend logs for database errors
   - Verify DATABASE_URL in `backend/.env`
   - Test connection: `curl http://localhost:3001/api/health`

### HTTP 503 Error

**Symptom**: "Service unavailable" or "Database not available"

**Solution**:
- Database is not connected
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `backend/.env`
- Check backend logs for specific error

### CORS Error

**Symptom**: "CORS policy" error in browser console

**Solutions**:

1. **Frontend URL not in CORS whitelist**
   - Add your frontend URL to `backend/.env`:
     ```env
     FRONTEND_URL=http://localhost:5173
     ```
   - For multiple URLs, separate with commas:
     ```env
     FRONTEND_URL=http://localhost:5173,https://your-app.onrender.com
     ```

2. **Restart backend after changing .env**
   ```bash
   cd backend
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Database Connection Issues

### Connection Refused

**Symptom**: "ECONNREFUSED" or "Connection refused"

**Solutions**:

1. **PostgreSQL not running**
   ```bash
   # Check if running
   pg_isready
   
   # Start PostgreSQL (Mac)
   brew services start postgresql@14
   
   # Start PostgreSQL (Linux)
   sudo systemctl start postgresql
   ```

2. **Wrong DATABASE_URL**
   - Format: `postgresql://username:password@hostname:port/database`
   - Example: `postgresql://postgres:mypassword@localhost:5432/energyteen`
   - Common mistakes:
     - Wrong username (try `postgres`)
     - Wrong password
     - Wrong port (default is `5432`)
     - Database doesn't exist

3. **Database doesn't exist**
   ```bash
   # Create database
   createdb energyteen
   
   # Or using psql
   psql -c "CREATE DATABASE energyteen;"
   ```

### Tables Don't Exist

**Symptom**: "relation does not exist" or "table does not exist"

**Solution**: Run migrations
```bash
cd backend
npm run db:migrate
```

**If migration fails**: Drop and recreate
```bash
# Drop all tables
psql energyteen -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migration
npm run db:migrate
```

### Authentication Failed

**Symptom**: "password authentication failed for user"

**Solution**:
- Verify PostgreSQL username and password
- Reset PostgreSQL password if needed
- Update DATABASE_URL in `backend/.env`

## API Connection Issues

### Cannot Reach API

**Symptom**: "Failed to fetch" or "Network error" in console

**Solutions**:

1. **Backend not running**
   - Start backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Verify it's running: `curl http://localhost:3001/api/health`

2. **Wrong API URL in frontend**
   - Check `.env` in root directory
   - Should be: `VITE_API_URL=http://localhost:3001/api`
   - **Important**: Restart frontend after changing `.env`

3. **Backend running on different port**
   - Check backend logs for actual port
   - Update VITE_API_URL accordingly

### 404 Not Found

**Symptom**: "404" errors when calling API

**Possible causes**:
- API endpoint doesn't exist
- Wrong endpoint URL
- Backend not fully started

**Check**:
- Backend logs show the request
- API health check works: `curl http://localhost:3001/api/health`

## Build Failures

### Frontend Build Fails

**Symptom**: `npm run build` fails

**Solutions**:

1. **Clear node_modules and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Check for syntax errors**
   - Build output will show which file has errors
   - Fix syntax errors in that file

3. **Environment variables not set**
   - Build needs VITE_API_URL set
   - Create `.env` with your API URL

### Backend Build/Start Fails

**Symptom**: Backend won't start or crashes

**Solutions**:

1. **Missing dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Syntax errors in code**
   - Check backend logs for error details
   - Fix the file mentioned in error

3. **Port already in use**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

## Backend Setup Checklist

Ensure your `backend/.env` file has all required variables:

```env
# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/energyteen

# JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here-change-in-production

# Server configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS (separate multiple URLs with commas)
FRONTEND_URL=http://localhost:5173
```

## Frontend Setup Checklist

Ensure your `.env` file (in root directory) has:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

## Quick Diagnostic Commands

```bash
# Check if PostgreSQL is running
pg_isready

# Check if backend is responding
curl http://localhost:3001/api/health

# Check if database exists
psql -l | grep energyteen

# Check if tables exist
psql energyteen -c "\dt"

# View backend logs
cd backend && npm run dev

# View frontend logs
npm run dev
```

## Still Having Issues?

1. **Check backend logs** - Most errors are logged in the backend console
2. **Check browser console** - Frontend errors appear in browser DevTools
3. **Verify all setup steps** - Review [QUICKSTART.md](./QUICKSTART.md)
4. **Check health endpoint** - `curl http://localhost:3001/api/health` should return database status
5. **Open an issue** - Include error messages and logs

## Common Error Messages Explained

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "HTTP error! status: 400" | Bad request - validation failed | Check error message for which field is invalid |
| "HTTP error! status: 401" | Not authenticated | Login again or check token |
| "HTTP error! status: 503" | Database not available | Check database connection and migrations |
| "CORS policy" | Frontend URL not allowed | Add frontend URL to backend FRONTEND_URL env var |
| "ECONNREFUSED" | Can't connect to database | Start PostgreSQL and verify DATABASE_URL |
| "relation does not exist" | Database table missing | Run `npm run db:migrate` in backend |
| "Failed to fetch" | Can't reach backend | Start backend and check VITE_API_URL |

## Production Deployment Issues

See [DEPLOY_TO_RENDER.md](./DEPLOY_TO_RENDER.md) for deployment-specific troubleshooting.
