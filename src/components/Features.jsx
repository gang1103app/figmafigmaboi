import React from 'react'

const features = [
  { title: 'Track usage', body: 'See where your energy goes and get simple tips to reduce it.' },
  { title: 'Challenges', body: 'Daily challenges to reduce usage and earn points.' },
  { title: 'Rewards', body: 'Redeem points for badges and real‑world rewards.' }
]

export default function Features() {
  return (
    <section id="features" className="py-8 bg-transparent">
      <div className="container">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-slate-300 mt-2">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}