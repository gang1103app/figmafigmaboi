# Quick Start Guide - Energy Teen App v1.4

This guide will help you get the Energy Teen App running locally with the full backend.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository (if not already done)
git clone https://github.com/gang1103app/figmafigmaboi.git
cd figmafigmaboi

# Checkout the 1.4 branch
git checkout 1.4

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up PostgreSQL Database

```bash
# Create a new database
createdb energyteen

# Or using psql
psql -c "CREATE DATABASE energyteen;"
```

### 3. Configure Backend Environment

Create a file `backend/.env` with the following content:

```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/energyteen
JWT_SECRET=change-this-to-a-random-secret-key
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `YOUR_USERNAME` with your PostgreSQL username (often `postgres`)
- `YOUR_PASSWORD` with your PostgreSQL password

**Generate a secure JWT_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use any random string (at least 32 characters)
```

### 4. Initialize Database

```bash
cd backend
npm run db:migrate
cd ..
```

You should see output confirming all tables were created:
```
✅ Users table created
✅ User progress table created
✅ EcoBuddy table created
✅ Achievements table created
✅ User achievements table created
✅ Challenges table created
✅ User challenges table created
✅ Energy usage table created
✅ Default achievements inserted
✅ Sample challenges inserted
✅ Database migration completed successfully!
```

### 5. Configure Frontend Environment

Create a file `.env` in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 6. Start the Application

You need to run both the backend and frontend in separate terminals.

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Energy Teen API server running on port 3001
📍 API available at http://localhost:3001
🏥 Health check: http://localhost:3001/api/health
```

**Terminal 2 - Frontend:**
```bash
# From the root directory
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 7. Access the Application

Open your browser and go to: **http://localhost:5173**

You should see the login page. Try these actions:

1. **Sign Up**: Create a new account
2. **Login**: Log in with your credentials
3. **Explore**: Your data is now saved in PostgreSQL!

## Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","message":"Energy Teen API is running","timestamp":"..."}
```

### Check Database Connection
```bash
# Connect to database
psql energyteen

# List tables
\dt

# View users (should be empty initially)
SELECT * FROM users;

# Exit
\q
```

## Common Issues

### Database Connection Failed

**Error:** `Connection refused` or `role does not exist`

**Solution:**
1. Make sure PostgreSQL is running:
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   
   # Start PostgreSQL (on Mac with Homebrew)
   brew services start postgresql
   
   # Start PostgreSQL (on Linux)
   sudo systemctl start postgresql
   ```

2. Verify your DATABASE_URL in `backend/.env`
3. Ensure the database exists: `psql -l` to list databases

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
# Edit backend/.env and set PORT=3002
```

### Frontend Can't Connect to Backend

**Error:** Network errors or CORS errors in browser console

**Solution:**
1. Verify backend is running on http://localhost:3001
2. Check `.env` file has `VITE_API_URL=http://localhost:3001/api`
3. Restart the frontend dev server after changing `.env`

### Migration Fails

**Error:** Tables already exist

**Solution:**
```bash
# Drop all tables and re-run migration
psql energyteen -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
cd backend && npm run db:migrate
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to React files reload automatically
- **Backend**: Using `npm run dev` watches for changes (Node 18+)

### View Backend Logs

Backend logs all requests:
```
2025-11-03T00:18:03.255Z - GET /api/health
2025-11-03T00:18:05.123Z - POST /api/auth/signup
```

### Database Tools

Use a GUI tool to view/edit database:
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **Postico** (Mac): https://eggerapps.at/postico/

### API Testing

Use these tools to test API endpoints:
- **curl**: Command line
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client**: VS Code extension

Example:
```bash
# Test signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Next Steps

- Read [backend/README.md](backend/README.md) for API documentation
- Read [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) for deployment guide
- Explore the code in `backend/src/` and `src/`
- Try creating challenges and tracking progress!

## Need Help?

- Check the detailed [README.md](README.md)
- Review [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) for Render deployment
- Open an issue on GitHub

## Summary

You now have:
✅ Backend API running on http://localhost:3001
✅ Frontend app running on http://localhost:5173
✅ PostgreSQL database with all tables
✅ User authentication with JWT
✅ Data persistence across sessions

Happy coding! 🚀⚡
