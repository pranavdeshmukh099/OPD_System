const express4 = require('express');
const router4 = express4.Router();
const { createAppointment } = require('../controllers/appointmentController');



router4.post('/book', createAppointment);


module.exports = router4;