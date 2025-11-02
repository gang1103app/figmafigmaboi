import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Challenges from './pages/Challenges'
import Profile from './pages/Profile'
import NavBottom from './components/NavBottom'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link to="/analytics" className="font-bold text-lg">EnergyTeen</Link>
          <nav className="hidden md:flex space-x-4 text-sm text-slate-600">
            <Link to="/analytics">Analytics</Link>
            <Link to="/challenges">Challenges</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <NavBottom />
    </div>
  )
}
