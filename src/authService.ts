import { generateId } from './utils';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export interface AuthStatus {
  is_authenticated?: boolean;
  is_authorized?: boolean;  // Add support for backend's field name
  user_id?: string;
  email?: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user_info?: {
    email: string;
    name: string;
  };
}

export const authService = {
  // Check if user is authenticated
  async checkAuth(userId: string): Promise<AuthStatus> {
    try {
      const response = await fetch(`${BASE_URL}/auth/status/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Auth check error:', error);
      return { is_authenticated: false };
    }
  },

  // Start OAuth2 flow
  async startGoogleAuth(userId: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/auth/google/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          redirect_uri: `${window.location.origin}/auth/google/callback`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Redirect user to Google login
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error('OAuth init error:', error);
      throw error;
    }
  },

  // Handle OAuth2 callback
  async handleAuthCallback(code: string, state: string, userId: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, user_id: userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  },

  // Get or create user ID
  getUserId(): string {
    let userId = localStorage.getItem('chatmate_user_id');
    if (!userId) {
      userId = generateId();
      localStorage.setItem('chatmate_user_id', userId);
    }
    return userId;
  },

  // Clear user session
  clearUserSession(): void {
    localStorage.removeItem('chatmate_user_id');
  }
};
