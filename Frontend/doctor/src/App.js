// ===== frontend/src/App.js =====
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import PublicBooking from './pages/PublicBooking';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';


export default function App(){
return (
<div>
<Navbar/>
<Routes>
<Route path="/" element={<div style={{padding:24}}>Welcome to Multi-Role OPD Registration & Appointment System</div>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/public" element={<PublicBooking/>}/>
<Route path="/admin" element={<ProtectedRoute roles={["Admin"]}><AdminDashboard/></ProtectedRoute>}/>
<Route path="/doctor" element={<ProtectedRoute roles={["Doctor"]}><DoctorDashboard/></ProtectedRoute>}/>
<Route path="/staff" element={<ProtectedRoute roles={["Staff"]}><StaffDashboard/></ProtectedRoute>}/>
</Routes>
</div>
);
}