import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';
import Navbar from '../components/Navbar';
import { statCard } from '../App';

export default function Dashboard({ user, setPage, logout }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    getDashboardStats(user.user_id).then(res => setStats(res.data));
  }, [user.user_id]);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <Navbar user={user} setPage={setPage} logout={logout} currentPage="dashboard" />

      <div style={{ display: 'flex', gap: '30px', marginBottom: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={statCard}>
          <h3>Visits This Month</h3>
          <h2 style={{ color: '#9b59b6' }}>{stats.visits_month || 0}</h2>
        </div>
        <div style={statCard}>
          <h3>Top Services</h3>
          <h2 style={{ color: '#e74c3c' }}>{stats.top_services?.join(' & ') || '—'}</h2>
        </div>
        <div style={statCard}>
          <h3>Next Appointment</h3>
          <h2 style={{ color: '#2ecc71' }}>
            {stats.next_appt && stats.next_appt.date 
              ? new Date(stats.next_appt.date).toLocaleString() 
              : 'No Upcoming Appointment'}
          </h2>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setPage('book')}
          style={{
            padding: '20px 60px',
            fontSize: '24px',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(155,89,182,0.4)',
            fontWeight: 'bold'
          }}
        >
          Make a Booking
        </button>
      </div>
    </div>
  );
}