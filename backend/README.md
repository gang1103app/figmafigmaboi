# Energy Teen Backend API

Backend API for the Energy Saving Teen application, built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Profiles**: Manage user data, XP, points, savings, and EcoBuddy
- **Friends System**: Send/accept friend requests, view friends list
- **Activity Feed**: See what your friends are doing
- **Leaderboard**: Global rankings with timeframe filters
- **Energy Tracking**: Store and retrieve energy usage data

## Tech Stack

- **Node.js** & **Express**: Server framework
- **PostgreSQL**: Database (hosted on Render)
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=your_secure_random_string_here
FRONTEND_URL=http://localhost:5173
```

### 3. Set Up PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "PostgreSQL"
3. Configure your database:
   - **Name**: energy-teen-db (or your choice)
   - **Database**: energy_teen
   - **User**: (Render generates this)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for development
4. Click "Create Database"
5. Copy the **Internal Database URL** from the database page
6. Paste it into your `.env` file as `DATABASE_URL`

### 4. Run Database Migrations

```bash
npm run migrate
```

This creates all necessary tables:
- `users` - User accounts and profiles
- `friendships` - Friend connections
- `activities` - Activity feed events
- `achievements` - User achievements
- `energy_usage` - Energy consumption data
- `user_tasks` - Challenges and tasks

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Users

- `PUT /api/users/profile` - Update user profile (requires auth)
- `GET /api/users/search?query=username` - Search users (requires auth)
- `GET /api/users/:userId` - Get user profile (requires auth)

### Friends

- `POST /api/friends/request` - Send friend request (requires auth)
- `PUT /api/friends/accept/:friendshipId` - Accept friend request (requires auth)
- `GET /api/friends` - Get friends list (requires auth)
- `GET /api/friends/pending` - Get pending requests (requires auth)
- `DELETE /api/friends/:friendId` - Remove friend (requires auth)
- `GET /api/friends/activity` - Get activity feed (requires auth)

### Leaderboard

- `GET /api/leaderboard?timeframe=all|week|month` - Get leaderboard (requires auth)
- `GET /api/leaderboard/rank` - Get user's rank (requires auth)

## Authentication

Include JWT token in request headers:

```
Authorization: Bearer <your_jwt_token>
```

## Deploy to Render

### 1. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: energy-teen-api
   - **Environment**: Node
   - **Region**: Same as your database
   - **Branch**: 1.3
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Add Environment Variables

In the Render dashboard, add these environment variables:

- `NODE_ENV` = `production`
- `DATABASE_URL` = (Use "Internal Database URL" from your PostgreSQL service)
- `JWT_SECRET` = (Generate a secure random string)
- `FRONTEND_URL` = (Your frontend URL on Render)

### 3. Deploy

Click "Create Web Service" and Render will:
1. Install dependencies
2. Start the server
3. Provide you with a URL (e.g., `https://energy-teen-api.onrender.com`)

### 4. Run Migrations

After deployment, run migrations using Render Shell:
1. Go to your web service in Render
2. Click "Shell" in the sidebar
3. Run: `npm run migrate`

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using Postman

1. Import the API endpoints
2. Create an environment with `baseUrl` = `http://localhost:5000`
3. After login, save the token and use it in Authorization header

## Database Schema

### users
- `id` - Primary key
- `email` - Unique email
- `username` - Unique username
- `name` - Full name
- `password_hash` - Hashed password
- `level`, `xp`, `points` - Gamification data
- `savings`, `co2_saved`, `streak` - Energy metrics
- `ecobuddy_*` - EcoBuddy companion data

### friendships
- `id` - Primary key
- `user_id` - User who sent request
- `friend_id` - User who received request
- `status` - pending/accepted
- Constraint: Cannot befriend yourself

### activities
- `id` - Primary key
- `user_id` - User who performed action
- `action` - Action type (completed, reached, earned)
- `target` - Target description
- `points` - Points earned (optional)

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- CORS is configured to only allow requests from your frontend
- SQL injection is prevented using parameterized queries
- All user endpoints require authentication

## Troubleshooting

**Database connection fails:**
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL service is running on Render
- Verify firewall/network settings

**Migrations fail:**
- Ensure database is accessible
- Check if tables already exist
- Review migration logs for specific errors

**CORS errors:**
- Update `FRONTEND_URL` in `.env`
- Ensure frontend URL matches exactly (no trailing slash)

## License

Private repository - All rights reserved
