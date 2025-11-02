import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ACCESSORIES = [
  { id: 'hat1', name: 'Cool Cap', emoji: '🧢', cost: 100 },
  { id: 'hat2', name: 'Crown', emoji: '👑', cost: 250 },
  { id: 'glasses1', name: 'Sunglasses', emoji: '🕶️', cost: 150 },
  { id: 'glasses2', name: 'Nerd Glasses', emoji: '👓', cost: 120 },
  { id: 'item1', name: 'Bow Tie', emoji: '🎀', cost: 80 },
  { id: 'item2', name: 'Scarf', emoji: '🧣', cost: 90 },
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

  const ecobuddy = user.ecobuddy || { name: 'Sparky', level: 1, accessories: [], mood: 'happy' }

  const handleFeed = () => {
    if (user.points >= 10) {
      const newXp = (user.xp || 0) + 50
      const newLevel = Math.floor(newXp / 1000) + 1
      updateUser({
        points: user.points - 10,
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
    if (user.points >= accessory.cost) {
      const newAccessories = [...(ecobuddy.accessories || []), accessory.id]
      updateUser({
        points: user.points - accessory.cost,
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
            <div className="text-2xl font-bold text-brand-primary">{user.level}</div>
            <div className="text-xs text-slate-400">Level</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-yellow-400">{user.points || 0}</div>
            <div className="text-xs text-slate-400">Points</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-green-400">${user.savings || 0}</div>
            <div className="text-xs text-slate-400">Saved</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-center">
            <div className="text-2xl font-bold text-orange-400">{user.streak || 0}🔥</div>
            <div className="text-xs text-slate-400">Streak</div>
          </div>
        </div>

        {/* EcoBuddy Display */}
        <div className="bg-gradient-to-br from-brand-primary/20 to-brand-accent/10 backdrop-blur-sm rounded-xl p-6 border border-brand-primary/30 mb-6">
          <div className="text-center mb-4">
            <div className="inline-block relative">
              {/* Main Mascot */}
              <div className="text-9xl mb-2">⚡</div>
              
              {/* Accessories Overlay */}
              <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
                {ownedAccessories.slice(0, 3).map((acc, idx) => (
                  <div 
                    key={acc.id}
                    className="text-4xl"
                    style={{ 
                      position: 'absolute',
                      top: idx === 0 ? '-20px' : idx === 1 ? '30%' : '60%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {acc.emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
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
                disabled={user.points < 10}
              >
                Feed 🍎 (10pts)
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shopAccessories.map(accessory => (
                <div 
                  key={accessory.id}
                  className="bg-slate-700/50 rounded-lg p-4 text-center border border-slate-600/50 hover:border-brand-primary/50 transition-colors"
                >
                  <div className="text-5xl mb-2">{accessory.emoji}</div>
                  <div className="font-semibold text-white mb-1">{accessory.name}</div>
                  <div className="text-yellow-400 text-sm mb-3">{accessory.cost} points</div>
                  <button 
                    onClick={() => handleBuyAccessory(accessory)}
                    className="w-full px-3 py-2 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={user.points < accessory.cost}
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
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold">Today's Usage</div>
            <div className="text-2xl font-bold text-brand-primary mt-1">32 kWh</div>
            <div className="text-xs text-slate-400 mt-1">↓ 8% from yesterday</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 text-center hover:border-brand-primary/30 transition-colors">
            <div className="text-4xl mb-2">⚡</div>
            <div className="font-semibold">Active Tasks</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">3</div>
            <div className="text-xs text-slate-400 mt-1">Complete to earn rewards</div>
          </div>
        </div>
      </div>
    </div>
  )
}
