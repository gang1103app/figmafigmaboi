import React from 'react'
import ProgressBar from '../components/ProgressBar'

export default function Challenges() {
  // Client-side embedded data
  const activeChallenges = [
    {
      id: 1,
      title: 'Week Without Standby',
      description: 'Turn off all devices instead of leaving them on standby',
      progress: 5,
      target: 7,
      reward: 150,
      icon: '🔌',
      difficulty: 'Easy',
      timeLeft: '2 days'
    },
    {
      id: 2,
      title: 'Peak Hour Saver',
      description: 'Reduce energy use during peak hours (6-8 PM)',
      progress: 3,
      target: 5,
      reward: 200,
      icon: '⏰',
      difficulty: 'Medium',
      timeLeft: '4 days'
    },
    {
      id: 3,
      title: 'Eco Appliance Champion',
      description: 'Use energy-efficient appliances exclusively',
      progress: 8,
      target: 14,
      reward: 300,
      icon: '🏠',
      difficulty: 'Hard',
      timeLeft: '6 days'
    }
  ]

  const completedChallenges = [
    {
      id: 4,
      title: 'LED Light Switch',
      reward: 100,
      icon: '💡',
      completedDate: '2 days ago'
    },
    {
      id: 5,
      title: 'Thermostat Master',
      reward: 150,
      icon: '🌡️',
      completedDate: '5 days ago'
    }
  ]

  const upcomingChallenges = [
    {
      id: 6,
      title: 'Solar Sundays',
      description: 'Use solar power for all charging needs',
      reward: 250,
      icon: '☀️',
      startsIn: '3 days'
    },
    {
      id: 7,
      title: 'Zero Vampire Weekend',
      description: 'Eliminate all phantom power draws',
      reward: 180,
      icon: '🦇',
      startsIn: '5 days'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-slate-400">Complete challenges to earn points and rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-xs text-slate-400">Active</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-brand-primary">12</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">1,850</div>
            <div className="text-xs text-slate-400">Points Earned</div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
          <div className="space-y-4">
            {activeChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{challenge.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-xs text-slate-400">⏱️ {challenge.timeLeft}</span>
                      </div>
                    </div>
                    <ProgressBar
                      label="Progress"
                      current={challenge.progress}
                      target={challenge.target}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-slate-400">
                        Reward: <span className="text-brand-primary font-semibold">+{challenge.reward} points</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
          <div className="space-y-3">
            {completedChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 flex items-center gap-4"
              >
                <div className="text-3xl opacity-60">{challenge.icon}</div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-300">{challenge.title}</h3>
                  <p className="text-xs text-slate-500">{challenge.completedDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">✓ Complete</div>
                  <div className="text-xs text-slate-400">+{challenge.reward} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Challenges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-white mb-1">{challenge.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Starts in {challenge.startsIn}</span>
                  <span className="text-sm text-brand-primary font-semibold">+{challenge.reward} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
