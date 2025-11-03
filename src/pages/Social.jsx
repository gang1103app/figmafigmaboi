import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Social() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [friends, setFriends] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'friends') {
        const response = await api.getFriends()
        setFriends(response.friends || [])
      } else if (activeTab === 'leaderboard') {
        const response = await api.getFriendsLeaderboard()
        setLeaderboard(response.leaderboard || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

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
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'friends'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Friends ({friends.length})
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-xl">Loading...</div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && !loading && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-4">
              <h3 className="text-lg font-semibold mb-2">Friends & You</h3>
              <p className="text-sm text-slate-400">
                See how you and your friends rank based on completed tasks and seeds earned
              </p>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-5xl mb-4">👥</div>
                <p className="mb-2">No leaderboard data yet</p>
                <p className="text-sm">Add friends and complete tasks to see rankings!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((person, index) => {
                  const isCurrentUser = person.id === user.id
                  const rank = index + 1
                  
                  return (
                    <div
                      key={person.id}
                      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-colors ${
                        isCurrentUser 
                          ? 'border-brand-primary/50 bg-brand-primary/10' 
                          : 'border-slate-700/50 hover:border-brand-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="w-12 text-center">
                          <div className={`text-2xl font-bold ${
                            rank === 1 ? 'text-yellow-400' :
                            rank === 2 ? 'text-slate-300' :
                            rank === 3 ? 'text-amber-600' :
                            'text-slate-400'
                          }`}>
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                          </div>
                        </div>

                        {/* EcoBuddy Preview */}
                        <div className="relative w-16 h-16">
                          <img 
                            src="/EcoBuddyTransparent_cropped.png" 
                            alt="EcoBuddy" 
                            className="w-full h-full object-contain opacity-80"
                          />
                          {person.mood === 'happy' && <div className="absolute top-0 right-0 text-lg">😊</div>}
                          {person.mood === 'excited' && <div className="absolute top-0 right-0 text-lg">🤩</div>}
                        </div>

                        {/* User Info */}
                        <div className="flex-grow">
                          <div className="font-semibold text-white flex items-center gap-2">
                            {person.name}
                            {isCurrentUser && (
                              <span className="text-xs bg-brand-primary px-2 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            @{person.username} • Level {person.level}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>✅ {person.completed_tasks || 0} tasks</span>
                            <span>•</span>
                            <span>🌱 {person.seeds || 0} seeds</span>
                            <span>•</span>
                            <span>🔥 {person.streak || 0} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && !loading && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-5xl mb-4">👥</div>
                <p className="mb-2">You haven't added any friends yet</p>
                <p className="text-sm">Connect with other EcoBuddy users to compare progress!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map(friend => (
                  <div
                    key={friend.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <img 
                          src="/EcoBuddyTransparent_cropped.png" 
                          alt="EcoBuddy" 
                          className="w-full h-full object-contain opacity-80"
                        />
                        {friend.mood === 'happy' && <div className="absolute top-0 right-0 text-lg">😊</div>}
                        {friend.mood === 'excited' && <div className="absolute top-0 right-0 text-lg">🤩</div>}
                      </div>

                      <div className="flex-grow">
                        <div className="font-semibold text-white">{friend.name}</div>
                        <div className="text-sm text-slate-400">@{friend.username}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>🌱 {friend.seeds || 0} seeds</span>
                          <span>•</span>
                          <span>🔥 {friend.streak || 0} days</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
