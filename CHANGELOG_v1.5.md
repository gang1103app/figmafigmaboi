# EcoBuddy v1.5 - Complete Overhaul Changelog

## Release Date
Branch: `1.5`

## Overview
EcoBuddy v1.5 represents a complete overhaul of the energy-saving app with a focus on authenticity, backend integration, and improved user experience. All fake data has been removed, and the app now provides a genuine progression system with seeds-based rewards.

---

## 🎨 Branding Changes

### App Rename
- **Changed:** "Energy Saving Teen" → "EcoBuddy"
- **Updated:** All references throughout codebase
- **Package Names:**
  - Frontend: `ecobuddy@1.5.0`
  - Backend: `ecobuddy-backend@1.5.0`
- **HTML Title:** "EcoBuddy - Your Energy Saving Companion"
- **README:** Comprehensive rebranding with v1.5 feature list

---

## 🌱 Seeds Currency System

### New Currency
- **Replaced:** Points system with Seeds (🌱)
- **Purpose:** More thematic currency for energy-saving app
- **Usage:**
  - Earned by completing challenges
  - Spent on EcoBuddy accessories
  - Displayed throughout UI with seed emoji

### Database Schema
- Added `seeds` field to `user_progress` table
- Backend API endpoints updated to handle seeds
- Frontend updated to display and track seeds

---

## 🔥 Streak Tracking System

### Automatic Streak Calculation
- **Feature:** Tracks consecutive daily logins
- **Implementation:**
  - Added `last_login_date` to `user_progress` table
  - Created `User.updateStreak()` method
  - Automatic update on each login
  - Displays current streak on homepage

### Streak Logic
- Increments by 1 for consecutive daily logins
- Resets to 1 if login missed
- Tracks best streak (all-time high)
- Visible with 🔥 fire emoji

---

## 👥 Friends & Social Features

### Friends System
- **New Table:** `user_friends` with status tracking
- **API Endpoints:**
  - `GET /user/friends` - List friends
  - `POST /user/friends/add` - Add friend
  - `DELETE /user/friends/:friendId` - Remove friend
  
### Friends Leaderboard
- **Endpoint:** `GET /user/leaderboard/friends`
- **Features:**
  - Shows user + friends only
  - Displays completed tasks count
  - Shows seeds earned
  - Displays current streak
  - Shows friends' EcoBuddy mascots
  
### Social Page Redesign
- Removed all fake/sample friends
- New users start with empty friends list
- Leaderboard tab showing real progress
- Friends tab for managing connections

---

## ⚡ Challenges System Overhaul

### Completable Challenges
- **Fixed:** Challenges are now actually completable
- **Features:**
  - Progress tracking with visual bar
  - "Mark Progress +1" button
  - "Complete & Claim Seeds" button when target reached
  - Seeds automatically awarded on completion

### Challenge Progress
- Real-time progress updates via API
- Status tracking: `active`, `completed`
- Completion date recorded
- Seeds earned tracked per challenge

### UI Improvements
- Category-based icons (💡 🌡️ 🔌 💧)
- Difficulty badges (Easy/Medium/Hard)
- Available challenges to start
- Clean separation of active vs completed

---

## 🏠 Home Page - EcoBuddy Mascot

### Visual Updates
- **Changed:** Emoji (⚡) → EcoBuddy transparent image
- **File:** `public/EcoBuddyTransparent_cropped.png`
- **Size:** 256x256 pixel display container

### Accessories System
- **New Accessories:**
  - Sunglasses (🕶️) - 150 seeds - Positioned on eyes (28% from top)
  - Top Hat (🎩) - 250 seeds - Positioned on head (10% from top)
  - Crown (👑) - 300 seeds - Positioned on head (8% from top)
  - Scarf (🧣) - 120 seeds - Positioned on neck (55% from top)

### Accessory Features
- Overlay positioning system
- Multiple accessories can be worn simultaneously
- Purchase with seeds in shop
- Persist in database (`user_ecobuddy.accessories` JSONB field)

### Stats Display
- Level (from user progress)
- Seeds count with 🌱 emoji
- Total savings (real data)
- Daily streak with 🔥 emoji

---

## 📊 Analytics Page Improvements

### Real Data Only
- **Removed:** All fake usage data
- **New Users:** Start with zeros across all metrics
- **Data Source:** Actual completed tasks and recorded energy usage

### Dynamic Charts
- Weekly energy usage (last 7 days)
- Category breakdown (heating, cooling, lighting, appliances, other)
- Empty state messages when no data available
- Calculated trends based on actual data

### KPI Cards
- Today's usage (from actual records)
- Total savings (from user progress)
- CO₂ saved (from user progress)
- Average daily usage (calculated)

---

## 🗄️ Backend Changes

### Database Schema Updates

#### New Fields
- `user_progress.seeds` - Seeds currency
- `user_progress.last_login_date` - For streak tracking
- `user_ecobuddy.name` default changed to 'EcoBuddy'

#### New Tables
```sql
user_friends (
  id, user_id, friend_id, status, created_at
)
```

#### New Indexes (Performance)
- `idx_user_friends_user_id`
- `idx_user_friends_friend_id`
- `idx_user_challenges_user_id`
- `idx_energy_usage_user_date`

### New API Endpoints

#### Streak Management
- `POST /user/streak/update` - Update and calculate streak

#### Friends Management
- `GET /user/friends` - List all friends
- `POST /user/friends/add` - Add new friend
- `DELETE /user/friends/:friendId` - Remove friend
- `GET /user/leaderboard/friends` - Get friends leaderboard

#### Challenge Progress
- `PATCH /user/challenges/:id/progress` - Update progress
- `POST /user/challenges/:id/complete` - Complete challenge

### Data Integrity
- Challenge ID structure standardized (`challenge_id` field)
- Proper foreign key relationships
- Cascade deletes for user data cleanup

---

## 🧹 Removed/Cleaned Up

### Fake Data Removed
- ❌ Sample friends on Social page
- ❌ Default completed challenges
- ❌ Fake analytics data
- ❌ Pre-populated stats for new users
- ❌ Mock energy usage history

### Code Cleanup
- Removed `Challenges.jsx` (duplicate of Tasks.jsx)
- Removed backup files (_old.jsx)
- Standardized component structure
- Consistent API integration

---

## 🔧 Technical Improvements

### Frontend
- TypeScript-ready prop structures
- Consistent error handling
- Loading states for async operations
- Proper React hooks usage
- Optimized re-renders

### Backend
- Input validation with express-validator
- Rate limiting on write operations
- Proper error responses
- Transaction support for data consistency
- Connection pooling for PostgreSQL

### Security
- ✅ No CodeQL vulnerabilities
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- SQL injection prevention (parameterized queries)

---

## 🎯 User Experience Improvements

### New User Experience
1. Sign up → Clean slate (all zeros)
2. No fake data or pre-populated stats
3. Start first challenge
4. Complete challenge → Earn first seeds
5. Buy first accessory for EcoBuddy
6. Build daily login streak

### Existing User Migration
- Seeds field defaults to 0 (can be migrated from old points)
- Existing challenges maintain progress
- Accessories preserved
- Streak resets on first login to v1.5

---

## 📝 Documentation Updates

### README.md
- Updated app name and description
- New v1.5 features section
- Seeds system explanation
- Streak tracking details
- Updated deployment guides

### API Documentation
- New endpoints documented
- Request/response examples
- Error codes and messages
- Rate limiting information

---

## 🚀 Deployment Notes

### Environment Variables
No new environment variables required - existing `.env` setup works.

### Database Migration
Run the migration to create new tables and indexes:
```bash
cd backend
npm run db:migrate
```

### Breaking Changes
- Points → Seeds (field name change)
- Challenge object structure includes `challenge_id`
- Friends endpoints require authentication

---

## 🐛 Bug Fixes

### Fixed Issues
1. **Challenge Completion:** Challenges can now actually be completed
2. **Data Persistence:** All user data (seeds, accessories, streak) persists correctly
3. **Streak Calculation:** Proper timezone-agnostic date comparison
4. **Accessory Positioning:** Properly overlaid on EcoBuddy image
5. **Challenge ID Ambiguity:** Standardized to always use `challenge_id`

---

## 📊 Performance Optimizations

### Database
- Added indexes on frequently queried columns
- Optimized JOIN queries for leaderboard
- Reduced N+1 query problems
- Connection pooling configured

### Frontend
- Image optimization for EcoBuddy mascot
- Lazy loading for charts
- Debounced API calls
- Cached static assets

---

## 🔮 Future Improvements (Not in v1.5)

### Potential Enhancements
- Push notifications for streak reminders
- Friend requests (vs. instant add)
- Challenge recommendations based on behavior
- Energy usage data entry UI
- Timezone support for streak calculation
- Multiplayer challenges
- Global leaderboard (beyond friends)
- Achievement badges

---

## 👥 Credits

Developed for EcoBuddy v1.5
- Backend: Express.js + PostgreSQL
- Frontend: React + Vite + Tailwind CSS
- Mascot: EcoBuddy transparent cropped image

---

## 📄 License

Private repository - All rights reserved
