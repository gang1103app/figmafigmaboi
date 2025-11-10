import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Garden() {
  const { user, refreshUser } = useAuth()
  const [garden, setGarden] = useState({ plants: [], background: null })
  const [availableItems, setAvailableItems] = useState({ plants: [], backgrounds: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('garden') // 'garden' or 'shop'
  const [shopTab, setShopTab] = useState('plants') // 'plants' or 'backgrounds'
  const [error, setError] = useState(null)
  const [purchaseMessage, setPurchaseMessage] = useState(null)
  const [draggedPlant, setDraggedPlant] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [wateringMessage, setWateringMessage] = useState(null)

  useEffect(() => {
    loadGardenData()
    // Check plant states daily
    checkPlantStates()
  }, [])

  // Check plant states periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkPlantStates()
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [garden.plants])

  const loadGardenData = async () => {
    try {
      setLoading(true)
      const [gardenData, plantsData, backgroundsData] = await Promise.all([
        api.getGarden(),
        api.getGardenItems('plant'),
        api.getGardenItems('background')
      ])
      
      setGarden(gardenData)
      setAvailableItems({
        plants: plantsData.items || [],
        backgrounds: backgroundsData.items || []
      })
    } catch (error) {
      console.error('Failed to load garden:', error)
      setError('Failed to load garden data')
    } finally {
      setLoading(false)
    }
  }

  const checkPlantStates = () => {
    if (!garden.plants || garden.plants.length === 0) return
    
    const now = new Date()
    let needsUpdate = false
    
    const updatedPlants = garden.plants.map(plant => {
      const lastWatered = plant.last_watered_at ? new Date(plant.last_watered_at) : new Date()
      const hoursSinceWatered = (now - lastWatered) / (1000 * 60 * 60)
      
      let newState = plant.plant_state || 'healthy'
      
      // If not watered for 24 hours, plant becomes wilted
      if (hoursSinceWatered >= 24 && hoursSinceWatered < 48 && newState === 'healthy') {
        newState = 'wilted'
        needsUpdate = true
      }
      // If not watered for 48 hours, plant dies
      else if (hoursSinceWatered >= 48 && newState !== 'dead') {
        newState = 'dead'
        needsUpdate = true
      }
      
      return { ...plant, plant_state: newState }
    })
    
    if (needsUpdate) {
      setGarden(prev => ({ ...prev, plants: updatedPlants }))
      
      // Check if all plants are dead
      const allDead = updatedPlants.every(p => p.plant_state === 'dead')
      if (allDead) {
        setError('All your plants have died! 💀 Purchase new ones from the shop.')
      }
    }
  }

  const handleWaterPlant = async (plantId) => {
    try {
      await api.waterPlant(plantId)
      setWateringMessage('Plant watered! 💧')
      await loadGardenData()
      setTimeout(() => setWateringMessage(null), 2000)
    } catch (error) {
      console.error('Failed to water plant:', error)
      setError('Failed to water plant')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleWaterAll = async () => {
    try {
      setWateringMessage('Watering all plants... 💧')
      const waterPromises = garden.plants
        .filter(p => p.plant_state !== 'dead')
        .map(p => api.waterPlant(p.id))
      
      await Promise.all(waterPromises)
      setWateringMessage('All plants watered! 💧✨')
      await loadGardenData()
      setTimeout(() => setWateringMessage(null), 2000)
    } catch (error) {
      console.error('Failed to water all plants:', error)
      setError('Failed to water all plants')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handlePlantDragStart = (e, plant) => {
    setDraggedPlant(plant)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handlePlantDragOver = (e) => {
    e.preventDefault()
  }

  const handlePlantDrop = async (e) => {
    e.preventDefault()
    if (!draggedPlant) return
    
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y
    
    // Update plant position
    try {
      await api.updatePlantPosition(draggedPlant.id, x, y)
      await loadGardenData()
    } catch (error) {
      console.error('Failed to update plant position:', error)
    }
    
    setDraggedPlant(null)
  }

  const handlePurchase = async (item) => {
    try {
      setPurchaseMessage(null)
      setError(null)

      const response = await api.purchaseGardenItem(item.id, 0, 0)
      setPurchaseMessage(`${item.name} purchased successfully! 🌱`)
      
      // Refresh garden and user data
      await Promise.all([
        loadGardenData(),
        refreshUser()
      ])

      // Clear message after 3 seconds
      setTimeout(() => setPurchaseMessage(null), 3000)
    } catch (error) {
      console.error('Purchase failed:', error)
      setError(error.message || 'Failed to purchase item')
      setTimeout(() => setError(null), 3000)
    }
  }

  const userSeeds = user?.seeds || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20 flex items-center justify-center">
        <div className="text-xl">Loading garden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071021] to-[#0e1723] text-slate-100 pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Garden 🌱</h1>
          <p className="text-slate-400">Grow your garden with seeds earned from challenges</p>
          <div className="mt-3 flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 w-fit">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-yellow-400">{userSeeds}</span>
            <span className="text-slate-400">seeds</span>
          </div>
        </div>

        {/* Messages */}
        {purchaseMessage && (
          <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-400">
            {purchaseMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('garden')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'garden'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            🏡 My Garden
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'shop'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            🛒 Shop
          </button>
        </div>

        {/* Garden View */}
        {activeTab === 'garden' && (
          <div className="space-y-6">
            {/* Watering Message */}
            {wateringMessage && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-blue-400 text-center">
                {wateringMessage}
              </div>
            )}

            {/* Water All Button */}
            {garden.plants.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={handleWaterAll}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  💧 Water All Plants
                </button>
              </div>
            )}

            {/* Garden Display - Background with Plants */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <h2 className="text-xl font-semibold mb-4">My Garden</h2>
              {garden.background && garden.background.background_id ? (
                <div 
                  className="relative h-96 rounded-lg overflow-hidden"
                  onDragOver={handlePlantDragOver}
                  onDrop={handlePlantDrop}
                >
                  <img
                    src={garden.background.image_path}
                    alt={garden.background.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Plants overlay on background */}
                  {garden.plants.map(plant => {
                    const isDead = plant.plant_state === 'dead'
                    const isWilted = plant.plant_state === 'wilted'
                    
                    return (
                      <div
                        key={plant.id}
                        draggable={!isDead}
                        onDragStart={(e) => handlePlantDragStart(e, plant)}
                        className={`absolute cursor-move group ${isDead ? 'opacity-30 cursor-not-allowed' : ''}`}
                        style={{
                          left: `${plant.position_x || 0}px`,
                          top: `${plant.position_y || 0}px`,
                          width: '80px',
                          height: '80px'
                        }}
                      >
                        <img
                          src={plant.image_path}
                          alt={plant.name}
                          className={`w-full h-full object-contain ${isWilted ? 'filter saturate-50' : ''} ${isDead ? 'filter grayscale' : ''}`}
                        />
                        
                        {/* State indicator */}
                        {isWilted && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs px-1 rounded">😰</div>
                        )}
                        {isDead && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded">💀</div>
                        )}
                        
                        {/* Hover tooltip and water button */}
                        {!isDead && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {plant.name}
                              {isWilted && <span className="text-yellow-400"> - Needs water!</span>}
                            </div>
                          </div>
                        )}
                        
                        {/* Individual water button */}
                        {!isDead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleWaterPlant(plant.id)
                            }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            💧 Water
                          </button>
                        )}
                      </div>
                    )
                  })}
                  
                  {garden.plants.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-center text-white">
                        <div className="text-5xl mb-3">🌱</div>
                        <p>No plants yet. Visit the shop!</p>
                        <p className="text-sm mt-2 text-slate-300">Drag plants anywhere once purchased</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 rounded-lg bg-slate-900/50 border-2 border-dashed border-slate-700 flex items-center justify-center">
                  <p className="text-slate-500">No background selected. Visit the shop!</p>
                </div>
              )}
              
              {/* Plant status summary */}
              {garden.plants.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                    <div className="text-green-400 font-bold">
                      {garden.plants.filter(p => p.plant_state === 'healthy').length}
                    </div>
                    <div className="text-slate-400 text-xs">Healthy</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold">
                      {garden.plants.filter(p => p.plant_state === 'wilted').length}
                    </div>
                    <div className="text-slate-400 text-xs">Wilted</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                    <div className="text-red-400 font-bold">
                      {garden.plants.filter(p => p.plant_state === 'dead').length}
                    </div>
                    <div className="text-slate-400 text-xs">Dead</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shop View */}
        {activeTab === 'shop' && (
          <div>
            {/* Shop Tab Navigation */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShopTab('plants')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  shopTab === 'plants'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                🌿 Plants
              </button>
              <button
                onClick={() => setShopTab('backgrounds')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  shopTab === 'backgrounds'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                🖼️ Backgrounds
              </button>
            </div>

            {/* Shop Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopTab === 'plants' && availableItems.plants.map(plant => {
                const canAfford = userSeeds >= plant.cost_seeds
                const alreadyOwned = garden.plants.some(p => p.item_id === plant.id)
                
                return (
                  <div
                    key={plant.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-slate-900/50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={plant.image_path}
                          alt={plant.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-white mb-1">{plant.name}</h3>
                        <p className="text-sm text-slate-400 mb-2">{plant.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-semibold">
                            🌱 {plant.cost_seeds} seeds
                          </span>
                          {alreadyOwned ? (
                            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded">
                              ✓ Owned
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePurchase(plant)}
                              disabled={!canAfford}
                              className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                                canAfford
                                  ? 'bg-brand-primary hover:bg-brand-primary/80 text-white'
                                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {canAfford ? 'Buy' : 'Not enough seeds'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {shopTab === 'backgrounds' && availableItems.backgrounds.map(background => {
                const canAfford = userSeeds >= background.cost_seeds
                const isActive = garden.background?.background_id === background.id
                
                return (
                  <div
                    key={background.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
                  >
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      <img
                        src={background.image_path}
                        alt={background.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{background.name}</h3>
                    <p className="text-sm text-slate-400 mb-3">{background.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-semibold">
                        🌱 {background.cost_seeds} seeds
                      </span>
                      {isActive ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded">
                          ✓ Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePurchase(background)}
                          disabled={!canAfford}
                          className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                            canAfford
                              ? 'bg-brand-primary hover:bg-brand-primary/80 text-white'
                              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Buy' : 'Not enough seeds'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
