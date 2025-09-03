const express = require('express');
const router = express.Router();
const { login, createDoctor, createStaff } = require('../controllers/authController');
const { auth, permit } = require('../middleware/auth');


router.post('/login', login);
router.post('/admin/create-doctor', auth, permit('Admin'), createDoctor);
router.post('/admin/create-staff', auth, permit('Admin'), createStaff);


module.exports = router;