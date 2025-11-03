const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      const data = await response.json();

      if (!response.ok) {
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
}

export default new ApiService();
