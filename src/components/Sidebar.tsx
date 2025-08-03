import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  return (
    <aside className="sidebar">
      <button className="new-chat-button" onClick={onNewChat}>
        + New Chat
      </button>
    </aside>
  );
};

export default Sidebar;
