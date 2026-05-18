const API_URL = "http://localhost:3000";

export const authService = {
  async login(credentials: {
    name?: string;
    email?: string;
    password: string;
  }) {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  async logout() {
    await fetch(`${API_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async me() {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unauthenticated");
    }

    return response.json();
  },

  async updateProfile(data: { name: string; bio: string }) {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "Profile update failed");
    }

    return response.json();
  },
};
