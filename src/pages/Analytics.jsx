import React from 'react'
import KpiCard from '../components/KpiCard'
import ChartLine from '../components/ChartLine'
import ChartPie from '../components/ChartPie'

export default function Analytics() {
  // Client-side embedded data
  const weeklyData = [45, 52, 38, 42, 35, 40, 32]
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const usageByCategory = [180, 120, 90, 60, 50]
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
            value="32"
            unit="kWh"
            trend="down"
            trendValue="8%"
          />
          <KpiCard
            icon="💰"
            title="Savings"
            value="$45"
            unit="this month"
            trend="up"
            trendValue="12%"
          />
          <KpiCard
            icon="🌱"
            title="CO₂ Saved"
            value="24"
            unit="kg"
            trend="up"
            trendValue="15%"
          />
          <KpiCard
            icon="🎯"
            title="Goal Progress"
            value="78"
            unit="%"
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

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Average Daily</div>
            <div className="text-2xl font-bold text-white">38.5 kWh</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Peak Hour</div>
            <div className="text-2xl font-bold text-white">6-8 PM</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="text-slate-400 text-sm mb-1">Efficiency Score</div>
            <div className="text-2xl font-bold text-brand-primary">A-</div>
          </div>
        </div>
      </div>
    </div>
  )
}
