// ===== frontend/src/pages/doctor/DoctorDashboard.js =====
import { API, authHeader } from '../../api';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./DoctorDashboard.css"; // import CSS

// DayRow component (same as before)
function DayRow({ day, value, onChange }) {
  const [rows, setRows] = useState(
    value?.windows?.length ? value.windows : [{ start: '09:00', end: '12:00' }]
  );

  useEffect(() => {
    onChange({ day, windows: rows });
  }, [rows]);

  return (
    <div className="day-row">
      <b>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}</b>
      {rows.map((r, i) => (
        <div key={i} className="time-row">
          <input
            type="time"
            value={r.start}
            onChange={(e) => {
              const v = [...rows];
              v[i] = { ...v[i], start: e.target.value };
              setRows(v);
            }}
          />
          <span>to</span>
          <input
            type="time"
            value={r.end}
            onChange={(e) => {
              const v = [...rows];
              v[i] = { ...v[i], end: e.target.value };
              setRows(v);
            }}
          />
          <button
            className="remove-btn"
            onClick={() => setRows(rows.filter((_, x) => x !== i))}
          >
            remove
          </button>
        </div>
      ))}
      <button
        className="add-btn"
        onClick={() => setRows([...rows, { start: '14:00', end: '17:00' }])}
      >
        + window
      </button>
    </div>
  );
}

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState(
    Array(7).fill(null).map((_, i) => ({ day: i, windows: [] }))
  );
  const [capacity, setCapacity] = useState(1);
  const [buffer, setBuffer] = useState(0);
  const [bookings, setBookings] = useState([]);

  // Load profile, availability & bookings
  async function load() {
    const me = await axios.get(API + '/api/doctors/me', { headers: authHeader() });
    setProfile(me.data);
    setCapacity(me.data.capacityPerSlot || 1);
    setBuffer(me.data.bufferMinutes || 0);

    const base = Array(7).fill(null).map((_, i) => ({ day: i, windows: [] }));
    const wa = me.data.weeklyAvailability?.length ? me.data.weeklyAvailability : base;
    setAvailability(wa);

    // 🔹 Fetch bookings instead of appointments
    const list = await axios.get(API + '/api/bookings', { headers: authHeader() });
    setBookings(list.data);
  }

  useEffect(() => {
    load();
  }, []);

  // Save availability to backend
  async function save() {
    await axios.put(
      API + '/api/doctors/availability',
      {
        weeklyAvailability: availability,
        capacityPerSlot: capacity,
        bufferMinutes: buffer,
      },
      { headers: authHeader() }
    );
    load();
  }

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>
      <div className="welcome">Welcome, {profile?.user?.name}</div>

      <div className="grid">
        {/* Availability Section */}
        <section>
          <h3>Weekly Availability</h3>
          <label>
            Capacity per 30m slot
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(+e.target.value)}
            />
          </label>
          <label>
            Buffer minutes between slots
            <input
              type="number"
              value={buffer}
              onChange={(e) => setBuffer(+e.target.value)}
            />
          </label>

          {availability.map((d, i) => (
            <DayRow
              key={i}
              day={i}
              value={d}
              onChange={(row) => {
                const v = [...availability];
                v[i] = row;
                setAvailability(v);
              }}
            />
          ))}

          <button onClick={save}>Save Availability</button>
        </section>

        {/* Bookings Section */}
        <section>
          <h3>My Bookings</h3>
          <ul>
            {bookings.map((b) => (
              <li key={b._id}>
                {b.date} {b.time} — {b.name} ({b.phone})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
