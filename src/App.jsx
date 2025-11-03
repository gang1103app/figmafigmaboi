import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import NavBottom from './components/NavBottom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Social from './pages/Social'
import Analytics from './pages/Analytics'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen">
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />} 
        />
        
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Catch-all route for unknown URLs */}
        <Route 
          path="*" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>
      {isAuthenticated && <NavBottom />}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}
