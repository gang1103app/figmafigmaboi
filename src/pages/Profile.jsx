import React from 'react'

export default function Profile() {
  // Client-side embedded data
  const userProfile = {
    name: 'Alex Chen',
    username: '@alexchen',
    avatar: '👤',
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    totalSavings: 450,
    co2Saved: 180,
    streak: 28,
    joinedDate: 'January 2024'
  }

  const achievements = [
    { id: 1, icon: '🥇', name: 'First Place', description: 'Reached #1 on leaderboard', unlocked: true },
    { id: 2, icon: '🔥', name: 'Hot Streak', description: '30-day consecutive streak', unlocked: false, progress: 28 },
    { id: 3, icon: '💯', name: 'Century Club', description: 'Saved $100 or more', unlocked: true },
    { id: 4, icon: '🌍', name: 'Planet Protector', description: 'Saved 200kg CO₂', unlocked: false, progress: 180 },
    { id: 5, icon: '⚡', name: 'Energy Expert', description: 'Complete 50 challenges', unlocked: true },
    { id: 6, icon: '👑', name: 'Eco Royalty', description: 'Reach level 20', unlocked: false, progress: 12 }
  ]

  const stats = [
    { label: 'Total Challenges', value: '12', icon: '🎯' },
    { label: 'Avg Daily Savings', value: '8.5 kWh', icon: '📊' },
    { label: 'Best Streak', value: '28 days', icon: '🔥' },
    { label: 'Rank Peak', value: '#1', icon: '🏆' }
  ]

  const ecoBuddy = {
    name: 'Sparky',
    emoji: '⚡',
    level: 8,
    mood: 'Excited',
    message: "Great job today! You're crushing your energy goals! 🌟"
  }

  const xpPercentage = (userProfile.xp / userProfile.xpToNext) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Profile & EcoBuddy</h1>
          <p className="text-slate-400">Your stats, achievements, and companion</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl">{userProfile.avatar}</div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
              <p className="text-slate-400 mb-2">{userProfile.username}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">Member since {userProfile.joinedDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-primary">Lvl {userProfile.level}</div>
              <div className="text-xs text-slate-400">Energy Master</div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">Experience</span>
              <span className="text-slate-400">{userProfile.xp} / {userProfile.xpToNext} XP</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-primary to-brand-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">${userProfile.totalSavings}</div>
              <div className="text-xs text-slate-400">Total Saved</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{userProfile.co2Saved}kg</div>
              <div className="text-xs text-slate-400">CO₂ Reduced</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">{userProfile.streak} 🔥</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
          </div>
        </div>

        {/* EcoBuddy Section */}
        <div className="bg-gradient-to-br from-brand-primary/20 to-brand-accent/10 backdrop-blur-sm rounded-xl p-6 border border-brand-primary/30 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{ecoBuddy.emoji}</div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{ecoBuddy.name}</h3>
                <span className="text-xs bg-brand-primary px-2 py-1 rounded-full">Lvl {ecoBuddy.level}</span>
                <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full">{ecoBuddy.mood}</span>
              </div>
              <p className="text-slate-200 mb-3">{ecoBuddy.message}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors">
                  Feed 🍎
                </button>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Play 🎮
                </button>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Customize 🎨
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`rounded-xl p-5 border transition-all ${
                  achievement.unlocked
                    ? 'bg-slate-800/50 border-brand-primary/50 hover:border-brand-primary'
                    : 'bg-slate-800/20 border-slate-700/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-white mb-1">{achievement.name}</h3>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                {achievement.unlocked ? (
                  <div className="text-xs text-brand-primary font-semibold">✓ Unlocked</div>
                ) : achievement.progress ? (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-400">{achievement.progress}/{achievement.progress === 28 ? 30 : achievement.progress === 180 ? 200 : 20}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                      <div 
                        className="bg-brand-primary h-full rounded-full"
                        style={{ width: `${(achievement.progress / (achievement.progress === 28 ? 30 : achievement.progress === 180 ? 200 : 20)) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">🔒 Locked</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings/Options */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Edit Profile</span>
                <span className="text-slate-400">→</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Notification Preferences</span>
                <span className="text-slate-400">→</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Privacy Settings</span>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
