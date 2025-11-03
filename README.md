# Energy Saving Teen — Dashboard App (Vite + React + Tailwind + Backend)

This repository contains a full-featured dashboard for the Energy Saving Teen app implemented with:
- React + Vite (Frontend)
- React Router for navigation
- Tailwind CSS (mobile-first)
- Chart.js with React Chart.js 2 for data visualization
- **Express.js + PostgreSQL Backend (NEW in v1.4)**
- **User Authentication & Data Persistence**

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

### Frontend Only (Client-side mode)

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

4. Preview production build locally:
```bash
npm run preview
```

### Full Stack Development (Frontend + Backend)

#### Backend Setup

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Set up PostgreSQL database:
```bash
createdb energyteen
```

3. Create `.env` file in `backend/` directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/energyteen
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

#### Frontend Setup

1. Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

Now you can signup/login and all data will be saved to the database!

## Tech Stack

### Frontend
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3
- **Charts**: Chart.js 4 + React Chart.js 2

### Backend (v1.4+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

## Project Structure

```
├── backend/                 # Backend API (v1.4+)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js  # PostgreSQL configuration
│   │   │   └── migrate.js   # Database migrations
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT authentication
│   │   ├── models/
│   │   │   └── User.js      # User data model
│   │   ├── routes/
│   │   │   ├── auth.js      # Auth endpoints
│   │   │   └── user.js      # User endpoints
│   │   └── server.js        # Express server
│   ├── package.json
│   └── README.md
│
├── src/                     # Frontend
│   ├── components/
│   │   ├── NavBottom.jsx    # Bottom navigation bar
│   │   ├── KpiCard.jsx      # Key performance indicator card
│   │   ├── ProgressBar.jsx  # Progress bar component
│   │   ├── ChartLine.jsx    # Line chart component
│   │   └── ChartPie.jsx     # Pie/doughnut chart component
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Signup page
│   │   ├── Home.jsx         # Home dashboard
│   │   ├── Analytics.jsx    # Analytics page
│   │   ├── Leaderboard.jsx  # Rankings page
│   │   ├── Tasks.jsx        # Challenges page
│   │   └── Profile.jsx      # User profile page
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
│
├── BACKEND_DEPLOYMENT.md    # Backend deployment guide
├── render.yaml              # Render deployment config
└── package.json
```

## Features (v1.4)

✅ **User Authentication**
- Secure signup and login with JWT
- Password hashing with bcrypt
- Session management

✅ **Data Persistence**
- PostgreSQL database
- User profiles saved permanently
- Progress tracking across sessions

✅ **Real Backend API**
- RESTful API endpoints
- User progress updates
- Challenge management
- Leaderboard functionality
- Energy usage tracking

✅ **Production Ready**
- Deployable to Render
- Environment variable configuration
- CORS protection
- Input validation

## Design Reference

Design source: `Energy-Saving Teen App Prototype.make` (in repo root)
- Push notifications for challenges
- Social features (friends, sharing)
- Data export and reporting
- Advanced analytics and insights

## Deployment

### Full Stack Deployment to Render (v1.4+)

The application now requires both frontend and backend deployment with a PostgreSQL database.

#### Quick Deploy with render.yaml

1. Sign in to [Render](https://render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository (`gang1103app/figmafigmaboi`)
4. Select branch `1.4`
5. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Backend API service
   - Frontend static site
6. Set the environment variables manually:
   - Backend: `FRONTEND_URL` (after frontend deploys)
   - Frontend: `VITE_API_URL` (after backend deploys)
7. Trigger redeploy after setting environment variables

#### Manual Deployment

For detailed step-by-step instructions, see:

**📖 [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md)** - Complete backend deployment guide with:
- PostgreSQL database setup
- Backend API deployment
- Database migration instructions
- Environment variable configuration
- Troubleshooting and monitoring

**📋 [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Frontend deployment guide

**📝 [backend/README.md](./backend/README.md)** - Backend API documentation

### Deployment Architecture

```
┌─────────────────┐
│   Frontend      │  Static Site (Vite + React)
│   Render        │  https://your-app.onrender.com
└────────┬────────┘
         │
         │ HTTPS API Calls
         ▼
┌─────────────────┐
│   Backend API   │  Node.js + Express
│   Render        │  https://your-api.onrender.com
└────────┬────────┘
         │
         │ PostgreSQL Connection
         ▼
┌─────────────────┐
│   Database      │  PostgreSQL
│   Render        │  Managed Database
└─────────────────┘
```

### Important Notes (v1.4+)

- ⚠️ **Backend required** - App needs API to function
- ⚠️ **Database required** - PostgreSQL for data persistence
- ⚠️ **Environment variables required** - Set API URLs
- ✅ **Automatic deployments** on git push to branch `1.4`
- ✅ **Free tier available** on Render (with limitations)
- ✅ **Secure authentication** with JWT tokens
- ✅ **Data persistence** across sessions

## Contributing

This is a demonstration project for the Energy Saving Teen app. For contributions or questions, please open an issue or pull request.

## License

Private repository - All rights reserved
