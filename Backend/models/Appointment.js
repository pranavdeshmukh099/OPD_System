// ===== backend/models/Appointment.js =====
const { Schema: Schema3, model: model3, Types: Types3 } = require('mongoose');
const AppointmentSchema = new Schema3({
patientName: { type: String, required: true },
patientPhone: { type: String, required: true },
patientEmail: { type: String },
doctor: { type: Types3.ObjectId, ref: 'Doctor', required: true },
date: { type: String, required: true }, // YYYY-MM-DD (local clinic date)
slotStart: { type: String, required: true }, // HH:mm
slotEnd: { type: String, required: true }, // HH:mm
status: { type: String, enum: ['Booked','CheckedIn','Completed','Cancelled'], default: 'Booked' },
createdBy: { type: Types3.ObjectId, ref: 'User' }, // null -> Public
source: { type: String, enum: ['Public','Admin','Doctor','Staff'], default: 'Public' }
}, { timestamps: true });


AppointmentSchema.index({ doctor: 1, date: 1, slotStart: 1 });
module.exports = model3('Appointment', AppointmentSchema);