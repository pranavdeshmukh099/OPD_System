// ===== backend/utils/slotUtils.js =====
function toMinutes(hhmm){
const parts = hhmm.split(':');
return parseInt(parts[0],10)*60 + parseInt(parts[1],10);
}
function fromMinutes(m){
const h = Math.floor(m/60).toString().padStart(2,'0');
const mm = (m%60).toString().padStart(2,'0');
return `${h}:${mm}`;
}


// Given weeklyAvailability for a doctor (windows per weekday),
// existing appointments for a date, capacityPerSlot, bufferMinutes
// produce 30-min slots with remaining capacity
function generateSlotsForDate(weekday, weeklyAvailability, appts, capacityPerSlot, bufferMinutes){
const windows = (weeklyAvailability.find(w=>w.day===weekday)?.windows) || [];
const map = {}; // key: "HH:mm" -> count
appts.forEach(a=>{ map[a.slotStart] = (map[a.slotStart]||0)+1; });


const slots = [];
windows.forEach(win=>{
let start = toMinutes(win.start);
const end = toMinutes(win.end);
while(start + 30 <= end){
const slotStart = fromMinutes(start);
const slotEnd = fromMinutes(start + 30);
const used = map[slotStart] || 0;
const remaining = Math.max(0, capacityPerSlot - used);
if(remaining > 0){
slots.push({ start: slotStart, end: slotEnd, remaining });
}
// advance by 30 + buffer (buffer acts as gap between starts)
start += 30 + (bufferMinutes||0);
}
});
return slots;
}


module.exports = { toMinutes, fromMinutes, generateSlotsForDate };