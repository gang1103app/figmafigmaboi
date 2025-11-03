import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import KpiCard from '../components/KpiCard'
import ChartLine from '../components/ChartLine'
import ChartPie from '../components/ChartPie'

export default function Analytics() {
  const { user } = useAuth()
  const [energyData, setEnergyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnergyData()
  }, [])

  const loadEnergyData = async () => {
    try {
      // Get last 7 days of data
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const response = await api.getEnergyUsage(startDate, endDate)
      setEnergyData(response.energyUsage || [])
    } catch (error) {
      console.error('Failed to load energy data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  // Calculate metrics from actual data
  const totalSavings = user.totalSavings || 0
  const co2Saved = user.co2Saved || 0
  
  // Process energy data for charts
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    last7Days.push(date.toISOString().split('T')[0])
  }

  const weeklyData = last7Days.map(date => {
    const dayData = energyData.filter(d => d.date === date)
    return dayData.reduce((sum, d) => sum + parseFloat(d.usage_kwh || 0), 0)
  })

  const weeklyLabels = last7Days.map(date => {
    const d = new Date(date)
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
  })

  // Calculate usage by category
  const categories = ['heating', 'cooling', 'lighting', 'appliances', 'other']
  const categoryData = categories.map(cat => {
    const catData = energyData.filter(d => d.category === cat)
    return catData.reduce((sum, d) => sum + parseFloat(d.usage_kwh || 0), 0)
  })

  const categoryLabels = ['Heating', 'Cooling', 'Lighting', 'Appliances', 'Other']

  const todayUsage = weeklyData[6] || 0
  const yesterdayUsage = weeklyData[5] || 0
  const averageDaily = weeklyData.length > 0 
    ? (weeklyData.reduce((sum, val) => sum + val, 0) / weeklyData.length).toFixed(1)
    : 0

  const trend = yesterdayUsage > 0
    ? ((todayUsage - yesterdayUsage) / yesterdayUsage * 100).toFixed(0)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-slate-400">Track your energy consumption and savings</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <KpiCard
            icon="⚡"
            title="Today's Usage"
            value={todayUsage.toFixed(1)}
            unit="kWh"
            trend={trend < 0 ? "down" : trend > 0 ? "up" : undefined}
            trendValue={Math.abs(trend) + "%"}
          />
          <KpiCard
            icon="💰"
            title="Savings"
            value={`$${totalSavings.toFixed(0)}`}
            unit="total"
          />
          <KpiCard
            icon="🌱"
            title="CO₂ Saved"
            value={co2Saved.toFixed(1)}
            unit="kg"
          />
          <KpiCard
            icon="📊"
            title="Avg Daily"
            value={averageDaily}
            unit="kWh"
          />
        </div>

        {/* Weekly Usage Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Energy Usage</h2>
          {weeklyData.some(val => val > 0) ? (
            <div className="h-64">
              <ChartLine data={weeklyData} labels={weeklyLabels} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No energy usage data yet</p>
                <p className="text-sm mt-1">Complete tasks to start tracking your progress!</p>
              </div>
            </div>
          )}
        </div>

        {/* Usage by Category */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4">Usage by Category</h2>
          {categoryData.some(val => val > 0) ? (
            <div className="h-72">
              <ChartPie data={categoryData} labels={categoryLabels} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>No category breakdown available</p>
                <p className="text-sm mt-1">Start completing tasks to see detailed analytics!</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-white">
              {user.challenges?.filter(c => c.status === 'completed').length || 0}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-orange-400">🔥 {user.streak || 0} days</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Seeds Earned</div>
            <div className="text-2xl font-bold text-yellow-400">🌱 {user.seeds || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
