import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const raw = localStorage.getItem("user");
  const u = raw ? JSON.parse(raw) : null;

  function logout() {
    localStorage.removeItem("user");
    nav("/login");
  }

  return (
    <nav className="nav-left">
      <Link to="/">Home</Link>
      <Link to="/public">Public Booking</Link>

      
      {u && u.role === "Admin" && <Link to="/admin">Admin</Link>}
      {u && u.role === "Doctor" && <Link to="/doctor">Doctor</Link>}
      {u && u.role === "Staff" && <Link to="/staff">Staff</Link>}

      {u ? (
        <button onClick={logout}>Logout ({u.role})</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
