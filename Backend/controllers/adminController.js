const Audit4 = require('../models/AuditLog');
async function logs(req, res){
const { limit = 100 } = req.query;
const entries = await Audit4.find().sort({ createdAt: -1 }).limit(parseInt(limit,10));
res.json(entries);
}
module.exports = { logs };