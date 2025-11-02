import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('energyAppUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signup = (userData) => {
    const newUser = {
      id: Date.now(),
      email: userData.email,
      username: userData.username,
      name: userData.name,
      createdAt: new Date().toISOString(),
      level: 1,
      xp: 0,
      points: 0,
      savings: 0,
      co2Saved: 0,
      streak: 0,
      ecobuddy: {
        name: 'Sparky',
        level: 1,
        accessories: [],
        mood: 'happy'
      },
      achievements: [],
      friends: []
    }
    localStorage.setItem('energyAppUser', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const login = (email, password) => {
    // In a real app, this would validate against a backend
    const storedUser = localStorage.getItem('energyAppUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.email === email) {
        setUser(userData)
        return { success: true }
      }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    // Note: Not clearing localStorage to preserve user data
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    localStorage.setItem('energyAppUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
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
