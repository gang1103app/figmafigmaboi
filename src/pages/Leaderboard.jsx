import React from 'react'

export default function Leaderboard() {
  // Client-side embedded data
  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', points: 2450, savings: 142, badge: '🥇', streak: 28 },
    { rank: 2, name: 'Sarah Miller', points: 2380, savings: 138, badge: '🥈', streak: 25 },
    { rank: 3, name: 'Jordan Kim', points: 2290, savings: 131, badge: '🥉', streak: 22 },
    { rank: 4, name: 'You', points: 2150, savings: 124, badge: '⭐', streak: 18, isUser: true },
    { rank: 5, name: 'Emma Davis', points: 2080, savings: 119, badge: '⭐', streak: 15 },
    { rank: 6, name: 'Michael Brown', points: 1950, savings: 112, badge: '⭐', streak: 12 },
    { rank: 7, name: 'Lisa Wang', points: 1890, savings: 108, badge: '⭐', streak: 10 },
    { rank: 8, name: 'David Lee', points: 1820, savings: 104, badge: '⭐', streak: 8 }
  ]

  const timeFilters = ['This Week', 'This Month', 'All Time']
  const [activeFilter, setActiveFilter] = React.useState('This Month')

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

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {leaderboardData.slice(0, 3).map((user, idx) => (
            <div
              key={user.rank}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center ${
                idx === 0 ? 'order-2 md:scale-105' : idx === 1 ? 'order-1' : 'order-3'
              }`}
            >
              <div className="text-4xl mb-2">{user.badge}</div>
              <div className="font-semibold text-white mb-1">{user.name}</div>
              <div className="text-2xl font-bold text-brand-primary mb-1">{user.points}</div>
              <div className="text-xs text-slate-400">${user.savings} saved</div>
              <div className="mt-2 text-xs text-slate-500">🔥 {user.streak} days</div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          {leaderboardData.map(user => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-4 border-b border-slate-700/50 last:border-b-0 transition-colors ${
                user.isUser 
                  ? 'bg-brand-primary/10 border-l-4 border-l-brand-primary' 
                  : 'hover:bg-slate-700/30'
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                <div className="text-xl font-bold text-slate-400">#{user.rank}</div>
              </div>

              {/* Badge */}
              <div className="text-3xl">{user.badge}</div>

              {/* User Info */}
              <div className="flex-grow">
                <div className="font-semibold text-white flex items-center gap-2">
                  {user.name}
                  {user.isUser && (
                    <span className="text-xs bg-brand-primary px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  ${user.savings} saved • 🔥 {user.streak} day streak
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-xl font-bold text-brand-primary">{user.points}</div>
                <div className="text-xs text-slate-400">points</div>
              </div>
            </div>
          ))}
        </div>

        {/* User Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Your Rank</div>
            <div className="text-2xl font-bold text-white">#4</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Total Points</div>
            <div className="text-2xl font-bold text-brand-primary">2,150</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-orange-400">18 🔥</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">To Next Rank</div>
            <div className="text-2xl font-bold text-white">230</div>
          </div>
        </div>
      </div>
    </div>
  )
}
