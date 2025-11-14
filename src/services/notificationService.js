// Browser Notification Service
class NotificationService {
  constructor() {
    this.permission = 'default'
    this.checkPermission()
  }

  // Check current notification permission
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
    return this.permission
  }

  // Request notification permission from user
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (this.permission === 'granted') {
      return 'granted'
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission
  }

  // Show a notification
  async showNotification(title, options = {}) {
    // Check if we have permission
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return null
    }

    // Default options
    const defaultOptions = {
      icon: '/EcoBuddyTransparent_cropped.png',
      badge: '/EcoBuddyTransparent_cropped.png',
      requireInteraction: false,
      ...options
    }

    try {
      // Use Service Worker if available, otherwise fallback to basic notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        return await this.showServiceWorkerNotification(title, defaultOptions)
      } else {
        return this.showBasicNotification(title, defaultOptions)
      }
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }

  // Show notification via Service Worker (works even when tab is closed)
  async showServiceWorkerNotification(title, options) {
    try {
      const registration = await navigator.serviceWorker.ready
      return await registration.showNotification(title, options)
    } catch (error) {
      console.error('Service Worker notification failed:', error)
      // Fallback to basic notification
      return this.showBasicNotification(title, options)
    }
  }

  // Show basic notification (only works when tab is open)
  showBasicNotification(title, options) {
    try {
      const notification = new Notification(title, options)
      
      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('Basic notification failed:', error)
      return null
    }
  }

  // Convenience methods for specific notification types
  async notifyFriendTaskComplete(friendName, taskName) {
    return await this.showNotification(
      '🎉 Friend Completed a Task!',
      {
        body: `${friendName} just completed: ${taskName}`,
        tag: 'friend-task',
        data: { type: 'friend-task', friendName, taskName }
      }
    )
  }

  async notifyLeaderboardChange(oldRank, newRank) {
    const isImprovement = newRank < oldRank
    const emoji = isImprovement ? '📈' : '📉'
    const message = isImprovement 
      ? `You moved up from #${oldRank} to #${newRank}!` 
      : `You dropped from #${oldRank} to #${newRank}`
    
    return await this.showNotification(
      `${emoji} Leaderboard Update`,
      {
        body: message,
        tag: 'leaderboard-change',
        data: { type: 'leaderboard', oldRank, newRank }
      }
    )
  }

  async notifyDailyReminder() {
    return await this.showNotification(
      '🌱 Daily Check-in Reminder',
      {
        body: "You haven't logged in today! Check your EcoBuddy and see what energy-saving tasks await.",
        tag: 'daily-reminder',
        requireInteraction: true,
        data: { type: 'daily-reminder' }
      }
    )
  }

  async testNotification() {
    return await this.showNotification(
      '✅ Test Notification',
      {
        body: 'If you see this, notifications are working correctly!',
        tag: 'test',
        data: { type: 'test' }
      }
    )
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window
  }

  // Check if permission is granted
  isGranted() {
    return this.permission === 'granted'
  }

  // Check if we should show the permission prompt
  shouldRequestPermission() {
    return this.isSupported() && this.permission === 'default'
  }
}

// Export singleton instance
const notificationService = new NotificationService()
export default notificationService
