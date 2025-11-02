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
- **Client-side data**: All data is embedded in components for demonstration purposes
- **No backend required**: App runs entirely in the browser
- **Chart visualization**: Interactive charts using Chart.js
- **Smooth routing**: Client-side navigation with React Router
- **Modern design**: Dark theme with gradient backgrounds and glassmorphism effects

## Design Reference

Design source: `Energy-Saving Teen App Prototype.make` (in repo root)

## Future Enhancements

- Connect to real backend API for live data
- User authentication and authorization
- Real-time data synchronization
- Push notifications for challenges
- Social features (friends, sharing)
- Data export and reporting
- Advanced analytics and insights

## Deployment

### Quick Deploy to Render

This is a **frontend-only** static site with no backend required. To deploy:

1. Sign in to [Render](https://render.com) and create a new **Static Site**
2. Connect your GitHub repository (`gang1103app/figmafigmaboi`)
3. Configure the Static Site settings:
   - **Name**: `energy-teen-app` (or your preferred name)
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click "Create Static Site"
5. Wait 2-5 minutes for build and deployment
6. Access your live site at the provided Render URL

### Complete Deployment Guide

For detailed step-by-step instructions including:
- Screenshots and configuration details
- Troubleshooting common issues
- Custom domain setup
- Environment variables (for future backend integration)
- Adding a backend service to Render
- Cost estimation and monitoring

**See: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

### Important Notes

- ✅ **No backend required** - App runs entirely client-side
- ✅ **No database needed** - All data is embedded
- ✅ **No environment variables required**
- ✅ **Automatic deployments** on git push
- ✅ **Free tier available** on Render

## Contributing

This is a demonstration project for the Energy Saving Teen app. For contributions or questions, please open an issue or pull request.

## License

Private repository - All rights reserved
