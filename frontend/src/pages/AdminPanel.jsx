import React, { useEffect, useState } from 'react';
import { getAdminData } from '../api';
import Navbar from '../components/Navbar';

export default function AdminPanel({ setPage }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAdminData().then(res => setBookings(res.data));
  }, []);

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <Navbar user={{ name: 'Admin' }} setPage={setPage} logout={() => setPage('login')} currentPage="admin" />

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#8e44ad', fontSize: '36px' }}>Admin Dashboard</h1>
        <p style={{ color: '#7f8c8d', fontSize: '20px' }}>
          Total Bookings: <strong>{bookings.length}</strong>
        </p>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#95a5a6' }}>No bookings yet</h2>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={th}>Date & Time</th>
                <th style={th}>Customer</th>
                <th style={th}>Services</th>
                <th style={th}>Type</th>
                <th style={th}>Ref No</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.ref_num} style={{
                  background: b.type === 'VIP' ? '#fffbe6' : 'white',
                  borderLeft: b.type === 'VIP' ? '6px solid gold' : 'none'
                }}>
                  <td style={td}>{new Date(b.date).toLocaleString()}</td>
                  <td style={td}>{b.user_id.slice(-8)}</td>
                  <td style={td}>{b.services.join(', ')}</td>
                  <td style={td}>
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: b.type === 'VIP' ? '#f1c40f' : '#3498db',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {b.type}
                    </span>
                  </td>
                  <td style={td}><strong>{b.ref_num}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { padding: '20px', textAlign: 'center', fontSize: '16px' };
const td = { padding: '18px', textAlign: 'center', borderBottom: '1px solid #eee' };