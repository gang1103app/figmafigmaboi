import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ACCESSORIES = [
  { id: 'sunglasses', name: 'Sunglasses', emoji: '🕶️', cost: 150, type: 'glasses', position: { top: '28%', left: '50%' } },
  { id: 'tophat', name: 'Top Hat', emoji: '🎩', cost: 250, type: 'hat', position: { top: '10%', left: '50%' } },
  { id: 'crown', name: 'Crown', emoji: '👑', cost: 300, type: 'hat', position: { top: '8%', left: '50%' } },
  { id: 'scarf', name: 'Scarf', emoji: '🧣', cost: 120, type: 'neck', position: { top: '55%', left: '50%' } },
]

const MOODS = {
  happy: { emoji: '😊', label: 'Happy' },
  excited: { emoji: '🤩', label: 'Excited' },
  sleepy: { emoji: '😴', label: 'Sleepy' },
  energetic: { emoji: '⚡', label: 'Energetic' }
}

export default function Home() {
  const { user, updateUser } = useAuth()
  const [selectedAccessory, setSelectedAccessory] = useState(null)
  const [showShop, setShowShop] = useState(false)

  if (!user) return null

  const ecobuddy = user.ecobuddy || { name: 'EcoBuddy', level: 1, accessories: [], mood: 'happy' }
  const seeds = user.seeds || 0

  const handleFeed = () => {
    if (seeds >= 10) {
      const newXp = (user.xp || 0) + 50
      const newLevel = Math.floor(newXp / 1000) + 1
      updateUser({
        seeds: seeds - 10,
        xp: newXp,
        level: newLevel,
        ecobuddy: {
          ...ecobuddy,
          mood: 'happy',
          level: Math.floor(newXp / 500) + 1
        }
      })
    }
  }

  const handlePlay = () => {
    const moods = Object.keys(MOODS)
    const randomMood = moods[Math.floor(Math.random() * moods.length)]
    updateUser({
      ecobuddy: { ...ecobuddy, mood: randomMood }
    })
  }

  const handleBuyAccessory = (accessory) => {
    if (seeds >= accessory.cost) {
      const newAccessories = [...(ecobuddy.accessories || []), accessory.id]
      updateUser({
        seeds: seeds - accessory.cost,
        ecobuddy: { ...ecobuddy, accessories: newAccessories }
      })
    }
  }

  const handleToggleAccessory = (accessoryId) => {
    const accessories = ecobuddy.accessories || []
    const newAccessories = accessories.includes(accessoryId)
      ? accessories.filter(id => id !== accessoryId)
      : [...accessories, accessoryId]
    
    updateUser({
      ecobuddy: { ...ecobuddy, accessories: newAccessories }
    })
  }

  const ownedAccessories = ACCESSORIES.filter(acc => 
    ecobuddy.accessories?.includes(acc.id)
  )

  const shopAccessories = ACCESSORIES.filter(acc => 
    !ecobuddy.accessories?.includes(acc.id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-slate-400">How's your energy-saving day going?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-brand-primary">{user.level || 1}</div>
            <div className="text-xs text-slate-400">Level</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-yellow-400">🌱 {seeds}</div>
            <div className="text-xs text-slate-400">Seeds</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-green-400">${user.totalSavings || 0}</div>
            <div className="text-xs text-slate-400">Saved</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-orange-400">{user.streak || 0}🔥</div>
            <div className="text-xs text-slate-400">Day Streak</div>
          </div>
        </div>

        {/* EcoBuddy Display */}
        <div className="bg-gradient-to-br from-brand-primary/20 to-brand-accent/10 backdrop-blur-sm rounded-xl p-6 border border-brand-primary/30 mb-6">
          <div className="text-center mb-4">
            <div className="inline-block relative w-64 h-64 mx-auto">
              {/* Main Mascot Image */}
              <img 
                src="/EcoBuddyTransparent_cropped.png" 
                alt="EcoBuddy" 
                className="w-full h-full object-contain"
              />
              
              {/* Accessories Overlay */}
              {ownedAccessories.map((acc) => (
                <div 
                  key={acc.id}
                  className="absolute text-5xl"
                  style={{ 
                    top: acc.position.top,
                    left: acc.position.left,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                  }}
                >
                  {acc.emoji}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mb-2 mt-4">
              <h2 className="text-3xl font-bold">{ecobuddy.name}</h2>
              <span className="text-xs bg-brand-primary px-2 py-1 rounded-full">Lvl {ecobuddy.level || 1}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">{MOODS[ecobuddy.mood || 'happy'].emoji}</span>
              <span className="text-sm text-slate-300">{MOODS[ecobuddy.mood || 'happy'].label}</span>
            </div>

            <p className="text-slate-200 mb-4">
              {ecobuddy.mood === 'happy' && "I'm so proud of your energy-saving efforts! 🌟"}
              {ecobuddy.mood === 'excited' && "Let's crush those energy goals today! 💪"}
              {ecobuddy.mood === 'sleepy' && "Time to rest and recharge... zzz 😴"}
              {ecobuddy.mood === 'energetic' && "Feeling super charged! Let's go! ⚡"}
            </p>

            <div className="flex justify-center gap-3">
              <button 
                onClick={handleFeed}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={seeds < 10}
              >
                Feed 🍎 (10 🌱)
              </button>
              <button 
                onClick={handlePlay}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Play 🎮
              </button>
              <button 
                onClick={() => setShowShop(!showShop)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Shop 🛍️
              </button>
            </div>
          </div>
        </div>

        {/* Accessories Section */}
        {showShop && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
            <h3 className="text-xl font-semibold mb-4">Accessory Shop</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shopAccessories.map(accessory => (
                <div 
                  key={accessory.id}
                  className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50 hover:border-brand-primary/50 transition-colors"
                >
                  <div className="text-5xl mb-2">{accessory.emoji}</div>
                  <div className="font-semibold text-white mb-1">{accessory.name}</div>
                  <div className="text-yellow-400 text-sm mb-3">🌱 {accessory.cost}</div>
                  <button 
                    onClick={() => handleBuyAccessory(accessory)}
                    className="w-full px-3 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={seeds < accessory.cost}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Accessories */}
        {ownedAccessories.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
            <h3 className="text-xl font-semibold mb-4">My Accessories</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {ownedAccessories.map(accessory => (
                <button
                  key={accessory.id}
                  onClick={() => handleToggleAccessory(accessory.id)}
                  className="bg-slate-700/50 rounded-lg p-3 text-center border border-brand-primary/50 hover:bg-slate-700 transition-colors"
                >
                  <div className="text-4xl mb-1">{accessory.emoji}</div>
                  <div className="text-xs text-slate-300">{accessory.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 text-center hover:border-brand-primary/30 transition-colors">
            <div className="text-4xl mb-2">💰</div>
            <div className="font-semibold">Total Savings</div>
            <div className="text-2xl font-bold text-brand-primary mt-1">${user.totalSavings || 0}</div>
            <div className="text-xs text-slate-400 mt-1">Keep up the great work!</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 text-center hover:border-brand-primary/30 transition-colors">
            <div className="text-4xl mb-2">⚡</div>
            <div className="font-semibold">Active Tasks</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">
              {user.challenges?.filter(c => c.status === 'active').length || 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">Complete to earn seeds</div>
          </div>
        </div>
      </div>
    </div>
  )
}
