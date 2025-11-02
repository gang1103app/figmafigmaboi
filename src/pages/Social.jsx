import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Social() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('friends')
  const [friendSearch, setFriendSearch] = useState('')
  const [friendUsername, setFriendUsername] = useState('')

  if (!user) return null

  // Get user's friends list (defaults to empty array)
  const userFriends = user.friends || []
  
  // Filter friends based on search
  const filteredFriends = userFriends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
    friend.username.toLowerCase().includes(friendSearch.toLowerCase())
  )

  // Get activity feed from friends
  const activityFeed = []

  // Handle adding a friend
  const handleAddFriend = () => {
    if (!friendUsername.trim()) return
    
    // In a real app, this would search for users in a database
    // For now, we just show a message
    alert('Friend request functionality requires a backend server. Currently, friends can only be added when the app is connected to a database.')
    setFriendUsername('')
  }

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
            Friends ({userFriends.length})
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

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {/* Search */}
            {userFriends.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <input
                  type="text"
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  placeholder="Search friends..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            )}

            {/* Friends List */}
            {filteredFriends.length > 0 ? (
              <div className="space-y-3">
                {filteredFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="text-5xl">{friend.avatar || '👤'}</div>
                        {friend.status && (
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                            friend.status === 'online' ? 'bg-green-400' : 'bg-slate-500'
                          }`} />
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="font-semibold text-white">{friend.name}</div>
                        <div className="text-sm text-slate-400">{friend.username}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>Level {friend.level || 1}</span>
                          <span>•</span>
                          <span>{friend.points || 0} pts</span>
                          {friend.streak > 0 && (
                            <>
                              <span>•</span>
                              <span>🔥 {friend.streak} days</span>
                            </>
                          )}
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
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Friends Yet</h3>
                <p className="text-slate-400 mb-4">
                  {friendSearch ? 'No friends match your search.' : 'Start connecting with other energy savers!'}
                </p>
                {!friendSearch && (
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors"
                  >
                    Add Friends
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {activityFeed.length > 0 ? (
              activityFeed.map(activity => (
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
              ))
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Activity Yet</h3>
                <p className="text-slate-400 mb-4">
                  Activity from your friends will appear here once you connect with other users.
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors"
                >
                  Add Friends
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Friends Tab */}
        {activeTab === 'add' && (
          <div className="space-y-6">
            {/* Add Friend Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-4">Add Friends</h3>
              <p className="text-slate-400 mb-4">
                Search for friends by username to send them a friend request.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={friendUsername}
                  onChange={(e) => setFriendUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="flex-grow px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                />
                <button
                  onClick={handleAddFriend}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Add Friend
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">ℹ️</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About Friends</h3>
                  <p className="text-slate-400 mb-2">
                    The friend system requires a backend database to store and manage user connections.
                  </p>
                  <p className="text-slate-400">
                    Currently, user data is stored locally in your browser. To enable the full social
                    experience with real friends, the app needs to be connected to a backend server.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
