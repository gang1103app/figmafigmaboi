# Energy Teen Backend API

Backend API for the Energy Teen App with user authentication, progress tracking, and data persistence.

## Features

- 🔐 **User Authentication**: JWT-based signup, login, and session management
- 👤 **User Profiles**: Complete user profile with progress tracking
- 🏆 **Achievements System**: Track and unlock achievements
- ⚡ **Challenges**: Start, track, and complete energy-saving challenges
- 📊 **Energy Analytics**: Log and retrieve energy usage data
- 🥇 **Leaderboard**: Global rankings based on points and savings
- 🦸 **EcoBuddy**: Customizable companion with level progression
- 💾 **PostgreSQL Database**: Persistent data storage

## Tech Stack

- **Node.js** with ES modules
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Local Development Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/energyteen
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Create database**:
   ```bash
   # Using psql
   createdb energyteen
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```
   
   This will create all necessary tables and seed initial data.

5. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The API will be available at `http://localhost:3001`

6. **Test the API**:
   ```bash
   # Health check
   curl http://localhost:3001/api/health
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user (requires auth)

### User Profile & Progress

- `GET /api/user/profile` - Get full user profile with progress, achievements, and challenges
- `PATCH /api/user/progress` - Update user progress (level, XP, points, savings, etc.)
- `PATCH /api/user/ecobuddy` - Update EcoBuddy settings

### Challenges

- `GET /api/user/challenges/available` - Get available challenges
- `POST /api/user/challenges/:id/start` - Start a challenge
- `PATCH /api/user/challenges/:id/progress` - Update challenge progress
- `POST /api/user/challenges/:id/complete` - Complete a challenge

### Leaderboard

- `GET /api/user/leaderboard` - Get global leaderboard

### Energy Usage

- `POST /api/user/energy-usage` - Log energy usage
- `GET /api/user/energy-usage` - Get energy usage history

### Health Check

- `GET /api/health` - API health status

## Database Schema

### Tables

- **users** - User accounts (email, username, password_hash, name)
- **user_progress** - User progress data (level, XP, points, savings, streak)
- **user_ecobuddy** - EcoBuddy companion data
- **achievements** - Available achievements
- **user_achievements** - Unlocked achievements per user
- **challenges** - Available challenges
- **user_challenges** - User challenge progress
- **energy_usage** - Daily energy usage logs

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Login or signup returns a JWT token
2. Include the token in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```
3. Tokens expire after 7 days

## Example API Usage

### Signup

```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Alex Chen",
  "username": "alexchen",
  "email": "alex@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "alex@example.com",
    "username": "alexchen",
    "name": "Alex Chen"
  }
}
```

### Login

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Get Profile

```javascript
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "profile": {
    "id": 1,
    "email": "alex@example.com",
    "username": "alexchen",
    "name": "Alex Chen",
    "level": 1,
    "xp": 0,
    "points": 0,
    "totalSavings": 0,
    "co2Saved": 0,
    "streak": 0,
    "ecobuddy": { ... },
    "achievements": [ ... ],
    "challenges": [ ... ]
  }
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run db:migrate` - Run database migrations

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `NODE_ENV` | Environment (development/production) | No | development |
| `PORT` | Server port | No | 3001 |
| `FRONTEND_URL` | Frontend URL(s) for CORS. For multiple URLs, separate with commas (e.g., `http://localhost:5173,https://app.onrender.com`). Must match origin exactly. | No | http://localhost:5173 |

## Security

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 7 days
- CORS is configured to only allow requests from the frontend URL
- SQL injection protection via parameterized queries
- Input validation on all endpoints using express-validator

### CORS Configuration

The backend enforces CORS (Cross-Origin Resource Sharing) to prevent unauthorized access. Starting in v1.6, detailed logging helps diagnose CORS issues:

**On server startup**, you'll see:
```
🔒 CORS allowed origins: [ 'http://localhost:5173' ]
```

**When an origin is rejected**, you'll see:
```
❌ CORS rejected origin: https://your-app.onrender.com
   Allowed origins: http://localhost:5173
   To fix: Set FRONTEND_URL environment variable to include: https://your-app.onrender.com
```

**To configure CORS**:
1. Set `FRONTEND_URL` in your `.env` file
2. For multiple origins, separate with commas (no spaces after commas)
3. The origin must match exactly (including `http://` or `https://`)
4. Do NOT include trailing slashes

For more CORS troubleshooting, see [TROUBLESHOOTING.md](../TROUBLESHOOTING.md#cors-error).

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (valid token but insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Deployment

See [BACKEND_DEPLOYMENT.md](../BACKEND_DEPLOYMENT.md) for detailed deployment instructions on Render.

## Testing

To test the API locally:

1. Start the server: `npm run dev`
2. Use a tool like Postman, Insomnia, or curl
3. Or test via the frontend application

## License

Private repository - All rights reserved
