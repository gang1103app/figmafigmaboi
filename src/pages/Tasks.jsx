import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ProgressBar from '../components/ProgressBar'

export default function Tasks() {
  const { user, updateUser } = useAuth()
  const [availableChallenges, setAvailableChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      const response = await api.getAvailableChallenges()
      setAvailableChallenges(response.challenges || [])
    } catch (error) {
      console.error('Failed to load challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChallenge = async (challengeId) => {
    try {
      await api.startChallenge(challengeId)
      // Refresh challenges
      await loadChallenges()
      // Refresh user profile
      const response = await api.getProfile()
      updateUser(response.profile)
    } catch (error) {
      console.error('Failed to start challenge:', error)
    }
  }

  const handleCompleteChallenge = async (challenge) => {
    try {
      await api.completeChallenge(challenge.challenge_id)
      
      // Award seeds
      const newSeeds = (user.seeds || 0) + challenge.points
      updateUser({ seeds: newSeeds })
      
      // Refresh challenges
      await loadChallenges()
      // Refresh user profile
      const response = await api.getProfile()
      updateUser(response.profile)
    } catch (error) {
      console.error('Failed to complete challenge:', error)
    }
  }

  const handleUpdateProgress = async (challenge, newProgress) => {
    try {
      await api.updateChallengeProgress(challenge.challenge_id, newProgress)
      // Refresh user profile
      const response = await api.getProfile()
      updateUser(response.profile)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  if (!user) return null

  const activeChallenges = user.challenges?.filter(c => c.status === 'active') || []
  const completedChallenges = user.challenges?.filter(c => c.status === 'completed') || []
  const totalCompleted = completedChallenges.length
  const totalSeeds = completedChallenges.reduce((sum, c) => sum + (c.points_earned || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20 flex items-center justify-center">
        <div className="text-xl">Loading challenges...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-slate-400">Complete tasks to earn seeds and rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-2xl font-bold text-white">{activeChallenges.length}</div>
            <div className="text-xs text-slate-400">Active</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-brand-primary">{totalCompleted}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 text-center">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-2xl font-bold text-yellow-400">{totalSeeds}</div>
            <div className="text-xs text-slate-400">Seeds Earned</div>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
            <div className="space-y-4">
              {activeChallenges.map(challenge => {
                const progress = challenge.progress || 0
                const target = challenge.target_value || 1
                const isComplete = progress >= target

                return (
                  <div
                    key={challenge.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {challenge.category === 'lighting' && '💡'}
                        {challenge.category === 'heating' && '🌡️'}
                        {challenge.category === 'appliances' && '🔌'}
                        {challenge.category === 'water' && '💧'}
                        {!['lighting', 'heating', 'appliances', 'water'].includes(challenge.category) && '⚡'}
                      </div>
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
                          </div>
                        </div>
                        <ProgressBar
                          label="Progress"
                          current={progress}
                          target={target}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-slate-400">
                            Reward: <span className="text-yellow-400 font-semibold">🌱 {challenge.points} seeds</span>
                          </span>
                          <div className="flex gap-2">
                            {!isComplete && target === 1 && (
                              <button
                                onClick={() => handleCompleteChallenge(challenge)}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors"
                              >
                                Complete 🌱
                              </button>
                            )}
                            {!isComplete && target > 1 && progress < target && (
                              <button
                                onClick={() => handleUpdateProgress(challenge, progress + 1)}
                                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                              >
                                Mark Progress +1
                              </button>
                            )}
                            {isComplete && target > 1 && (
                              <button
                                onClick={() => handleCompleteChallenge(challenge)}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors"
                              >
                                Complete & Claim Seeds 🌱
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
            <div className="space-y-3">
              {completedChallenges.slice(0, 5).map(challenge => (
                <div
                  key={challenge.id}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 flex items-center gap-4"
                >
                  <div className="text-3xl opacity-60">
                    {challenge.category === 'lighting' && '💡'}
                    {challenge.category === 'heating' && '🌡️'}
                    {challenge.category === 'appliances' && '🔌'}
                    {challenge.category === 'water' && '💧'}
                    {!['lighting', 'heating', 'appliances', 'water'].includes(challenge.category) && '⚡'}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-300">{challenge.title}</h3>
                    <p className="text-xs text-slate-500">
                      {challenge.completed_at ? new Date(challenge.completed_at).toLocaleDateString() : 'Completed'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">✓ Complete</div>
                    <div className="text-xs text-slate-400">🌱 {challenge.points_earned || challenge.points} seeds</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges to Start */}
        {availableChallenges.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableChallenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">
                      {challenge.category === 'lighting' && '💡'}
                      {challenge.category === 'heating' && '🌡️'}
                      {challenge.category === 'appliances' && '🔌'}
                      {challenge.category === 'water' && '💧'}
                      {!['lighting', 'heating', 'appliances', 'water'].includes(challenge.category) && '⚡'}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-white mb-1">{challenge.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">{challenge.duration_days} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-400 font-semibold">🌱 {challenge.points} seeds</span>
                    <button
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors"
                    >
                      Start Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChallenges.length === 0 && completedChallenges.length === 0 && availableChallenges.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-4">🌱</div>
            <p>No challenges available yet. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
