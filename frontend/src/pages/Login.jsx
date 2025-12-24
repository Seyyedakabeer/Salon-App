import React, { useState } from 'react';
import { login } from '../api';
import { center, card, input, primaryBtn } from '../App';

export default function Login({ setUser, setPage }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handle = async () => {
    try {
      const res = await login(form);
      const userData = res.data;

      if (form.email === 'admin' && form.password === 'admin123') {
        setUser({ 
          user_id: 'admin_id',
          name: 'Admin',
          email: 'admin',
          isAdmin: true 
        });
        setPage('admin');
      } else {
        setUser({ 
          user_id: userData.user_id, 
          name: userData.name || 'User', 
          email: form.email,
          isAdmin: false 
        });
        setPage('dashboard');
      }
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div style={center}>
      <div style={card}>
        <h1 style={{ textAlign: 'center', color: '#9b59b6' }}>Welcome Back</h1>
        <input placeholder="Email" style={input} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" style={input} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handle} style={primaryBtn}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          No account? <span onClick={() => setPage('signup')} style={{ color: '#9b59b6', cursor: 'pointer' }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}