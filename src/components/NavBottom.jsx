import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBottom() {
  const location = useLocation()
  
  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/social', label: 'Social', icon: '👥' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-brand-primary' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
