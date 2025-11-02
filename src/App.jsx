import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavBottom from './components/NavBottom'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Challenges from './pages/Challenges'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <NavBottom />
      </div>
    </Router>
  )
}
