const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  enrolmentNumber: { type: String, default: null },
  date: { type: Date, required: true }, // store full Date but treat only date-part
  status: { type: String, enum: ['P', 'A'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate entry for same student + date
AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);