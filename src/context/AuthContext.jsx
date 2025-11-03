import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has a token and fetch user data
    const token = localStorage.getItem('energyAppToken')
    if (token) {
      api.setToken(token)
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await api.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Clear invalid token
      api.logout()
      localStorage.removeItem('energyAppToken')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.signup(userData)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  const updateUser = (updates) => {
    setUser(prevUser => ({ ...prevUser, ...updates }))
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
