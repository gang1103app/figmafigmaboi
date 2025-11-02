import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { user } = useAuth()
  const timeFilters = ['This Week', 'This Month', 'All Time']
  const [activeFilter, setActiveFilter] = React.useState('This Month')

  // In a real app, this would fetch leaderboard data from a backend
  // For now, we only show the current user
  const leaderboardData = user ? [
    { 
      rank: 1, 
      name: user.name || 'You', 
      points: user.points || 0, 
      savings: user.savings || 0, 
      badge: '⭐', 
      streak: user.streak || 0, 
      isUser: true 
    }
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-slate-400">Compete with other energy savers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {timeFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Info Message */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About Leaderboards</h3>
              <p className="text-slate-400 mb-2">
                The leaderboard shows rankings of energy savers competing for the top spots.
              </p>
              <p className="text-slate-400">
                To see global rankings and compete with other users, the app needs to be connected
                to a backend server. Currently, you can only see your own statistics.
              </p>
            </div>
          </div>
        </div>

        {/* Current User Stats */}
        {user && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center gap-4 p-4 bg-brand-primary/10 border-l-4 border-l-brand-primary">
              {/* Rank */}
              <div className="w-8 text-center">
                <div className="text-xl font-bold text-slate-400">#1</div>
              </div>

              {/* Badge */}
              <div className="text-3xl">⭐</div>

              {/* User Info */}
              <div className="flex-grow">
                <div className="font-semibold text-white flex items-center gap-2">
                  {user.name || 'You'}
                  <span className="text-xs bg-brand-primary px-2 py-0.5 rounded-full">You</span>
                </div>
                <div className="text-sm text-slate-400">
                  ${user.savings || 0} saved • 🔥 {user.streak || 0} day streak
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-xl font-bold text-brand-primary">{user.points || 0}</div>
                <div className="text-xs text-slate-400">points</div>
              </div>
            </div>
          </div>
        )}

        {/* User Stats Summary */}
        {user && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-slate-400 text-sm mb-1">Your Rank</div>
              <div className="text-2xl font-bold text-white">#1</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-slate-400 text-sm mb-1">Total Points</div>
              <div className="text-2xl font-bold text-brand-primary">{user.points || 0}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-slate-400 text-sm mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-orange-400">{user.streak || 0} 🔥</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-slate-400 text-sm mb-1">Total Savings</div>
              <div className="text-2xl font-bold text-green-400">${user.savings || 0}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
