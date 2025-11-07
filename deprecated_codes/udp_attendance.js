// udp_attendance.js
// Usage: sudo node udp_attendance.js
// Listens for UDP broadcast messages containing JSON payloads like:
// {"enrolment":"1234","appId":"attendance-v1"}

const dgram = require('dgram');
const fs = require('fs');
const os = require('os');

const PORT = 41234;
const SAVE_FILE = 'attendance.json';
const DEDUPE_SECONDS = 10; // don't log same enrolment again within X seconds

const server = dgram.createSocket('udp4');
let lastSeen = new Map();

function saveAttendanceRecord(record) {
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(SAVE_FILE)); } catch (e) { arr = []; }
  arr.push(record);
  fs.writeFileSync(SAVE_FILE, JSON.stringify(arr, null, 2));
}

function nowISO() { return new Date().toISOString(); }

server.on('listening', () => {
  const address = server.address();
  console.log(`✅ UDP listener started on ${address.address}:${address.port}`);
  console.log('Listening for broadcast beacons (payload JSON) ...');
});

server.on('message', (msg, rinfo) => {
  const raw = msg.toString().trim();
  const from = rinfo.address + ':' + rinfo.port;
  let payload = null;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.log(`${nowISO()}  ⚠️  Received non-JSON payload from ${from}: ${raw}`);
    return;
  }
  const enrol = payload.enrolment || payload.id || payload.enrol || 'unknown';
  const appId = payload.appId || payload.app || 'unknown-app';
  const rssi = payload.rssi || null; // optional if phone includes approximate signal strength
  const key = enrol;
  const ts = Date.now();
  const last = lastSeen.get(key) || 0;
  if (ts - last < DEDUPE_SECONDS * 1000) {
    // skip duplicate
    // console.log(`${nowISO()}  (duplicate) ${enrol} from ${from}`);
    return;
  }
  lastSeen.set(key, ts);

  const rec = {
    ts: nowISO(),
    enrolment: enrol,
    appId,
    from,
    payload,
    rssi
  };
  console.log(`${nowISO()}  ▶  Marked PRESENT: ${enrol}  (from ${from})`);
  saveAttendanceRecord(rec);
});

// bind to all addresses
server.bind(PORT, '0.0.0.0', () => {
  server.setBroadcast(true);
});
