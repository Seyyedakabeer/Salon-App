import React from 'react';

export default function Navbar({ user, setPage, logout, currentPage }) {
  const isAdmin = user?.email === 'admin' || user?.isAdmin === true;

  return (
    <div style={{
      background: '#1a1a2e',
      color: 'white',
      padding: '15px 30px',
      marginBottom: '30px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Salon Luxz</h2>

      <div>
        <span style={{ marginRight: '30px' }}>
          Welcome, <strong>{user?.name || 'Guest'}</strong>
          {isAdmin && <span style={{ color: '#f1c40f', marginLeft: '10px' }}>Admin</span>}
        </span>

        {/* Show Dashboard & My Bookings ONLY when NOT on Admin Panel */}
        {currentPage !== 'admin' && (
          <>
            <button onClick={() => setPage('dashboard')} style={btn}>Dashboard</button>
            <button onClick={() => setPage('mybookings')} style={btn}>My Bookings</button>
          </>
        )}

        {/* Show Admin Panel button only for admin and only when NOT already on admin page */}
        {isAdmin && currentPage !== 'admin' && (
          <button 
            onClick={() => setPage('admin')} 
            style={{...btn, background: '#f39c12'}}
          >
            Admin Panel
          </button>
        )}

        <button 
          onClick={logout} 
          style={{...btn, background: '#e74c3c'}}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const btn = {
  marginLeft: '15px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  background: '#34495e',
  fontWeight: 'bold'
};