import React from 'react'
import { useAuth } from '../context/AuthContext'
import KpiCard from '../components/KpiCard'
import ChartLine from '../components/ChartLine'
import ChartPie from '../components/ChartPie'

export default function Analytics() {
  const { user } = useAuth()
  
  // Placeholder data - in a real app, this would come from actual energy monitoring
  const weeklyData = [0, 0, 0, 0, 0, 0, 0]
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const usageByCategory = [0, 0, 0, 0, 0]
  const categoryLabels = ['Heating', 'Cooling', 'Lighting', 'Appliances', 'Other']

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
            value="0"
            unit="kWh"
          />
          <KpiCard
            icon="💰"
            title="Savings"
            value={`$${user?.savings || 0}`}
            unit="total"
          />
          <KpiCard
            icon="🌱"
            title="CO₂ Saved"
            value={user?.co2Saved || 0}
            unit="kg"
          />
          <KpiCard
            icon="🎯"
            title="Points Earned"
            value={user?.points || 0}
            unit="pts"
          />
        </div>

        {/* Weekly Usage Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Energy Usage</h2>
          <div className="h-64">
            <ChartLine data={weeklyData} labels={weeklyLabels} />
          </div>
        </div>

        {/* Usage by Category */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4">Usage by Category</h2>
          <div className="h-72">
            <ChartPie data={usageByCategory} labels={categoryLabels} />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📊</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About Analytics</h3>
              <p className="text-slate-400 mb-2">
                Energy analytics track your real-time electricity usage, savings, and environmental impact.
              </p>
              <p className="text-slate-400">
                To see live energy data and usage patterns, the app needs to be connected to smart home
                devices or an energy monitoring system through a backend server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
