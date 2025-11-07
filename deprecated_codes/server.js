// server.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

app.post('/beacon', (req, res) => {
  const payload = req.body || {};
  const now = new Date().toISOString();
  console.log(`${now}  ▶  Received beacon from ${req.ip}  payload=`, payload);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`HTTP beacon server listening on port ${PORT}`);
});
