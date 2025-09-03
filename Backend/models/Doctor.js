// ===== backend/models/Doctor.js =====
const { Schema: Schema2, model: model2, Types } = require('mongoose');
const SlotSchema = new Schema2({ start: String, end: String }, { _id: false });
const WeekDaySchema = new Schema2({
day: { type: Number, min: 0, max: 6, required: true }, // 0=Sun ... 6=Sat
windows: { type: [SlotSchema], default: [] }
}, { _id: false });


const DoctorSchema = new Schema2({
user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
specialization: String,
capacityPerSlot: { type: Number, default: 1, min: 1 },
bufferMinutes: { type: Number, default: 0, min: 0 },
weeklyAvailability: { type: [WeekDaySchema], default: [] },
assignedStaff: [{ type: Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


module.exports = model2('Doctor', DoctorSchema);