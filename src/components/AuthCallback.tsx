import React, { useEffect } from 'react';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    // Extract OAuth parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log('AuthCallback component loaded');
    console.log('Code:', code);
    console.log('State:', state);
    console.log('Error:', error);

    // Since this is loading in the same window (not a popup),
    // the parent App component will handle the callback processing
    // through its useEffect that checks for URL parameters

    if (error) {
      console.error('OAuth error:', error);
    } else if (code && state) {
      console.log('OAuth success - code and state received');
    } else {
      console.error('No OAuth parameters found');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <h2>Completing authentication...</h2>
        <p>Please wait while we finish setting up your account.</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthCallback;
