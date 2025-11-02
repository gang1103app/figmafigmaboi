import React from 'react'

export default function KpiCard({ title, value, unit, icon, trend, trendValue }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
      <div className="text-sm text-slate-400 mb-1">{title}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  )
}
