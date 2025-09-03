// ===== backend/server.js =====
const dotenv = require('dotenv');
dotenv.config();
const express6 = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const { bootstrapAdmin } = require('./controllers/authController');



const app = express6();
app.use(cors());
app.use(express6.json());
app.use(morgan('dev'));


// DB
connectDB(process.env.MONGO_URI).then(bootstrapAdmin).catch(console.error);


// Routes
app.get('/', (req,res)=>res.send('OPD+ API running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8909;
app.listen(PORT, ()=>console.log('Server Running on PORT :', PORT));