# Browser Notification System

This document explains the browser-based notification system implemented in EcoBuddy.

## Overview

The EcoBuddy app now includes a comprehensive browser notification system that allows users to receive notifications even when the app is not actively open in a browser tab. This is achieved through the Notification API and Service Workers.

## Features

### Notification Types

1. **Friend Task Completion Notifications**
   - Triggered when a friend completes a task
   - Includes friend's name and task name
   - Emoji: 🎉

2. **Leaderboard Position Changes**
   - Monitors your position on the leaderboard
   - Notifies when your rank changes (up or down)
   - Shows old and new positions
   - Emoji: 📈 (improvement) or 📉 (drop)

3. **Daily Login Reminders**
   - Checks if you've logged in today after 6:00 PM
   - Only sends one reminder per day
   - Encourages daily engagement
   - Emoji: 🌱

4. **Test Notifications**
   - Available in Settings page
   - Verifies notification setup is working
   - Emoji: ✅

## How It Works

### Permission Request

When you log in or sign up, the app will request permission to send notifications. You'll see a browser prompt asking if you want to allow notifications from EcoBuddy.

- **Allow**: You'll receive notifications based on your preferences
- **Block**: Notifications will be disabled (you can change this in browser settings)
- **Not Now**: Permission will be asked again on next login

### Service Worker

A service worker (`/public/sw.js`) is registered automatically when the app loads. This enables:
- Notifications even when the browser tab is closed
- Notification click handling (focuses or opens the app)
- Future push notification support

The service worker is registered early during app initialization (in `src/main.jsx`), ensuring notifications can be sent even when the tab is not in focus or has been closed.

### Notification Settings

Navigate to **Settings > Notifications** to manage your preferences:

1. **Browser Notifications**
   - Enable/disable browser notification permission
   - Test button to verify notifications work
   - Shows current permission status

2. **Daily Reminders**
   - Toggle on/off
   - Sends reminder after 6 PM if you haven't logged in

3. **Friend Activity**
   - Toggle on/off
   - Notifies when friends complete tasks

4. **Leaderboard Updates**
   - Toggle on/off
   - Notifies when your leaderboard position changes

5. **Achievement Alerts**
   - Toggle on/off
   - Notifies when you earn achievements (coming soon)

## Implementation Details

### File Structure

```
src/
├── main.jsx                       # App entry point - registers service worker
├── services/
│   └── notificationService.js     # Core notification service
├── context/
│   └── NotificationContext.jsx    # Notification state management
└── pages/
    └── Settings.jsx               # Notification settings UI

public/
└── sw.js                          # Service worker for persistent notifications
```

### Key Components

#### NotificationService (`notificationService.js`)

Handles all notification operations:
- Permission checking and requesting
- Showing notifications with proper formatting
- Service worker integration
- Fallback to basic notifications

#### NotificationContext (`NotificationContext.jsx`)

Manages notification state and triggers:
- Polls leaderboard every 5 minutes for position changes
- Checks friend activity every 10 minutes
- Implements daily reminder logic (hourly checks after 6 PM)
- Persists preferences to localStorage

#### Settings Page Updates

Enhanced with:
- Notification permission UI
- Test notification button
- Toggle switches for each notification type
- Clear status indicators

### Polling Intervals

- **Leaderboard**: Every 5 minutes
- **Friend Activity**: Every 10 minutes
- **Daily Reminders**: Every hour (only checks after 6 PM)

## Browser Compatibility

| Browser | Notification API | Service Workers | Notes |
|---------|-----------------|-----------------|-------|
| Chrome 42+ | ✅ | ✅ | Full support |
| Firefox 44+ | ✅ | ✅ | Full support |
| Safari 7+ | ✅ | ✅ (11.1+) | Requires user interaction |
| Edge 14+ | ✅ | ✅ | Full support |
| Mobile Safari | ✅ | ⚠️ | Limited service worker support |
| Mobile Chrome | ✅ | ✅ | Full support |

## Privacy & Storage

### LocalStorage Data

The notification system stores:
- `notificationSettings`: User's notification preferences
- `lastLoginDate`: Date of last login (for daily reminders)
- `lastDailyReminder`: Date of last reminder sent
- `lastFriendActivityCheck`: Timestamp of last friend activity check
- `lastLeaderboardPosition`: User's last known leaderboard position

### Data Collected

The notification system:
- ✅ Only works when user grants permission
- ✅ Stores preferences locally (not sent to server)
- ✅ Does not track notification interactions
- ✅ Can be disabled at any time

## Troubleshooting

### Notifications Not Working?

1. **Check Browser Permission**
   - Look for 🔔 icon in browser address bar
   - Ensure notifications are allowed for localhost/your domain

2. **Check Settings Page**
   - Go to Settings > Notifications
   - Click "Enable" if permission not granted
   - Use "Test" button to verify

3. **Check Browser Settings**
   - Chrome: Settings > Privacy and security > Site Settings > Notifications
   - Firefox: Preferences > Privacy & Security > Permissions > Notifications
   - Safari: Preferences > Websites > Notifications

4. **Check Do Not Disturb**
   - macOS: Ensure Do Not Disturb is off
   - Windows: Check Focus Assist settings

### Notifications Stopped?

- Clearing browser data/cache removes permission
- You'll need to re-enable in Settings
- Service worker may need to be re-registered

## Future Enhancements

Potential improvements:
- [ ] Push notifications from backend (requires push server)
- [ ] Notification sound options
- [ ] Custom notification timing
- [ ] Notification history
- [ ] Group notifications (batch updates)
- [ ] Rich notifications with images and actions

## Development Notes

### Testing Notifications

1. Open browser console
2. Run: `Notification.requestPermission()`
3. Grant permission
4. Navigate to Settings
5. Click "Test" button

### Service Worker Development

- Service worker is at `/public/sw.js`
- Changes require re-registration or browser restart
- Chrome DevTools: Application > Service Workers
- Firefox DevTools: about:debugging > This Firefox > Service Workers

### Debugging

Enable verbose logging:
```javascript
// In notificationService.js
console.log('Notification shown:', title, options)
```

Check service worker status:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify notification permission is granted
3. Try disabling and re-enabling notifications
4. Test in incognito/private mode to rule out extension conflicts
