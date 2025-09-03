const express3 = require('express');
const router3 = express3.Router();
const { auth, permit } = require('../middleware/auth');
const { slotsForDoctorDate, createAppointment, listMyAppointments } = require('../controllers/appointmentController');


router3.get('/slots/:doctorId', slotsForDoctorDate); // public check slots
router3.post('/', auth, permit('Admin','Doctor','Staff'), createAppointment);
router3.get('/mine', auth, permit('Doctor','Staff'), listMyAppointments);

module.exports = router3;