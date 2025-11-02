import React from 'react'

export default function ProgressBar({ label, current, target, color = 'brand-primary' }) {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{current} / {target}</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`bg-${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
