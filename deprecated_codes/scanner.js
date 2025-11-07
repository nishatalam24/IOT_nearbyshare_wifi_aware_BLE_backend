const noble = require('@abandonware/noble');

console.log("🔍 Waiting for Bluetooth to power on...");

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    console.log("✅ Bluetooth is ON — starting scan...");
    await noble.startScanning([], true);
  } else {
    console.log("⚠️ Bluetooth is OFF — stopping scan.");
    await noble.stopScanning();
  }
});

noble.on('discover', (peripheral) => {
  const id = peripheral.id || 'Unknown ID'; // unique UUID assigned each scan
  const localName = peripheral.advertisement.localName || 'Unknown Device';
  const rssi = peripheral.rssi;

  console.log(`📡 Found Device: ${localName}`);
  console.log(`   🔸 ID: ${id}`);
  console.log(`   📶 Signal Strength (RSSI): ${rssi} dBm\n`);
});
