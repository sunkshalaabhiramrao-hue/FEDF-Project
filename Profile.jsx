import React from 'react';

export default function Profile({ guest }) {
  return (
    <div className="card">
      <h3>👤 Personal Guest Profile</h3>
      <p style={{ color: '#64748b' }}>Welcome to your personalized dashboard, {guest.name || 'Guest'}.</p>
      
      <div className="profile-grid">
        <div className="profile-section">
          <h4>Current Preferences</h4>
          <p><strong>Room Tier:</strong> {guest.roomType}</p>
          <p><strong>Bed Type:</strong> King (Default)</p>
          <p><strong>Accessibility:</strong> None requested</p>
        </div>
        
        <div className="profile-section">
          <h4>Active Bookings</h4>
          <p><strong>Status:</strong> {guest.roomNumber ? <span className="text-good">Checked In (Room #{guest.roomNumber})</span> : 'Pending Arrival'}</p>
          <p><strong>Duration:</strong> {guest.nights} Night(s)</p>
          <p><strong>Checkout:</strong> {guest.checkoutComplete ? 'Completed' : 'Pending'}</p>
        </div>
        
        <div className="profile-section">
          <h4>Saved ID Details</h4>
          <p><strong>Document:</strong> {guest.idFile || 'None uploaded'}</p>
          <p><strong>ID Ref:</strong> {guest.idNumber || 'Awaiting verification'}</p>
          <p><strong>Status:</strong> {guest.idFile ? '✅ Verified' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  );
}