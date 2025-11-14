import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Register service worker early for notifications to work even when tab is closed
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered for persistent notifications:', registration)
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
