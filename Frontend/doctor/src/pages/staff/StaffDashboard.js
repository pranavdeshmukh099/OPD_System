
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API, authHeader } from "../../api";
import "./StaffDashboard.css";

export default function StaffDashboard() {
  const [list, setList] = useState([]);
  const [doctors, setDoctors] = useState([]);

  async function load() {
    const { data } = await axios.get(API + "/api/bookings", {
      headers: authHeader(),
    });
    setList(data);

    // 🔹 Load all doctors
    const docRes = await axios.get(API + "/api/doctors", {
      headers: authHeader(),
    });
    setDoctors(docRes.data);
  }

  useEffect(() => {
    load();
  }, []);

  // 🔹 Assign doctor handler
  async function assignDoctor(bookingId, doctorId) {
    await axios.put(
      API + `/api/bookings  `,
      { doctorId },
      { headers: authHeader() }
    );
    load(); // reload after assigning
  }

  return (
    <div className="staff-dashboard">
      <h2>Staff Dashboard</h2>
      <ul className="booking-list">
        {list.map((b) => (
          <li key={b._id} className="booking-card">
            <div className="booking-date">
              📅 {b.date} — ⏰ {b.time}
            </div>
            <div className="booking-details">
              <strong>Patient:</strong> {b.name} ({b.phone})
            </div>
            <div className="booking-details">
              <strong>Doctor:</strong>{" "}
              {b.doctor ? (
                b.doctor.name
              ) : (
                <select
                  defaultValue=""
                  onChange={(e) => assignDoctor(b._id, e.target.value)}
                >
                  <option className="select" value="">-- Select Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
