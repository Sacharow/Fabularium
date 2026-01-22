const API_URL = 'http://localhost:3000';

export const authService = {
  async login(credentials: { name?: string; email?: string; password: string }) {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async logout() {
    await fetch(`${API_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  }
};