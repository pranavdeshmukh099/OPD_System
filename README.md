# 🏥 Online Patient Doctor System (OPD)

A full-stack **Online Patient Doctor (OPD) Management System** that allows users to book appointments, manage patient details, and streamline doctor-patient interactions.  
This project is built with **React (frontend)** and **Node.js + Express (backend)**, and uses **MongoDB** as the database.

---

## 🚀 Live Demo

- **Frontend (React App):** [https://opd2003.netlify.app/](https://opd2003.netlify.app/)  
- **Backend (API Server):** [https://opd-system-1.onrender.com](https://opd-system-1.onrender.com)

---

## 🧠 Project Overview

The OPD System is designed to simplify hospital operations by providing an easy-to-use online interface for:
- Patients to book and manage appointments.
- Doctors to view schedules and update appointment status.
- Admins to monitor and manage users, doctors, and appointments.

---

## 🏗️ Tech Stack

### **Frontend**
- React.js
- React Router DOM
- Axios
- Tailwind CSS / CSS Modules
- Netlify (Hosting)

### **Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- CORS, Dotenv, and JWT for authentication
- Render (Hosting)

---

## ⚙️ Features

✅ User authentication (Login/Signup for Patient and Doctor)  
✅ Appointment booking and management  
✅ Doctor availability and slot scheduling  
✅ Secure RESTful API with JWT authentication  
✅ Responsive UI for all devices  
✅ Integrated frontend and backend through Axios API calls  

---

## 📁 Folder Structure

### Frontend (`/frontend`)
```
/src
 ├── components/
 ├── pages/
 ├── assets/
 ├── App.js
 ├── index.js
 └── services/
      └── api.js
```

### Backend (`/backend`)
```
/backend
 ├── config/
 │   └── db.js
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── server.js
 └── .env
```

---

## 🔧 Installation & Setup (Local)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/opd-system.git
cd opd-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in `/backend` with:
```env
PORT=8909
MONGO_URI=mongodb+srv://pranavdeshmukh099_db_user:bhsXeZSi5JAfkFYd@cluster0.7albxrx.mongodb.net/
JWT_SECRET=supersecret
ADMIN_EMAIL=admin@opd.local
ADMIN_PASSWORD=admin123


TWILIO_SID=AC2e1de502741395e7a554d964c4d3f28f
TWILIO_AUTH_TOKEN=878efa4f8eb3782e2c7b827f9ffb854b
```
Run the server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend will run on **http://localhost:3000** and backend on **http://localhost:8909**

---

## 🌐 Deployment

### **Frontend:** Hosted on [Netlify](https://opd2003.netlify.app)  
### **Backend:** Hosted on [Render](https://opd-system-1.onrender.com)

To deploy updates:
- Push frontend build to Netlify  
- Push backend code to your Render service

---

## 📡 API Endpoints (Example)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/doctors` | Get all doctors |
| `POST` | `/api/appointments` | Book new appointment |
| `GET` | `/api/appointments/:id` | Get appointments by user ID |

---

## 🧩 Future Enhancements

- Add real-time chat between patient and doctor  
- Generate appointment reports and prescriptions  
- Add admin dashboard analytics  

---

## 👨‍💻 Author

**Pranav Deshmukh**  
📧 pranavdeshmukh099@gmail.com 
🔗 [GitHub](https://github.com/deshmukh099)

---
