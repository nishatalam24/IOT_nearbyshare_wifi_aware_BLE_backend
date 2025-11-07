// udp_listener.js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const PORT = 41234;

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP server listening ${address.address}:${address.port}`);
});
server.on('message', (msg, rinfo) => {
  const now = new Date().toISOString();
  console.log(`${now}  ▶  ${rinfo.address}:${rinfo.port}  payload=${msg.toString()}`);
});

server.bind(PORT, () => {
  // On many systems binding to 0.0.0.0 is default
  server.setBroadcast(true);
});
