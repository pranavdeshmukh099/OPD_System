const Appointment = require("../models/Appointment");
const Doctor3 = require("../models/Doctor");
const Audit3 = require("../models/AuditLog");
const { generateSlotsForDate } = require("../utils/slotUtils");


async function slotsForDoctorDate(req, res) {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date query required YYYY-MM-DD" });
    }

    const doc = await Doctor3.findById(doctorId);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    const weekday = new Date(date + "T00:00:00").getDay();

    const appts = await Appointment.find({ doctor: doctorId, date });

    const slots = generateSlotsForDate(
      weekday,
      doc.weeklyAvailability,
      appts,
      doc.capacityPerSlot,
      doc.bufferMinutes
    );

    return res.json({ doctorId, date, slots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


async function createAppointment(req, res) {
  try {
    const { doctorId, date, slotStart, slotEnd, patientName, patientPhone, patientEmail } = req.body;

    if (!doctorId || !date || !slotStart || !slotEnd || !patientName || !patientPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doc = await Doctor3.findById(doctorId);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    const weekday = new Date(date + "T00:00:00").getDay();


    const allowed = generateSlotsForDate(
      weekday,
      doc.weeklyAvailability,
      [],
      doc.capacityPerSlot,
      doc.bufferMinutes
    ).some((s) => s.start === slotStart && s.end === slotEnd);

    if (!allowed) {
      return res.status(400).json({ message: "Slot not within availability" });
    }

 
    const count = await Appointment.countDocuments({ doctor: doctorId, date, slotStart });
    if (count >= (doc.capacityPerSlot || 1)) {
      return res.status(409).json({ message: "Slot full" });
    }

    const createdBy = req.user ? req.user.id : undefined;
    const source = req.user ? req.user.role || "Public" : "Public";

    const appt = await Appointment.create({
      doctor: doctorId,
      date,
      slotStart,
      slotEnd,
      patientName,
      patientPhone,
      patientEmail,
      createdBy,
      source,
    });

    await Audit3.create({
      actor: createdBy,
      action: "CREATE_APPOINTMENT",
      entityType: "Appointment",
      entityId: appt._id.toString(),
      meta: { doctorId, date, slotStart },
    });

    return res.status(201).json(appt);
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function listMyAppointments(req, res) {
  try {
    const role = req.user.role;
    let filter = {};
    let doctors = [];

    if (role === "Doctor") {
      const doc = await Doctor3.findOne({ user: req.user.id });
      if (doc) doctors.push(doc._id);
    } else if (role === "Staff") {
      const docs = await Doctor3.find({ assignedStaff: req.user.id });
      doctors = docs.map((d) => d._id);
    }

    if (doctors.length > 0) {
      filter.doctor = { $in: doctors };
    }

    if (req.query.date) {
      filter.date = req.query.date;
    }

    const appts = await Appointment.find(filter)
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ date: 1, slotStart: 1 });

    return res.json(appts);
  } catch (err) {
    console.error("Error listing appointments:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  slotsForDoctorDate,
  createAppointment,
  listMyAppointments,
};
