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

  useEffect(() => {
    loadGardenData()
  }, [])

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
            {/* Background Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <h2 className="text-xl font-semibold mb-4">Background</h2>
              {garden.background && garden.background.background_id ? (
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={garden.background.image_path}
                    alt={garden.background.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold">{garden.background.name}</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 rounded-lg bg-slate-900/50 border-2 border-dashed border-slate-700 flex items-center justify-center">
                  <p className="text-slate-500">No background selected. Visit the shop!</p>
                </div>
              )}
            </div>

            {/* Plants Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <h2 className="text-xl font-semibold mb-4">Plants ({garden.plants.length})</h2>
              {garden.plants.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {garden.plants.map(plant => (
                    <div
                      key={plant.id}
                      className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 hover:border-brand-primary/30 transition-all"
                    >
                      <div className="aspect-square bg-slate-800/50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={plant.image_path}
                          alt={plant.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium text-center truncate">{plant.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-5xl mb-3">🌱</div>
                  <p>No plants yet. Start shopping to grow your garden!</p>
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
