// Service Worker for handling notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(clients.claim())
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag)
  event.notification.close()

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

// Handle push notifications (for future web push implementation)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/EcoBuddyTransparent_cropped.png',
      badge: data.badge || '/EcoBuddyTransparent_cropped.png',
      data: data.data || {}
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'EcoBuddy', options)
    )
  }
})
