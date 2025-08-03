import React from 'react';
import { authService } from '../authService';
import './AuthComponent.css';

interface AuthComponentProps {
  onAuthSuccess: (userId: string, userEmail?: string, userName?: string) => void;
  authError: string | null;
  isCheckingAuth: boolean;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  onAuthSuccess,
  authError,
  isCheckingAuth,
}) => {
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsAuthenticating(true);
      const userId = authService.getUserId();
      await authService.startGoogleAuth(userId);
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticating(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-loading">
            <div className="spinner"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to ChatMate</h1>
          <p>Sign in with Google to start scheduling meetings with your Event Planning Agent</p>
        </div>

        <div className="auth-content">
          <button
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <>
                <div className="button-spinner"></div>
                Redirecting to Google...
              </>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {authError && (
            <div className="auth-error">
              <p>Authentication failed: {authError}</p>
              <button onClick={handleGoogleLogin} className="retry-button">
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p>We need access to your Google Calendar to schedule meetings effectively.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
