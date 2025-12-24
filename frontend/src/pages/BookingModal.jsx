import React, { useState, useEffect } from 'react';
import { bookAppointment, getSlots } from '../api';
import { modalOverlay, modal, primaryBtn } from '../App';

const servicesList = ['Haircut', 'Pedicure', 'Manicure', 'Hair Color', 'Facial'];

export default function BookingModal({ user, setPage }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [allSlots, setAllSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState('');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    getSlots().then(res => setAllSlots(res.data));
  }, []);

  const days = Object.keys(allSlots).sort();
  const currentDay = days[currentDayIndex] || '';
  const currentDaySlots = allSlots[currentDay] || [];

  const toggleService = (s) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
    setSelectedSlot('');
  };

  const numServices = selectedServices.length;
  const duration = numServices <= 2 ? 30 : 60;
  const isVIP = numServices > 2;

  const formatTimeRange = (slotTime) => {
    const start = new Date(slotTime);
    if (isNaN(start)) return 'Invalid';
    const end = new Date(start.getTime() + duration * 60000);
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getValidSlots = () => {
    if (!Array.isArray(currentDaySlots)) return [];

    if (!isVIP) return currentDaySlots;

    return currentDaySlots.filter((slot, i) => {
      const d = new Date(slot);
      if (d.getMinutes() !== 0) return false;
      const next = currentDaySlots[i + 1];
      return next && new Date(next) - d === 30 * 60 * 1000;
    });
  };

  const book = async () => {
    if (selectedServices.length === 0) return alert('Select at least one service');
    if (!selectedSlot) return alert('Select a time slot');

    try {
      await bookAppointment({
        user_id: user.user_id,
        services: selectedServices,
        slot_time: selectedSlot
      });
      alert('Appointment created successfully!');
      setPage('dashboard');
    } catch {
      alert('Booking failed');
    }
  };

  return (
    <div style={modalOverlay}>
      <div
        style={{
          ...modal,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#9b59b6' }}>Make a Booking</h2>

        <div style={{ margin: '20px 0' }}>
          <h3>
            Select Services —{' '}
            <strong style={{ color: isVIP ? '#f39c12' : '#3498db' }}>
              {isVIP ? 'VIP' : 'Normal'} ({duration} min)
            </strong>
          </h3>
          {servicesList.map(s => (
            <label key={s} style={{ display: 'block', margin: '10px 0' }}>
              <input type="checkbox" checked={selectedServices.includes(s)} onChange={() => toggleService(s)} /> {s}
            </label>
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '20px' }}>
          <button
            onClick={() => setCurrentDayIndex(i => Math.max(0, i - 1))}
            disabled={currentDayIndex === 0}
            style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ←
          </button>
          <span style={{ margin: '0 30px', fontWeight: 'bold', color: '#2c3e50' }}>
            {currentDay || 'Loading...'}
          </span>
          <button
            onClick={() => setCurrentDayIndex(i => Math.min(days.length - 1, i + 1))}
            disabled={currentDayIndex === days.length - 1}
            style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            →
          </button>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', margin: '20px 0' }}>
          {getValidSlots().length === 0 ? (
            <p style={{ textAlign: 'center', color: '#95a5a6' }}>No available slots for this day</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px'
              }}
            >
              {getValidSlots().map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '16px',
                    background: selectedSlot === slot ? '#27ae60' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {formatTimeRange(slot)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={book}
            disabled={!selectedSlot || selectedServices.length === 0}
            style={{
              ...primaryBtn,
              background: selectedSlot && selectedServices.length > 0 ? '#27ae60' : '#95a5a6',
              padding: '18px 60px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            CONFIRM BOOKING
          </button>
          <button
            onClick={() => setPage('dashboard')}
            style={{ ...primaryBtn, background: '#e74c3c', marginLeft: '20px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
