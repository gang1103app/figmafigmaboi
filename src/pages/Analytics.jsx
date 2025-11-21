import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Task energy savings data (in kWh per completion)
const TASK_ENERGY_SAVINGS = {
  1: 0.5,   // Turn off 10 lights - 50W * 10 * 1 hour = 0.5 kWh
  2: 2.0,   // Bike to work - saves ~2 kWh in car fuel equivalent
  3: 0.3,   // Unplug unused devices - phantom draw 30W * 10 hours = 0.3 kWh
  4: 1.5,   // Cold water laundry - heating element savings ~1.5 kWh
  101: 1.8, // Walk instead of drive - car fuel equivalent
  102: 2.5, // Programmable thermostat - daily savings
  103: 0.8, // Hand wash dishes - dishwasher uses ~1.8 kWh, hand wash ~1 kWh
  104: 0.2  // Reusable bags - small manufacturing/transport energy offset
}

export default function Analytics() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [survey, setSurvey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [taskHistory, setTaskHistory] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load survey data
      const surveyResponse = await api.getSurvey()
      setSurvey(surveyResponse.survey)
      
      // Simulate task history - in production this would come from backend
      // For now, we'll use a deterministic pattern based on day of week for consistent demo
      const history = {}
      const today = new Date()
      
      // Create 7 days of history with deterministic data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Use day index for deterministic demo data (0-4 tasks)
        const dayOfWeek = date.getDay()
        const tasksCount = Math.min(4, (dayOfWeek + i) % 5)
        
        history[dateStr] = {
          tasks: tasksCount,
          completedTaskIds: [] // Would have actual task IDs in production
        }
      }
      
      setTaskHistory(history)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  // Prepare data for last 7 days
  const last7Days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    last7Days.push(date)
  }

  const weeklyLabels = last7Days.map(date => 
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
  )

  // Tasks completed data
  const tasksCompletedData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    return taskHistory[dateStr]?.tasks || 0
  })

  // Energy savings data (only if survey is complete)
  const energySavingsData = survey ? last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const tasksCompleted = taskHistory[dateStr]?.completedTaskIds || []
    
    // Calculate total kWh saved that day
    const kWhSaved = tasksCompleted.reduce((sum, taskId) => {
      return sum + (TASK_ENERGY_SAVINGS[taskId] || 0)
    }, 0)
    
    // Convert to dollars based on electricity rate
    const electricityRate = survey.electricity_rate || 0.13
    return (kWhSaved * electricityRate).toFixed(2)
  }) : []

  // Chart configuration for tasks completed
  const tasksChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: tasksCompletedData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Chart configuration for energy savings
  const energyChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Money Saved ($)',
        data: energySavingsData,
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)'
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)'
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-slate-400">Track your progress and energy savings</p>
        </div>

        {/* Seeds and Streaks Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <div className="text-4xl mb-2 text-center">🌱</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{user.seeds || 0}</div>
              <div className="text-slate-300 font-semibold">Seeds</div>
              <div className="text-xs text-slate-400 mt-1">Total earned</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="text-4xl mb-2 text-center">🔥</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">{user.streak || 0}</div>
              <div className="text-slate-300 font-semibold">Day Streak</div>
              <div className="text-xs text-slate-400 mt-1">Keep it going!</div>
            </div>
          </div>
        </div>

        {/* Tasks Completed Graph */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Tasks Completed (Last 7 Days)</span>
          </h2>
          <div className="h-64">
            <Line data={tasksChartData} options={chartOptions} />
          </div>
        </div>

        {/* Energy Saved Graph */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>💰</span>
            <span>Energy Saved Per Day (Last 7 Days)</span>
          </h2>
          {survey ? (
            <>
              <div className="h-64">
                <Line data={energyChartData} options={chartOptions} />
              </div>
              <div className="mt-4 text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3">
                <span className="text-brand-primary font-semibold">Calculations based on:</span>
                {' '}{survey.location}, {survey.state_code} • ${survey.electricity_rate}/kWh
                <div className="mt-1 text-xs">
                  Energy savings calculated from task-specific reductions in electricity usage
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-lg font-semibold text-white mb-2">Complete survey to see graph</p>
                <p className="text-sm text-slate-400 mb-4">
                  We need your location and electricity rate to calculate accurate energy savings
                </p>
                <button
                  onClick={() => navigate('/settings')}
                  className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors"
                >
                  Complete Survey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
