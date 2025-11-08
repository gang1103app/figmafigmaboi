import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import EnergySurvey from '../components/EnergySurvey'

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    daily: true,
    challenges: true,
    friends: false,
    achievements: true
  })
  const [showSurvey, setShowSurvey] = useState(false)
  const [survey, setSurvey] = useState(null)
  const [loadingSurvey, setLoadingSurvey] = useState(true)

  useEffect(() => {
    loadSurvey()
  }, [])

  const loadSurvey = async () => {
    try {
      const response = await api.getSurvey()
      setSurvey(response.survey)
    } catch (error) {
      console.error('Failed to load survey:', error)
    } finally {
      setLoadingSurvey(false)
    }
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSurveyComplete = async () => {
    setShowSurvey(false)
    await loadSurvey()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Energy Survey Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Energy Profile</h2>
          {showSurvey ? (
            <EnergySurvey 
              onComplete={handleSurveyComplete}
              onSkip={() => setShowSurvey(false)}
              existingSurvey={survey}
            />
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Energy Survey</div>
                    <div className="text-sm text-slate-400">
                      {survey 
                        ? `Completed - ${survey.location}, ${survey.state_code}` 
                        : 'Complete to see accurate energy savings calculations'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSurvey(true)}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors"
                  >
                    {survey ? 'Update' : 'Complete Survey'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-sm text-slate-400">{user.email}</div>
                </div>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Username</div>
                  <div className="text-sm text-slate-400">@{user.username}</div>
                </div>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Change
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Password</div>
                  <div className="text-sm text-slate-400">••••••••</div>
                </div>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Daily Reminders</div>
                  <div className="text-sm text-slate-400">Get reminded to check your energy usage</div>
                </div>
                <button
                  onClick={() => toggleNotification('daily')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.daily ? 'bg-brand-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.daily ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Challenge Updates</div>
                  <div className="text-sm text-slate-400">Notifications for new and completed challenges</div>
                </div>
                <button
                  onClick={() => toggleNotification('challenges')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.challenges ? 'bg-brand-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.challenges ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Friend Activity</div>
                  <div className="text-sm text-slate-400">Updates when friends complete challenges</div>
                </div>
                <button
                  onClick={() => toggleNotification('friends')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.friends ? 'bg-brand-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.friends ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Achievement Alerts</div>
                  <div className="text-sm text-slate-400">Get notified when you earn new achievements</div>
                </div>
                <button
                  onClick={() => toggleNotification('achievements')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.achievements ? 'bg-brand-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.achievements ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <button className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Profile Visibility</div>
                  <div className="text-sm text-slate-400">Public</div>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <button className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Activity Sharing</div>
                  <div className="text-sm text-slate-400">Friends only</div>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <button className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Data & Privacy</div>
                  <div className="text-sm text-slate-400">Manage your data</div>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <button className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Help & Support</div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <button className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Terms of Service</div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <button className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Privacy Policy</div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <div className="p-4 text-left">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">Version</div>
                <div className="text-sm text-slate-400">1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-500/30 overflow-hidden">
            <button 
              onClick={handleLogout}
              className="w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-red-400">Sign Out</div>
                <span className="text-slate-400">→</span>
              </div>
            </button>

            <button className="w-full p-4 text-left hover:bg-red-500/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="font-medium text-red-400">Delete Account</div>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
