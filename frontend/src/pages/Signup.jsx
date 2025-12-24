import React, { useState } from 'react';
import { signup } from '../api';
import { center, card, input, primaryBtn } from '../App';

export default function Signup({ setPage }) {
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '' });

  const handle = async () => {
    if (!form.name || !form.email || !form.password) return alert('Fill all fields');
    try {
      await signup(form);
      alert('Signup success! Now login');
      setPage('login');
    } catch {
      alert('Email already exists');
    }
  };

  return (
    <div style={center}>
      <div style={card}>
        <h1 style={{ textAlign: 'center', color: '#9b59b6' }}>Create Account</h1>
        <input placeholder="Name" style={input} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" style={input} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Contact" style={input} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <input placeholder="Password" type="password" style={input} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handle} style={primaryBtn}>Sign Up</button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Have account? <span onClick={() => setPage('login')} style={{ color: '#9b59b6', cursor: 'pointer' }}>Login</span>
        </p>
      </div>
    </div>
  );
}