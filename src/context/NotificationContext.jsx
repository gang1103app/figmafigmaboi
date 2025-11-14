import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import notificationService from '../services/notificationService'
import api from '../services/api'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [notificationSettings, setNotificationSettings] = useState({
    daily: true,
    friends: true,
    leaderboard: true,
    achievements: true
  })
  const [lastLeaderboardPosition, setLastLeaderboardPosition] = useState(null)
  const [hasLoggedInToday, setHasLoggedInToday] = useState(false)

  // Check if user has logged in today
  useEffect(() => {
    if (isAuthenticated && user) {
      const today = new Date().toDateString()
      const lastLogin = localStorage.getItem('lastLoginDate')
      setHasLoggedInToday(lastLogin === today)
      
      // Mark as logged in today
      localStorage.setItem('lastLoginDate', today)
    }
  }, [isAuthenticated, user])

  // Set up daily reminder check (after 6 PM)
  useEffect(() => {
    if (!isAuthenticated || !notificationSettings.daily) return

    const checkDailyReminder = () => {
      const now = new Date()
      const hour = now.getHours()
      
      // Check if it's after 6 PM (18:00) and user hasn't logged in today
      if (hour >= 18 && !hasLoggedInToday) {
        const lastReminderDate = localStorage.getItem('lastDailyReminder')
        const today = new Date().toDateString()
        
        // Only send one reminder per day
        if (lastReminderDate !== today) {
          notificationService.notifyDailyReminder()
          localStorage.setItem('lastDailyReminder', today)
        }
      }
    }

    // Check immediately
    checkDailyReminder()

    // Check every hour
    const interval = setInterval(checkDailyReminder, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, hasLoggedInToday, notificationSettings.daily])

  // Poll for leaderboard changes
  useEffect(() => {
    if (!isAuthenticated || !notificationSettings.leaderboard || !user) return

    const checkLeaderboardPosition = async () => {
      try {
        const response = await api.getLeaderboard()
        const myPosition = response.leaderboard.findIndex(entry => entry.id === user.id) + 1
        
        if (myPosition > 0) {
          // Check if position has changed
          if (lastLeaderboardPosition !== null && lastLeaderboardPosition !== myPosition) {
            // Position changed, send notification
            await notificationService.notifyLeaderboardChange(lastLeaderboardPosition, myPosition)
          }
          setLastLeaderboardPosition(myPosition)
        }
      } catch (error) {
        console.error('Failed to check leaderboard position:', error)
      }
    }

    // Check immediately
    checkLeaderboardPosition()

    // Check every 5 minutes
    const interval = setInterval(checkLeaderboardPosition, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, user, lastLeaderboardPosition, notificationSettings.leaderboard])

  // Monitor friend activity
  const checkFriendActivity = async () => {
    if (!isAuthenticated || !notificationSettings.friends || !user) return

    try {
      // Get friend's leaderboard to see recent activity
      const response = await api.getFriendsLeaderboard()
      
      // Store last check time
      const lastCheck = localStorage.getItem('lastFriendActivityCheck')
      const now = new Date().toISOString()
      
      if (lastCheck) {
        // Check for friends who completed tasks since last check
        // This is a simplified version - in production, you'd want a dedicated endpoint
        const recentActivity = response.friends?.filter(friend => {
          return friend.lastActivity && new Date(friend.lastActivity) > new Date(lastCheck)
        })

        // Notify about recent friend completions (limit to avoid spam)
        if (recentActivity && recentActivity.length > 0) {
          const friend = recentActivity[0] // Only notify about the most recent one
          if (friend.lastCompletedTask) {
            await notificationService.notifyFriendTaskComplete(
              friend.name || friend.username,
              friend.lastCompletedTask
            )
          }
        }
      }
      
      localStorage.setItem('lastFriendActivityCheck', now)
    } catch (error) {
      console.error('Failed to check friend activity:', error)
    }
  }

  // Check friend activity periodically
  useEffect(() => {
    if (!isAuthenticated || !notificationSettings.friends) return

    // Check every 10 minutes
    const interval = setInterval(checkFriendActivity, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, notificationSettings.friends])

  // Function to manually trigger friend completion notification
  const notifyFriendTaskComplete = async (friendName, taskName) => {
    if (notificationSettings.friends && notificationService.isGranted()) {
      await notificationService.notifyFriendTaskComplete(friendName, taskName)
    }
  }

  // Update notification settings
  const updateNotificationSettings = (settings) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }))
    // Persist to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify({ ...notificationSettings, ...settings }))
  }

  // Load notification settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }
  }, [])

  const value = {
    notificationSettings,
    updateNotificationSettings,
    notifyFriendTaskComplete
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
