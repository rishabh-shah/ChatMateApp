import { ApiRequest, ApiResponse } from './types';

// Backend server configuration
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

// Generate a simple UUID-like string without external dependencies
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// API service for chat interactions
export const chatApi = {
  async sendMessage(request: ApiRequest): Promise<ApiResponse> {
    console.log('Sending request to:', `${BASE_URL}/chat`);
    console.log('Request payload:', request);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API Error details:', error);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${BASE_URL}. Please check if the server is running and CORS is configured.`);
      }

      throw error;
    }
  },
};
