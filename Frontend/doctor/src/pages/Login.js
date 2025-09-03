import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../api";   
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(API + "/api/auth/login", {
        email,
        password,
        role,
      });

      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      
      if (res.data.user.role === "Admin") navigate("/admin", { replace: true });
      else if (res.data.user.role === "Doctor") navigate("/doctor", { replace: true });
      else if (res.data.user.role === "Staff") navigate("/staff", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Invalid login credentials");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Staff">Staff</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
