const Doctor2 = require('../models/Doctor');
const Audit2 = require('../models/AuditLog');


async function myProfile(req, res){
const doc = await Doctor2.findOne({ user: req.user.id }).populate('user','name email');
res.json(doc);
}


async function setAvailability(req, res){
const body = req.body || {};
console.log(body);

const doc = await Doctor2.findOneAndUpdate(
{ user: req.user.id },
{ weeklyAvailability: body.weeklyAvailability || [], capacityPerSlot: body.capacityPerSlot, bufferMinutes: body.bufferMinutes },
{ new: true, upsert: true }
);
console.log("docs");

console.log(doc);

await Audit2.create({ actor: req.user.id, action: 'SET_AVAILABILITY', entityType: 'Doctor', entityId: doc._id.toString(), meta: { weeklyAvailability: doc.weeklyAvailability } });
res.json(doc);
}


async function listDoctors(req, res){
const docs = await Doctor2.find().populate('user','name email role');
res.json(docs);
}


module.exports = { myProfile, setAvailability, listDoctors };