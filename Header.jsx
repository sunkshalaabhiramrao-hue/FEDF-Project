import React from 'react';

export default function Header({ view, setView }) {
  return (
    <header className="app-header">
      <h2 style={{ letterSpacing: '1px' }}>AETHERIA PORTAL</h2>
      <div className="nav-controls">
        <button className={`toggle-btn ${view === 'guest' ? 'active' : ''}`} onClick={() => setView('guest')}>Guest Flow</button>
        <button className={`toggle-btn ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>My Profile</button>
        <button className={`toggle-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>Admin Monitor</button>
      </div>
    </header>
  );
}