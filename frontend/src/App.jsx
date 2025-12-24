import React, { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BookingModal from './pages/BookingModal';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';

// Global Styles
export const center = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' };
export const card = { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '420px' };
export const input = { width: '100%', padding: '14px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' };
export const primaryBtn = { padding: '14px 30px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' };
export const statCard = { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1, minWidth: '200px' };
export const slotBtn = { padding: '10px 16px', margin: '6px', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
export const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
export const modal = { background: 'white', padding: '40px', borderRadius: '15px', width: '600px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' };

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
    setPage('login');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', background: '#f8f9fa' }}>
      {page === 'login' && <Login setUser={setUser} setPage={setPage} />}
      {page === 'signup' && <Signup setPage={setPage} />}
      {page === 'dashboard' && <Dashboard user={user} setPage={setPage} logout={logout} />}
      {page === 'book' && <BookingModal user={user} setPage={setPage} />}
      {page === 'mybookings' && <MyBookings user={user} setPage={setPage} />}
      {page === 'admin' && <AdminPanel user={user} setPage={setPage} logout={logout} />}
    </div>
  );
}

export default App;