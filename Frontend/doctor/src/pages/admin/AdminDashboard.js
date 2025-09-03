
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API, authHeader } from "../../api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    capacityPerSlot: 1,
    bufferMinutes: 0,
  });
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    password: "",
    forDoctorId: "",
  });
  const [doctors, setDoctors] = useState([]);

  async function load() {
    const l = await axios.get(API + "/api/admin/logs?limit=50", {
      headers: authHeader(),
    });
    setLogs(l.data);
    const d = await axios.get(API + "/api/doctors");
    setDoctors(d.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createDoctor() {
    await axios.post(API + "/api/auth/admin/create-doctor", form, {
      headers: authHeader(),
    });
    setForm({
      name: "",
      email: "",
      password: "",
      specialization: "",
      capacityPerSlot: 1,
      bufferMinutes: 0,
    });
    load();
  }

  async function createStaff() {
    await axios.post(API + "/api/auth/admin/create-staff", staff, {
      headers: authHeader(),
    });
    setStaff({ name: "", email: "", password: "", forDoctorId: "" });
    load();
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Doctor Creation */}
      <section className="card">
        <h3>Create Doctor</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Capacity/slot"
          value={form.capacityPerSlot}
          onChange={(e) =>
            setForm({ ...form, capacityPerSlot: +e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Buffer (min)"
          value={form.bufferMinutes}
          onChange={(e) =>
            setForm({ ...form, bufferMinutes: +e.target.value })
          }
        />
        <button onClick={createDoctor}>Create</button>
      </section>

      {/* Staff Creation */}
      <section className="card">
        <h3>Create Staff</h3>
        <input
          placeholder="Name"
          value={staff.name}
          onChange={(e) => setStaff({ ...staff, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={staff.email}
          onChange={(e) => setStaff({ ...staff, email: e.target.value })}
        />
        <input
          placeholder="Password"
          value={staff.password}
          onChange={(e) => setStaff({ ...staff, password: e.target.value })}
        />
        <select
          value={staff.forDoctorId}
          onChange={(e) => setStaff({ ...staff, forDoctorId: e.target.value })}
        >
          <option value="">Assign to Doctor (optional)</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.user?.name}
            </option>
          ))}
        </select>
        <button onClick={createStaff}>Create</button>
      </section>

      {/* Audit Logs */}
      <section className="card">
        <h3>Recent Audit Logs</h3>
        <ul className="logs">
          {logs.map((l) => (
            <li key={l._id}>
              <span className="log-date">
                {new Date(l.createdAt).toLocaleString()}
              </span>
              <span className="log-text">
                {l.action} — {l.entityType} — {l.entityId}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
