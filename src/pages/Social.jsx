import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Social() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [friends, setFriends] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchForUsers()
      } else {
        setSearchResults([])
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

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

  const searchForUsers = async () => {
    setSearching(true)
    try {
      const response = await api.searchUsers(searchQuery)
      setSearchResults(response.users || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleAddFriend = async (friendId) => {
    try {
      await api.addFriend(friendId)
      // Reload friends list
      await loadData()
      // Clear search
      setSearchQuery('')
      setSearchResults([])
    } catch (error) {
      console.error('Failed to add friend:', error)
      alert(error.message || 'Failed to add friend')
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
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'add'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Friends
          </button>
        </div>

        {loading && activeTab !== 'add' && (
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
                  const accessories = person.accessories ? JSON.parse(person.accessories) : []
                  
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
                          {accessories.includes('glasses') && (
                            <img src="/glasses.png" alt="Glasses" className="absolute top-[28%] left-1/2 transform -translate-x-1/2" style={{ width: '20px', height: '12px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('tophat') && (
                            <img src="/tophat.png" alt="Top Hat" className="absolute top-[10%] left-1/2 transform -translate-x-1/2" style={{ width: '16px', height: '14px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('crown') && (
                            <img src="/crown.png" alt="Crown" className="absolute top-[8%] left-1/2 transform -translate-x-1/2" style={{ width: '18px', height: '14px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('collar') && (
                            <img src="/collar.png" alt="Collar" className="absolute top-[55%] left-1/2 transform -translate-x-1/2" style={{ width: '23px', height: '10px', objectFit: 'contain' }} />
                          )}
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
                {friends.map(friend => {
                  const accessories = friend.accessories ? JSON.parse(friend.accessories) : []
                  
                  return (
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
                          {accessories.includes('glasses') && (
                            <img src="/glasses.png" alt="Glasses" className="absolute top-[28%] left-1/2 transform -translate-x-1/2" style={{ width: '20px', height: '12px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('tophat') && (
                            <img src="/tophat.png" alt="Top Hat" className="absolute top-[10%] left-1/2 transform -translate-x-1/2" style={{ width: '16px', height: '14px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('crown') && (
                            <img src="/crown.png" alt="Crown" className="absolute top-[8%] left-1/2 transform -translate-x-1/2" style={{ width: '18px', height: '14px', objectFit: 'contain' }} />
                          )}
                          {accessories.includes('collar') && (
                            <img src="/collar.png" alt="Collar" className="absolute top-[55%] left-1/2 transform -translate-x-1/2" style={{ width: '23px', height: '10px', objectFit: 'contain' }} />
                          )}
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
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Friends Tab */}
        {activeTab === 'add' && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Search for Friends</h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or name..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            {searching && (
              <div className="text-center py-8 text-slate-400">
                Searching...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map(result => {
                  const isFriend = friends.some(f => f.id === result.id)
                  
                  return (
                    <div
                      key={result.id}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <img 
                            src="/EcoBuddyTransparent_cropped.png" 
                            alt="EcoBuddy" 
                            className="w-full h-full object-contain opacity-80"
                          />
                        </div>

                        <div className="flex-grow">
                          <div className="font-semibold text-white">{result.name}</div>
                          <div className="text-sm text-slate-400">@{result.username} • Level {result.level}</div>
                        </div>

                        <button
                          onClick={() => handleAddFriend(result.id)}
                          disabled={isFriend}
                          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isFriend ? 'Friends ✓' : 'Add Friend'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-5xl mb-4">🔍</div>
                <p>No users found matching "{searchQuery}"</p>
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-5xl mb-4">👥</div>
                <p className="mb-2">Search for friends to add</p>
                <p className="text-sm">Enter at least 2 characters to search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
