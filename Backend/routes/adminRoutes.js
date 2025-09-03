const express5 = require('express');
const router5 = express5.Router();
const { auth, permit } = require('../middleware/auth');
const { logs } = require('../controllers/adminController');


router5.get('/logs', auth, permit('Admin'), logs);


module.exports = router5;