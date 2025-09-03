const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // assuming User model for doctors
  doctor: { type: String, required: true },
  date: { type: String, required: true },  // "2025-09-01"
  time: { type: String, required: true },  // "10:30 AM"
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
