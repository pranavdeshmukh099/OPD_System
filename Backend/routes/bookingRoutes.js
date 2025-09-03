const express = require("express");
const { createBooking, getBookings } = require("../controllers/BookingController");
const bookingController = require("..//controllers/BookingController");
const router = express.Router();

router.post("/createBooking", createBooking); 
router.get("/getBooking", getBookings);    


router.put("/:id/assign", bookingController.assignDoctor);

module.exports = router;
