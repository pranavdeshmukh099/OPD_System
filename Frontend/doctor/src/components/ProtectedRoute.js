
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  let user = null;

  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    user = null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
