import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// Define simple tasks that users can complete daily
const REGULAR_TASKS = [
  { id: 1, title: 'Turn off 10 lights', icon: '💡', seeds: 100 },
  { id: 2, title: 'Bike to work', icon: '🚲', seeds: 150 },
  { id: 3, title: 'Unplug unused devices', icon: '🔌', seeds: 75 },
  { id: 4, title: 'Use cold water for laundry', icon: '💧', seeds: 120 }
]

// Bonus tasks that cycle when all main tasks are done
const BONUS_TASKS = [
  { id: 101, title: 'Walk instead of drive for short trips', icon: '🚶', seeds: 100 },
  { id: 102, title: 'Use a programmable thermostat', icon: '🎛️', seeds: 120 },
  { id: 103, title: 'Wash dishes by hand efficiently', icon: '🧼', seeds: 90 },
  { id: 104, title: 'Use reusable bags for shopping', icon: '🛍️', seeds: 60 }
]

export default function Tasks() {
  const { user, updateUser, refreshUser } = useAuth()
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [lastCompletedDate, setLastCompletedDate] = useState(null)

  // Check if we need to reset tasks for a new day at midnight
  useEffect(() => {
    if (user) {
      const checkAndResetTasks = () => {
        const today = new Date().toISOString().split('T')[0]
        const lastDate = user.lastActivityDate || user.last_activity_date
        
        setLastCompletedDate(lastDate)
        
        // If it's a new day, reset all completed tasks
        if (lastDate && lastDate !== today) {
          setCompletedTasks(new Set())
          // Update user's last activity date and clear completed tasks
          updateUser({ 
            completedTaskIds: [],
            last_activity_date: today
          })
        } else if (user?.completedTaskIds) {
          setCompletedTasks(new Set(user.completedTaskIds))
        }
      }

      checkAndResetTasks()
      
      // Set up midnight checker - check every minute if it's a new day
      const midnightChecker = setInterval(() => {
        checkAndResetTasks()
      }, 60000) // Check every minute
      
      return () => clearInterval(midnightChecker)
    }
  }, [user?.id])

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

      // Update user seeds and completed tasks
      const newSeeds = (user.seeds || 0) + task.seeds
      const today = new Date().toISOString().split('T')[0]
      
      await updateUser({ 
        seeds: newSeeds,
        completedTaskIds: Array.from(newCompletedTasks),
        last_activity_date: today
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

  if (!user) return null

  const regularTasksCompleted = REGULAR_TASKS.filter(task => completedTasks.has(task.id)).length
  const bonusTasksCompleted = BONUS_TASKS.filter(task => completedTasks.has(task.id)).length
  const totalCompleted = regularTasksCompleted + bonusTasksCompleted
  const allRegularTasksDone = regularTasksCompleted === REGULAR_TASKS.length
  
  // When all bonus tasks are complete, reset them immediately so they can be done again
  const allBonusTasksDone = bonusTasksCompleted === BONUS_TASKS.length
  if (allRegularTasksDone && allBonusTasksDone && completedTasks.size > REGULAR_TASKS.length) {
    // Remove bonus task IDs from completed tasks to allow re-doing them
    const newCompletedTasks = new Set(
      Array.from(completedTasks).filter(id => id <= REGULAR_TASKS.length)
    )
    setCompletedTasks(newCompletedTasks)
    // Update backend
    updateUser({ completedTaskIds: Array.from(newCompletedTasks) })
  }
  
  const totalSeeds = [...REGULAR_TASKS, ...BONUS_TASKS]
    .filter(task => completedTasks.has(task.id))
    .reduce((sum, task) => sum + task.seeds, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Daily Tasks</h1>
          <p className="text-slate-400">Complete eco-friendly tasks to earn seeds!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-brand-primary">{totalCompleted}</div>
            <div className="text-xs text-slate-400">Completed Today</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-2xl font-bold text-white">{regularTasksCompleted}/{REGULAR_TASKS.length}</div>
            <div className="text-xs text-slate-400">Regular Tasks</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-2xl font-bold text-yellow-400">{totalSeeds}</div>
            <div className="text-xs text-slate-400">Seeds Earned</div>
          </div>
        </div>

        {/* Bonus Tasks Info Banner */}
        {allRegularTasksDone && (
          <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎁</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Bonus Tasks Unlocked!</h3>
                <p className="text-sm text-slate-300">
                  You've completed all regular tasks! Complete all {BONUS_TASKS.length} bonus tasks to cycle them and keep earning more seeds!
                  {bonusTasksCompleted > 0 && ` (${bonusTasksCompleted}/${BONUS_TASKS.length} bonus completed)`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {/* Regular Tasks Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span>📋</span>
              <span>Regular Tasks</span>
              {allRegularTasksDone && <span className="text-green-400 text-sm">(All Complete!)</span>}
            </h2>
            <div className="space-y-3">
              {REGULAR_TASKS.map(task => {
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
          </div>

          {/* Bonus Tasks Section - Only show when regular tasks are done */}
          {allRegularTasksDone && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <span>🎁</span>
                <span>Bonus Tasks</span>
                <span className="text-purple-400 text-sm">(Cycle when all complete!)</span>
              </h2>
              <div className="space-y-3">
                {BONUS_TASKS.map(task => {
                  const isCompleted = completedTasks.has(task.id)
                  
                  return (
                    <div
                      key={task.id}
                      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                        isCompleted 
                          ? 'border-purple-500/30 bg-purple-900/10' 
                          : 'border-purple-700/50 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{task.icon}</div>
                        <div className="flex-grow">
                          <h3 className={`text-lg font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Bonus Reward: <span className="text-yellow-400 font-semibold">🌱 {task.seeds} seeds</span>
                          </p>
                        </div>
                        <div>
                          {isCompleted ? (
                            <div className="flex items-center gap-2 text-purple-400 font-semibold">
                              <span className="text-2xl">✓</span>
                              <span>Done</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCompleteTask(task)}
                              disabled={loading}
                              className="px-5 py-2 bg-purple-600 hover:bg-purple-600/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          )}
        </div>

        {/* Completion Messages */}
        {allRegularTasksDone && bonusTasksCompleted === 0 && (
          <div className="mt-6 bg-gradient-to-r from-green-500/20 to-brand-primary/20 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">All Regular Tasks Completed!</h2>
            <p className="text-slate-300">Great job! You've earned seeds. Check out the bonus tasks above for more rewards!</p>
          </div>
        )}
        
        {allRegularTasksDone && bonusTasksCompleted === BONUS_TASKS.length && (
          <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-2">All Bonus Tasks Complete!</h2>
            <p className="text-slate-300">Amazing! Bonus tasks will reset now so you can keep earning more seeds!</p>
          </div>
        )}
      </div>
    </div>
  )
}
