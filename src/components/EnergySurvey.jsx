import React, { useState } from 'react'
import api from '../services/api'

// Average electricity rates by state ($/kWh) - US data
const STATE_RATES = {
  'AL': 0.124, 'AK': 0.228, 'AZ': 0.134, 'AR': 0.111, 'CA': 0.251,
  'CO': 0.136, 'CT': 0.221, 'DE': 0.129, 'FL': 0.123, 'GA': 0.128,
  'HI': 0.319, 'ID': 0.107, 'IL': 0.130, 'IN': 0.134, 'IA': 0.125,
  'KS': 0.137, 'KY': 0.113, 'LA': 0.110, 'ME': 0.168, 'MD': 0.137,
  'MA': 0.222, 'MI': 0.171, 'MN': 0.139, 'MS': 0.117, 'MO': 0.118,
  'MT': 0.115, 'NE': 0.111, 'NV': 0.129, 'NH': 0.202, 'NJ': 0.162,
  'NM': 0.135, 'NY': 0.186, 'NC': 0.117, 'ND': 0.108, 'OH': 0.133,
  'OK': 0.113, 'OR': 0.112, 'PA': 0.142, 'RI': 0.225, 'SC': 0.133,
  'SD': 0.123, 'TN': 0.119, 'TX': 0.122, 'UT': 0.111, 'VT': 0.183,
  'VA': 0.126, 'WA': 0.105, 'WV': 0.120, 'WI': 0.146, 'WY': 0.114
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function EnergySurvey({ onComplete, onSkip = null, existingSurvey = null }) {
  const [formData, setFormData] = useState({
    location: existingSurvey?.location || '',
    state_code: existingSurvey?.state_code || '',
    electricity_rate: existingSurvey?.electricity_rate || '',
    household_size: existingSurvey?.household_size || '',
    home_type: existingSurvey?.home_type || '',
    heating_type: existingSurvey?.heating_type || '',
    cooling_type: existingSurvey?.cooling_type || ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleStateChange = (e) => {
    const stateCode = e.target.value
    const rate = STATE_RATES[stateCode] || ''
    setFormData({
      ...formData,
      state_code: stateCode,
      electricity_rate: rate
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.location.trim()) {
      newErrors.location = 'City is required'
    }
    if (!formData.state_code) {
      newErrors.state_code = 'State is required'
    }
    if (!formData.electricity_rate || parseFloat(formData.electricity_rate) <= 0) {
      newErrors.electricity_rate = 'Valid electricity rate is required'
    }
    if (!formData.household_size || parseInt(formData.household_size) < 1) {
      newErrors.household_size = 'Valid household size is required'
    }
    if (!formData.home_type) {
      newErrors.home_type = 'Home type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      await api.submitSurvey({
        ...formData,
        electricity_rate: parseFloat(formData.electricity_rate),
        household_size: parseInt(formData.household_size)
      })
      
      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error('Failed to submit survey:', error)
      alert(error.message || 'Failed to submit survey. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Energy Profile Survey</h2>
        <p className="text-slate-400">
          Help us calculate your real energy savings and environmental impact
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            City/Location <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., San Francisco"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors ${
              errors.location ? 'border-red-500' : 'border-slate-600/50'
            }`}
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            State <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.state_code}
            onChange={handleStateChange}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:border-brand-primary transition-colors ${
              errors.state_code ? 'border-red-500' : 'border-slate-600/50'
            }`}
          >
            <option value="">Select State</option>
            {US_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state_code && (
            <p className="text-red-400 text-sm mt-1">{errors.state_code}</p>
          )}
        </div>

        {/* Electricity Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Electricity Rate ($/kWh) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.001"
            value={formData.electricity_rate}
            onChange={(e) => setFormData({ ...formData, electricity_rate: e.target.value })}
            placeholder="0.130"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors ${
              errors.electricity_rate ? 'border-red-500' : 'border-slate-600/50'
            }`}
          />
          {errors.electricity_rate && (
            <p className="text-red-400 text-sm mt-1">{errors.electricity_rate}</p>
          )}
          <p className="text-slate-500 text-xs mt-1">
            Auto-filled based on state average. You can adjust based on your utility bill.
          </p>
        </div>

        {/* Household Size */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Household Size <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.household_size}
            onChange={(e) => setFormData({ ...formData, household_size: e.target.value })}
            placeholder="Number of people in your home"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors ${
              errors.household_size ? 'border-red-500' : 'border-slate-600/50'
            }`}
          />
          {errors.household_size && (
            <p className="text-red-400 text-sm mt-1">{errors.household_size}</p>
          )}
        </div>

        {/* Home Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Home Type <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.home_type}
            onChange={(e) => setFormData({ ...formData, home_type: e.target.value })}
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:border-brand-primary transition-colors ${
              errors.home_type ? 'border-red-500' : 'border-slate-600/50'
            }`}
          >
            <option value="">Select Home Type</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="single_family">Single Family Home</option>
            <option value="mobile_home">Mobile Home</option>
          </select>
          {errors.home_type && (
            <p className="text-red-400 text-sm mt-1">{errors.home_type}</p>
          )}
        </div>

        {/* Heating Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Primary Heating Type
          </label>
          <select
            value={formData.heating_type}
            onChange={(e) => setFormData({ ...formData, heating_type: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-brand-primary transition-colors"
          >
            <option value="">Select Heating Type</option>
            <option value="electric">Electric</option>
            <option value="gas">Natural Gas</option>
            <option value="oil">Oil</option>
            <option value="heat_pump">Heat Pump</option>
            <option value="none">None/Not Applicable</option>
          </select>
        </div>

        {/* Cooling Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Primary Cooling Type
          </label>
          <select
            value={formData.cooling_type}
            onChange={(e) => setFormData({ ...formData, cooling_type: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-brand-primary transition-colors"
          >
            <option value="">Select Cooling Type</option>
            <option value="central_ac">Central AC</option>
            <option value="window_ac">Window/Wall AC</option>
            <option value="heat_pump">Heat Pump</option>
            <option value="evaporative">Evaporative Cooler</option>
            <option value="none">None/Not Applicable</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-brand-primary hover:bg-brand-primary/80 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : existingSurvey ? 'Update Survey' : 'Complete Survey'}
          </button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Skip for Now
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
