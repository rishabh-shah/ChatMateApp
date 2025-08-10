import React from 'react';
import './Header.css';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userEmail, onLogout }) => {
  return (
    <header className="header">
      <h1 className="header-title">ChatMate</h1>
      <div className="header-user-section">
        {userName && (
          <div className="user-info">
            <span className="user-name">{userName}</span>
            {userEmail && <span className="user-email">{userEmail}</span>}
          </div>
        )}
        <button className="logout-button" onClick={onLogout} title="Logout">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
