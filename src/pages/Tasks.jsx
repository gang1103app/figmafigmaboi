import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// Define simple tasks that users can complete
const TASK_LIST = [
  { id: 1, title: 'Turn off 10 lights', icon: '💡', seeds: 100 },
  { id: 2, title: 'Bike to work', icon: '🚲', seeds: 150 },
  { id: 3, title: 'Unplug unused devices', icon: '🔌', seeds: 75 },
  { id: 4, title: 'Use cold water for laundry', icon: '💧', seeds: 120 },
  { id: 5, title: 'Air dry clothes instead of using dryer', icon: '👕', seeds: 100 },
  { id: 6, title: 'Take a 5-minute shower', icon: '🚿', seeds: 80 },
  { id: 7, title: 'Use a reusable water bottle', icon: '♻️', seeds: 50 },
  { id: 8, title: 'Turn off computer when not in use', icon: '💻', seeds: 75 },
  { id: 9, title: 'Use natural light instead of lamps', icon: '🌞', seeds: 100 },
  { id: 10, title: 'Lower thermostat by 2 degrees', icon: '🌡️', seeds: 130 },
  { id: 11, title: 'Carpool or use public transportation', icon: '🚌', seeds: 150 },
  { id: 12, title: 'Use a power strip and turn it off', icon: '⚡', seeds: 80 },
  { id: 13, title: 'Close curtains to keep heat in/out', icon: '🪟', seeds: 100 },
  { id: 14, title: 'Run dishwasher only when full', icon: '🍽️', seeds: 110 },
  { id: 15, title: 'Replace one bulb with LED', icon: '💡', seeds: 120 }
]

export default function Tasks() {
  const { user, updateUser, refreshUser } = useAuth()
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [showResetMessage, setShowResetMessage] = useState(false)

  // Load completed tasks from user data
  useEffect(() => {
    if (user?.completedTaskIds) {
      setCompletedTasks(new Set(user.completedTaskIds))
    }
  }, [user])

  // Check if all tasks are completed and trigger reset
  useEffect(() => {
    if (completedTasks.size === TASK_LIST.length && completedTasks.size > 0) {
      // All tasks completed, prepare for reset
      const timer = setTimeout(() => {
        handleResetTasks()
      }, 3000) // Wait 3 seconds to show completion message
      
      return () => clearTimeout(timer)
    }
  }, [completedTasks])

  const handleCompleteTask = async (task) => {
    if (completedTasks.has(task.id)) {
      return // Already completed
    }

    setLoading(true)
    try {
      // Add task to completed set
      const newCompletedTasks = new Set(completedTasks)
      newCompletedTasks.add(task.id)
      setCompletedTasks(newCompletedTasks)

      // Update user seeds
      const newSeeds = (user.seeds || 0) + task.seeds
      await updateUser({ 
        seeds: newSeeds,
        completedTaskIds: Array.from(newCompletedTasks)
      })

      // Refresh user to get latest data
      await refreshUser()
    } catch (error) {
      console.error('Failed to complete task:', error)
      // Revert on error
      const revertedTasks = new Set(completedTasks)
      revertedTasks.delete(task.id)
      setCompletedTasks(revertedTasks)
    } finally {
      setLoading(false)
    }
  }

  const handleResetTasks = async () => {
    try {
      setShowResetMessage(true)
      setLoading(true)
      
      // Clear completed tasks and increment cycle
      const taskCycle = (user.task_cycle || 1) + 1
      await updateUser({ 
        completedTaskIds: [],
        task_cycle: taskCycle,
        task_reset_at: new Date().toISOString()
      })
      
      // Clear local state
      setCompletedTasks(new Set())
      
      // Refresh user data
      await refreshUser()
      
      // Hide reset message after 3 seconds
      setTimeout(() => setShowResetMessage(false), 3000)
    } catch (error) {
      console.error('Failed to reset tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const totalCompleted = completedTasks.size
  const totalSeeds = TASK_LIST
    .filter(task => completedTasks.has(task.id))
    .reduce((sum, task) => sum + task.seeds, 0)
  const taskCycle = user?.task_cycle || 1

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Daily Tasks</h1>
          <p className="text-slate-400">Complete eco-friendly tasks to earn seeds!</p>
          {taskCycle > 1 && (
            <div className="mt-2 text-sm text-brand-primary">
              ⭐ Cycle {taskCycle} - You've completed {taskCycle - 1} full cycles!
            </div>
          )}
        </div>

        {/* Reset Message */}
        {showResetMessage && (
          <div className="mb-6 bg-gradient-to-r from-brand-primary/20 to-green-500/20 border border-brand-primary rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="text-lg font-bold text-white mb-1">Tasks Reset!</h3>
            <p className="text-slate-300 text-sm">New tasks are ready. Keep up the great work!</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-brand-primary">{totalCompleted}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-2xl font-bold text-white">{TASK_LIST.length}</div>
            <div className="text-xs text-slate-400">Total Tasks</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-2xl font-bold text-yellow-400">{totalSeeds}</div>
            <div className="text-xs text-slate-400">Seeds Earned</div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {TASK_LIST.map(task => {
            const isCompleted = completedTasks.has(task.id)
            
            return (
              <div
                key={task.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                  isCompleted 
                    ? 'border-green-500/30 bg-green-900/10' 
                    : 'border-slate-700/50 hover:border-brand-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{task.icon}</div>
                  <div className="flex-grow">
                    <h3 className={`text-lg font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Reward: <span className="text-yellow-400 font-semibold">🌱 {task.seeds} seeds</span>
                    </p>
                  </div>
                  <div>
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-green-400 font-semibold">
                        <span className="text-2xl">✓</span>
                        <span>Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteTask(task)}
                        disabled={loading}
                        className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion Message */}
        {totalCompleted === TASK_LIST.length && !showResetMessage && (
          <div className="mt-6 bg-gradient-to-r from-green-500/20 to-brand-primary/20 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">All Tasks Completed!</h2>
            <p className="text-slate-300">Great job! You've earned <span className="text-yellow-400 font-bold">{totalSeeds} seeds</span> total!</p>
            <p className="text-sm text-slate-400 mt-2">New tasks will appear in a moment...</p>
          </div>
        )}
      </div>
    </div>
  )
}
