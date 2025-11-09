const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;

// Ensure the base URL always ends with /api
// This handles cases where VITE_API_URL is configured without the /api suffix
const normalizeBaseURL = (url) => {
  if (!url) return DEFAULT_API_BASE_URL;
  // Remove trailing slash if present
  url = url.replace(/\/$/, '');
  // Add /api if not already present
  // Note: This assumes the API doesn't use versioned paths like /api/v2
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

class ApiService {
  constructor() {
    this.baseURL = normalizeBaseURL(API_BASE_URL);
    this.token = localStorage.getItem('energyAppToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('energyAppToken', token);
    } else {
      localStorage.removeItem('energyAppToken');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (!isJson) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors array
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        // Handle single error message
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(userData) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // User endpoints
  async getProfile() {
    return await this.request('/user/profile');
  }

  async updateProgress(progressData) {
    return await this.request('/user/progress', {
      method: 'PATCH',
      body: JSON.stringify(progressData)
    });
  }

  async updateEcoBuddy(ecobuddyData) {
    return await this.request('/user/ecobuddy', {
      method: 'PATCH',
      body: JSON.stringify(ecobuddyData)
    });
  }

  async getAvailableChallenges() {
    return await this.request('/user/challenges/available');
  }

  async startChallenge(challengeId) {
    return await this.request(`/user/challenges/${challengeId}/start`, {
      method: 'POST'
    });
  }

  async updateChallengeProgress(challengeId, progress) {
    return await this.request(`/user/challenges/${challengeId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress })
    });
  }

  async completeChallenge(challengeId) {
    return await this.request(`/user/challenges/${challengeId}/complete`, {
      method: 'POST'
    });
  }

  async getLeaderboard() {
    return await this.request('/user/leaderboard');
  }

  async logEnergyUsage(usageData) {
    return await this.request('/user/energy-usage', {
      method: 'POST',
      body: JSON.stringify(usageData)
    });
  }

  async getEnergyUsage(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return await this.request(`/user/energy-usage?${params}`);
  }

  async updateStreak() {
    return await this.request('/user/streak/update', {
      method: 'POST'
    });
  }

  async getFriends() {
    return await this.request('/user/friends');
  }

  async addFriend(friendId) {
    return await this.request('/user/friends/add', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    });
  }

  async removeFriend(friendId) {
    return await this.request(`/user/friends/${friendId}`, {
      method: 'DELETE'
    });
  }

  async getFriendsLeaderboard() {
    return await this.request('/user/leaderboard/friends');
  }
  
  async searchUsers(query) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    return await this.request(`/user/search?${params}`);
  }
  
  async getSurvey() {
    return await this.request('/user/survey');
  }
  
  async submitSurvey(surveyData) {
    return await this.request('/user/survey', {
      method: 'POST',
      body: JSON.stringify(surveyData)
    });
  }
}

export default new ApiService();
