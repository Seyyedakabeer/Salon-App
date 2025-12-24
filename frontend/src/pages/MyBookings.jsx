import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../api';
import Navbar from '../components/Navbar';

export default function MyBookings({ user, setPage }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMyBookings(user.user_id)
      .then(res => setBookings(res.data))
      .catch(() => alert('Failed to load bookings'));
  }, [user.user_id]);

  return (
    <div style={{ padding: '30px' }}>
      <Navbar user={user} setPage={setPage} logout={() => setPage('login')} currentPage="mybookings" />

      <h1 style={{ textAlign: 'center', color: '#9b59b6', margin: '30px 0' }}>
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
          <h3>No bookings yet</h3>
        </div>
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {bookings.map(b => (
            <div key={b.ref_num} style={{
              background: 'white',
              padding: '20px',
              margin: '15px 0',
              borderRadius: '12px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              borderLeft: b.type === 'VIP' ? '6px solid gold' : '6px solid #3498db'
            }}>
              <h3>{b.services.join(', ')}</h3>
              <p><strong>Date & Time:</strong> {new Date(b.date).toLocaleString()}</p>
              <p><strong>Type:</strong> 
                <span style={{
                  padding: '5px 12px',
                  background: b.type === 'VIP' ? '#f1c40f' : '#3498db',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {b.type} ({b.duration} min)
                </span>
              </p>
              <p><strong>Ref No:</strong> {b.ref_num}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            padding: '12px 30px',
            background: '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}