// ===== backend/models/AuditLog.js =====
const { Schema: Schema4, model: model4, Types: Types4 } = require('mongoose');
const AuditLogSchema = new Schema4({
actor: { type: Types4.ObjectId, ref: 'User' },
action: { type: String, required: true },
entityType: String,
entityId: String,
meta: Object
}, { timestamps: true });
module.exports = model4('AuditLog', AuditLogSchema);