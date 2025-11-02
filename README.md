# Energy Saving Teen — Dashboard App (Vite + React + Tailwind)

This repository contains a full-featured dashboard for the Energy Saving Teen app implemented with:
- React + Vite
- React Router for navigation
- Tailwind CSS (mobile-first)
- Chart.js with React Chart.js 2 for data visualization
- Client-side embedded data (no backend required)

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

## Local development

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

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3
- **Charts**: Chart.js 4 + React Chart.js 2
- **Data**: Client-side embedded (no API calls)

## Project Structure

```
src/
├── components/
│   ├── NavBottom.jsx       # Bottom navigation bar
│   ├── KpiCard.jsx         # Key performance indicator card
│   ├── ProgressBar.jsx     # Progress bar component
│   ├── ChartLine.jsx       # Line chart component
│   └── ChartPie.jsx        # Pie/doughnut chart component
├── pages/
│   ├── Analytics.jsx       # Analytics dashboard
│   ├── Leaderboard.jsx     # Rankings and competition
│   ├── Challenges.jsx      # Challenges and tasks
│   └── Profile.jsx         # User profile and EcoBuddy
├── App.jsx                 # Main app with routing
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## Notes about the implementation

- **Mobile-first**: Tailwind implementation optimized for mobile with responsive breakpoints
- **Client-side data**: All data is stored locally in the browser using localStorage
- **Data persistence**: User data persists between sessions in localStorage (no database needed for basic functionality)
- **No backend required**: App runs entirely in the browser for single-user functionality
- **Chart visualization**: Interactive charts using Chart.js
- **Smooth routing**: Client-side navigation with React Router
- **Modern design**: Dark theme with gradient backgrounds and glassmorphism effects

## Data Storage

The app stores user data locally in your browser using `localStorage`. This means:
- ✅ Your data persists between sessions
- ✅ No database setup required for basic app functionality
- ✅ Works completely offline after initial load
- ⚠️ Data is stored only in your browser (clearing browser data will delete your progress)
- ⚠️ Social features (friends, leaderboards) require a backend database to work across multiple users

## Design Reference

Design source: `Energy-Saving Teen App Prototype.make` (in repo root)

## Future Enhancements

To enable full multi-user functionality, the following features require a backend database:

- **Backend API**: Connect to a server for cross-user features
- **User authentication**: Secure login and account management
- **Real friends system**: Add and manage real user connections
- **Global leaderboards**: Compete with other real users
- **Activity feed**: See updates from your friends
- **Real-time data sync**: Synchronize data across devices
- **Energy monitoring**: Connect to smart home devices for real usage data
- **Push notifications**: Get notified about challenges and friend activities
- **Data export**: Export your energy data and reports

## Render Deployment Instructions

### Static Site Deployment (Current Version)

To deploy this static site to Render:

1. Sign in to Render and create a new Static Site
2. Connect your GitHub repository (`gang1103app/figmafigmaboi`)
3. Configure the Static Site settings:
   - **Name**: energy-teen-app (or your preferred name)
   - **Branch**: `main` (or your preferred branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click "Create" — Render will install, build, and publish your site
5. Enable automatic deploys to rebuild on PR merges

**Note**: The static deployment uses browser localStorage for data persistence. Each user's data is stored locally in their browser.

### Backend + Database Setup (For Multi-User Features)

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
