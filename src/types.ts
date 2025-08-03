// Types for ChatMate application

export interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  sessionId: string | null;
  conversationId: string;
  selectedAgent: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  userEmail?: string;
  userName?: string;
  isCheckingAuth: boolean;
  authError: string | null;
}

export interface ApiResponse {
  response: string;
  session_id: string;
  session_state: string;
  available_actions: string[];
  data: any;
  requires_auth?: boolean;
}

export interface ApiRequest {
  message: string;
  user_id: string;
  session_id?: string;
  agent_type?: string;
}
