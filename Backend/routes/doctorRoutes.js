const express2 = require('express');
const router2 = express2.Router();
const { auth, permit } = require('../middleware/auth');
const { myProfile, setAvailability, listDoctors } = require('../controllers/doctorController');


router2.get('/me', auth, permit('Doctor'), myProfile);
router2.put('/availability', auth, permit('Doctor'), setAvailability);
router2.get('/getBooking', listDoctors); 


module.exports = router2;