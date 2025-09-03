const Booking = require("../models/Booking");
const client = require("../config/twilio"); // ✅ Twilio config

// ✅ Create booking + send WhatsApp notification
exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, doctor, date, time } = req.body;

    if (!name || !email || !phone || !doctor || !date || !time) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const booking = new Booking({ name, email, phone, doctor, date, time });
    await booking.save();

    // ✅ WhatsApp notification
    await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox number
      to: `whatsapp:+91${phone}`,    // User phone number
      body: `✅ Hello ${name}, your booking is confirmed!\nDoctor: ${doctor}\nDate: ${date}\nTime: ${time}\nThank you for booking with us.`
    });

    res.status(201).json({ msg: "Booking successful. WhatsApp notification sent!", booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("doctor", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Assign doctor to booking
exports.assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ msg: "Doctor ID is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId },
      { new: true }
    ).populate("doctor", "name email");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json({ msg: "Doctor assigned successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
