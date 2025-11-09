import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import KpiCard from '../components/KpiCard'
import ChartLine from '../components/ChartLine'
import ChartPie from '../components/ChartPie'

// CO2 emissions per kWh by state (kg CO2/kWh)
const STATE_CO2_RATES = {
  'AL': 0.451, 'AK': 0.461, 'AZ': 0.431, 'AR': 0.524, 'CA': 0.209,
  'CO': 0.731, 'CT': 0.236, 'DE': 0.418, 'FL': 0.398, 'GA': 0.466,
  'HI': 0.712, 'ID': 0.059, 'IL': 0.427, 'IN': 0.884, 'IA': 0.731,
  'KS': 0.698, 'KY': 0.919, 'LA': 0.549, 'ME': 0.154, 'MD': 0.511,
  'MA': 0.401, 'MI': 0.603, 'MN': 0.512, 'MS': 0.513, 'MO': 0.853,
  'MT': 0.698, 'NE': 0.718, 'NV': 0.547, 'NH': 0.154, 'NJ': 0.298,
  'NM': 0.748, 'NY': 0.251, 'NC': 0.434, 'ND': 0.898, 'OH': 0.723,
  'OK': 0.636, 'OR': 0.186, 'PA': 0.462, 'RI': 0.401, 'SC': 0.316,
  'SD': 0.431, 'TN': 0.482, 'TX': 0.499, 'UT': 0.798, 'VT': 0.003,
  'VA': 0.417, 'WA': 0.150, 'WV': 0.950, 'WI': 0.671, 'WY': 0.904
}

export default function Analytics() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [energyData, setEnergyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [survey, setSurvey] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load survey data
      const surveyResponse = await api.getSurvey()
      setSurvey(surveyResponse.survey)
      
      // Get last 7 days of data
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const response = await api.getEnergyUsage(startDate, endDate)
      setEnergyData(response.energyUsage || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  // Calculate total kWh saved from completed challenges
  const completedChallenges = user.challenges?.filter(c => c.status === 'completed') || []
  const estimatedKwhSaved = completedChallenges.length * 5 // Estimate 5 kWh per challenge

  // Calculate real savings based on survey data
  const electricityRate = survey?.electricity_rate || 0.13 // Default to national average
  const totalSavings = (estimatedKwhSaved * electricityRate).toFixed(2)
  
  // Calculate CO2 saved based on state
  const co2Rate = survey?.state_code ? STATE_CO2_RATES[survey.state_code] || 0.42 : 0.42 // Default to national average
  const co2Saved = (estimatedKwhSaved * co2Rate).toFixed(1)
  
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

        {/* Survey Prompt */}
        {!survey && (
          <div className="bg-brand-primary/20 border border-brand-primary/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">Complete Your Energy Profile</h3>
                <p className="text-sm text-slate-300">
                  Get accurate energy savings calculations based on your location and electricity rates
                </p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ml-4"
              >
                Complete Survey
              </button>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <KpiCard
            icon="⚡"
            title="Est. kWh Saved"
            value={estimatedKwhSaved.toFixed(0)}
            unit="kWh"
          />
          <KpiCard
            icon="💰"
            title="Money Saved"
            value={`$${totalSavings}`}
            unit={survey ? 'calculated' : 'estimate'}
          />
          <KpiCard
            icon="🌱"
            title="CO₂ Avoided"
            value={co2Saved}
            unit="kg"
          />
          <KpiCard
            icon="📊"
            title="Tasks Done"
            value={completedChallenges.length}
            unit="total"
          />
        </div>

        {survey && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-6">
            <div className="text-sm text-slate-400">
              <span className="text-brand-primary font-semibold">Calculations based on:</span>
              {' '}{survey.location}, {survey.state_code} • 
              ${survey.electricity_rate}/kWh • 
              {STATE_CO2_RATES[survey.state_code]?.toFixed(3) || '0.420'} kg CO₂/kWh
            </div>
          </div>
        )}

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
              {completedChallenges.length}
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
