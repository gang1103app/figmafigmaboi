import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const SAMPLE_FRIENDS = [
  { id: 1, name: 'Sarah Miller', username: '@sarahmiller', level: 15, points: 2380, streak: 25, status: 'online', avatar: '👩' },
  { id: 2, name: 'Jordan Kim', username: '@jordankim', level: 14, points: 2290, streak: 22, status: 'online', avatar: '🧑' },
  { id: 3, name: 'Emma Davis', username: '@emmadavis', level: 12, points: 2080, streak: 15, status: 'offline', avatar: '👧' },
  { id: 4, name: 'Michael Brown', username: '@michaelbrown', level: 11, points: 1950, streak: 12, status: 'offline', avatar: '👦' }
]

const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    user: 'Sarah Miller',
    avatar: '👩',
    action: 'completed',
    target: 'Peak Hour Saver challenge',
    points: 200,
    time: '2 hours ago'
  },
  {
    id: 2,
    user: 'Jordan Kim',
    avatar: '🧑',
    action: 'reached',
    target: 'Level 14',
    points: null,
    time: '5 hours ago'
  },
  {
    id: 3,
    user: 'Emma Davis',
    avatar: '👧',
    action: 'earned',
    target: 'Hot Streak achievement',
    points: 150,
    time: '1 day ago'
  },
  {
    id: 4,
    user: 'Michael Brown',
    avatar: '👦',
    action: 'saved',
    target: '$50 this month',
    points: null,
    time: '1 day ago'
  }
]

export default function Social() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('friends')
  const [friendSearch, setFriendSearch] = useState('')

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Social</h1>
          <p className="text-slate-400">Connect with other energy savers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'friends'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Friends ({SAMPLE_FRIENDS.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity Feed
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'discover'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Discover
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <input
                type="text"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                placeholder="Search friends..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* Friends List */}
            <div className="space-y-3">
              {SAMPLE_FRIENDS.map(friend => (
                <div
                  key={friend.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="text-5xl">{friend.avatar}</div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        friend.status === 'online' ? 'bg-green-400' : 'bg-slate-500'
                      }`} />
                    </div>

                    <div className="flex-grow">
                      <div className="font-semibold text-white">{friend.name}</div>
                      <div className="text-sm text-slate-400">{friend.username}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>Level {friend.level}</span>
                        <span>•</span>
                        <span>{friend.points} pts</span>
                        <span>•</span>
                        <span>🔥 {friend.streak} days</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors">
                        Message
                      </button>
                      <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {SAMPLE_ACTIVITIES.map(activity => (
              <div
                key={activity.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{activity.avatar}</div>
                  <div className="flex-grow">
                    <p className="text-slate-200">
                      <span className="font-semibold text-white">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="text-brand-primary">{activity.target}</span>
                      {activity.points && (
                        <span className="text-yellow-400"> (+{activity.points} pts)</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{activity.time}</p>
                  </div>
                  <button className="text-slate-400 hover:text-brand-primary">
                    <span className="text-xl">👍</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Suggested Friends */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Suggested Friends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_FRIENDS.slice(0, 4).map(friend => (
                  <div
                    key={friend.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center"
                  >
                    <div className="text-5xl mb-2">{friend.avatar}</div>
                    <div className="font-semibold text-white">{friend.name}</div>
                    <div className="text-sm text-slate-400 mb-3">{friend.username}</div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-3">
                      <span>Level {friend.level}</span>
                      <span>•</span>
                      <span>{friend.points} pts</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors">
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Energy Savers */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Top Energy Savers This Week</h3>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                {SAMPLE_FRIENDS.map((friend, index) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 py-3 border-b border-slate-700/50 last:border-b-0"
                  >
                    <div className="text-2xl font-bold text-slate-400 w-8">#{index + 1}</div>
                    <div className="text-3xl">{friend.avatar}</div>
                    <div className="flex-grow">
                      <div className="font-semibold text-white">{friend.name}</div>
                      <div className="text-sm text-slate-400">
                        {friend.points} points • 🔥 {friend.streak} day streak
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
