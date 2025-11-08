import React from 'react'
import { useNavigate } from 'react-router-dom'
import EnergySurvey from '../components/EnergySurvey'

export default function SurveyPrompt() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/home')
  }

  const handleSkip = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold mb-2">Welcome to EcoBuddy!</h1>
          <p className="text-slate-400">
            Help us calculate your real energy savings by completing this quick survey
          </p>
        </div>

        <EnergySurvey onComplete={handleComplete} onSkip={handleSkip} />

        <p className="text-center text-slate-500 text-sm mt-6">
          You can complete this survey later from Settings if you skip
        </p>
      </div>
    </div>
  )
}
