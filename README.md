# Energy Saving Teen — Full Stack App

This repository contains a full-featured Energy Saving Teen application with:

**Frontend:**
- React + Vite
- React Router for navigation
- Tailwind CSS (mobile-first)
- Chart.js with React Chart.js 2 for data visualization

**Backend (New in branch 1.3):**
- Node.js + Express API
- PostgreSQL database
- JWT authentication
- RESTful API endpoints

## Features

### 📊 Analytics Page
- Real-time energy usage tracking
- Weekly consumption charts
- Usage breakdown by category (heating, cooling, lighting, appliances)
- Key performance indicators (KPIs)
- Savings metrics and CO₂ impact

### 🏆 Leaderboard Page
- Global rankings of energy savers
- Points and savings comparison
- Streak tracking
- Podium display for top 3 users
- Filter by time period (week, month, all-time)

### ⚡ Challenges Page
- Active challenges with progress tracking
- Completed challenges history
- Upcoming challenges preview
- Points and rewards system
- Difficulty levels (Easy, Medium, Hard)

### 👤 Profile & EcoBuddy Page
- User profile with level and XP progression
- EcoBuddy companion (interactive pet)
- Achievements and badges
- Personal statistics
- Settings and preferences

### 🧭 Navigation
- Mobile-optimized bottom navigation bar
- Smooth transitions between pages
- Active route highlighting

## Local Development

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Build:
```bash
npm run build
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the backend server:
```bash
npm run dev
```

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

## Tech Stack

**Frontend:**
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3
- **Charts**: Chart.js 4 + React Chart.js 2

**Backend:**
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

## Project Structure

```
├── backend/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Database config
│   │   └── server.js       # Main server file
│   └── package.json
├── src/                     # Frontend (React + Vite)
│   ├── components/
│   │   ├── NavBottom.jsx   # Bottom navigation bar
│   │   ├── KpiCard.jsx     # Key performance indicator card
│   │   ├── ChartLine.jsx   # Line chart component
│   │   └── ChartPie.jsx    # Pie/doughnut chart component
│   ├── pages/
│   │   ├── Home.jsx        # Home dashboard
│   │   ├── Social.jsx      # Friends and activity
│   │   ├── Analytics.jsx   # Analytics dashboard
│   │   ├── Leaderboard.jsx # Global rankings
│   │   └── Tasks.jsx       # Challenges and tasks
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # App entry point
└── package.json
```

## Architecture

### Branch 1.3 - Full Stack Implementation

**Data Storage:**
- ✅ User data stored in **PostgreSQL database** (hosted on Render)
- ✅ Data persists across devices and browsers
- ✅ Full social features: friends, global leaderboards, activity feeds
- ✅ Secure authentication with JWT tokens

**Previous branches used localStorage (client-side only)**

### Features Enabled by Backend

1. **Real Friends System**: Add real users, see their activity
2. **Global Leaderboard**: Compete with all users, not just yourself
3. **Activity Feed**: See what your friends are achieving
4. **Cross-Device Sync**: Access your data from any device
5. **Secure Authentication**: Protected user accounts with encrypted passwords

## Design Reference

Design source: `Energy-Saving Teen App Prototype.make` (in repo root)

## Render Deployment Instructions

### Complete Deployment (Branch 1.3 - Full Stack)

#### 1. Deploy PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure database:
   - **Name**: energy-teen-db
   - **Database**: energy_teen
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. Copy the **Internal Database URL** - you'll need this

#### 2. Deploy Backend API

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: energy-teen-api
   - **Environment**: Node
   - **Branch**: `1.3`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (paste Internal Database URL from step 1)
   - `JWT_SECRET` = (generate a secure random string)
   - `FRONTEND_URL` = (will be your frontend URL - add after step 3)
5. Click "Create Web Service"
6. After deployment, open Shell and run: `npm run migrate`

#### 3. Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: energy-teen-app
   - **Branch**: `1.3`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = (your backend URL from step 2)
5. Click "Create Static Site"

#### 4. Update Backend Environment

Go back to your backend service and update `FRONTEND_URL` with your frontend URL from step 3.

### Legacy Deployment (Previous Branches)

Previous branches used localStorage and can be deployed as a static site only. See backend/README.md for migration instructions.

To enable social features (friends, global leaderboards, activity feeds), you'll need:

1. **Backend Server**: Create a Node.js/Express backend API
2. **Database**: Set up a PostgreSQL database on Render:
   - Create a new PostgreSQL database in Render
   - Store user accounts, friendships, and activity data
3. **Authentication**: Implement user authentication (JWT tokens recommended)
4. **API Integration**: Update the frontend to call backend APIs instead of using localStorage

This setup is not required for basic single-user functionality but is necessary for multi-user social features.

## Contributing

This is a demonstration project for the Energy Saving Teen app. For contributions or questions, please open an issue or pull request.

## License

Private repository - All rights reserved
