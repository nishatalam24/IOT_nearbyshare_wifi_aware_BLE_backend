const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  enrolmentNumber: { type: String, unique: true, required: true, },
  password: { type: String, required: true }, // POC: plaintext as requested
  name: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);