import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PublicBooking.css";
import {API} from '../api'

export default function PublicBooking() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    date: "",
    time: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(API + "/api/doctors/getBooking")
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(API + "/api/bookings/createBooking", form);
      setMessage(res.data.msg);
      setForm({ name: "", email: "", phone: "", doctor: "", date: "", time: "" });
    } catch (err) {
      setMessage(err.response?.data?.msg || "Booking failed");
    }
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Your Phone" value={form.phone} onChange={handleChange} required />
        
        <select name="doctor" value={form.doctor} onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map(d=> <option key={d._id} value={d._id}>{d.user?.name} ({d.specialization||'General'})</option>)}
        </select>

        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="time" type="time" value={form.time} onChange={handleChange} required />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}