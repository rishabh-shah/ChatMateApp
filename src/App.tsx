import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import AuthComponent from './components/AuthComponent';
import { ChatState, Message, AuthState } from './types';
import { generateId, chatApi } from './utils';
import { authService } from './authService';
import './App.css';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userId: authService.getUserId(),
    isCheckingAuth: true,
    authError: null,
  });

  const [chatState, setChatState] = useState<ChatState>({
    sessionId: null,
    conversationId: generateId(),
    selectedAgent: 'Event Planning Agent',
    messages: [],
    isLoading: false,
    error: null,
  });

  const initializeNewChat = () => {
    setChatState({
      sessionId: null,
      conversationId: generateId(),
      selectedAgent: 'Event Planning Agent',
      messages: [],
      isLoading: false,
      error: null,
    });
  };

  const handleAuthSuccess = (userId: string, userEmail?: string, userName?: string) => {
    console.log('Handling auth success with:', { userId, userEmail, userName });

    // Update localStorage with the new user ID from OAuth
    if (userId !== authState.userId) {
      localStorage.setItem('chatmate_user_id', userId);
    }

    setAuthState(prev => ({
      ...prev,
      isAuthenticated: true,
      userId,
      userEmail,
      userName,
      authError: null,
      isCheckingAuth: false,
    }));

    console.log('Auth state updated, initializing chat...');
    initializeNewChat();
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isCheckingAuth: true, authError: null }));

        const authStatus = await authService.checkAuth(authState.userId);
        console.log('Auth check result:', authStatus);

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: authStatus.is_authenticated || authStatus.is_authorized || false,
          userEmail: authStatus.email,
          userName: authStatus.name,
          isCheckingAuth: false,
        }));
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState(prev => ({
          ...prev,
          isCheckingAuth: false,
          authError: error instanceof Error ? error.message : 'Authentication check failed',
        }));
      }
    };

    checkAuth();
  }, [authState.userId]);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const userId = urlParams.get('user_id');
    const email = urlParams.get('email');
    const name = urlParams.get('name');

    console.log('Current path:', window.location.pathname);
    console.log('URL params:', { code, state, userId, email, name });

    const handleCallback = async (code: string, state: string) => {
      try {
        setAuthState(prev => ({ ...prev, isCheckingAuth: true, authError: null }));

        const result = await authService.handleAuthCallback(code, state, authState.userId);

        if (result.success) {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            userEmail: result.user_info?.email,
            userName: result.user_info?.name,
            isCheckingAuth: false,
          }));

          // Clear URL parameters and redirect to main app
          window.history.replaceState({}, document.title, '/');
          initializeNewChat();
        } else {
          throw new Error(result.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
        setAuthState(prev => ({
          ...prev,
          isCheckingAuth: false,
          authError: error instanceof Error ? error.message : 'Authentication failed',
        }));

        // Clear URL parameters
        window.history.replaceState({}, document.title, '/');
      }
    };

    // Handle traditional OAuth callback with code/state
    if (code && state && window.location.pathname === '/auth/callback') {
      handleCallback(code, state);
    }
    // Handle direct success callback with user data
    else if (userId && window.location.pathname === '/auth/success') {
      handleAuthSuccess(userId, email || undefined, name || undefined);
      // Clear URL parameters and redirect to main app
      window.history.replaceState({}, document.title, '/');
    }
  }, [authState.userId]);

  const handleAgentChange = (agent: string) => {
    setChatState(prev => ({
      ...prev,
      selectedAgent: agent,
    }));
  };

  const handleSendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    // Add user message and set loading state
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // For new chats (no messages yet, excluding the user message we just added), don't send session_id
      const isFirstMessage = chatState.messages.length === 0;

      const response = await chatApi.sendMessage({
        message: messageContent,
        user_id: authState.userId,
        session_id: isFirstMessage ? undefined : (chatState.sessionId || undefined),
        agent_type: chatState.selectedAgent,
      });

      // Check if authentication is required
      if (response.requires_auth) {
        setAuthState(prev => ({ ...prev, isAuthenticated: false }));
        setChatState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const agentMessage: Message = {
        id: generateId(),
        type: 'agent',
        content: response.response,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        sessionId: response.session_id,
        messages: [...prev.messages, agentMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  };

  // Show authentication component if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <AuthComponent
        onAuthSuccess={handleAuthSuccess}
        authError={authState.authError}
        isCheckingAuth={authState.isCheckingAuth}
      />
    );
  }

  return (
    <div className="App">
      <Header />
      <Sidebar onNewChat={initializeNewChat} />
      <ChatArea
        selectedAgent={chatState.selectedAgent}
        onAgentChange={handleAgentChange}
        messages={chatState.messages}
        isLoading={chatState.isLoading}
        error={chatState.error}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
