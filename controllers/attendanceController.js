const Attendance = require('../models/AttendanceSchema');
const Student = require('../models/StudentSchema');

// helper: normalize to midnight UTC (use local as needed)
function dateOnly(d) {
  const dt = new Date(d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
}

exports.mark = async (req, res) => {
  try {
    const { enrolmentNumber, status, date } = req.body;
    if (!enrolmentNumber || !status || !date) {
      return res.status(400).json({ error: 'enrolmentNumber, status (P/A) and date required' });
    }
    if (!['P', 'A'].includes(status)) {
      return res.status(400).json({ error: 'status must be P or A' });
    }

    const student = await Student.findOne({ enrolmentNumber });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const d = dateOnly(date);

    const existing = await Attendance.findOne({ student: student._id, date: d });
    if (existing) return res.status(409).json({ error: 'Attendance for this student on this date already recorded' });

    const att = new Attendance({
      student: student._id,
      enrolmentNumber: student.enrolmentNumber || null,
      date: d,
      status
    });

    await att.save();
    return res.status(201).json({ message: 'Attendance marked', attendance: att });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Duplicate attendance entry' });
    return res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { date, enrolmentNumber } = req.query;
    const filter = {};
    if (date) filter.date = dateOnly(date);
    if (enrolmentNumber) {
      const student = await Student.findOne({ enrolmentNumber });
      if (!student) return res.status(404).json({ error: 'Student not found for enrolmentNumber query' });
      filter.student = student._id;
    }

    const attends = await Attendance.find(filter)
      .populate('student', 'enrolmentNumber name course')
      .select('-__v');

      console.log('Attendance list filter:', attends);
    return res.json(attends);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.getByStudent = async (req, res) => {
  try {
    const { enrol } = req.params;
    const student = await Student.findOne({ enrolmentNumber: enrol });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const attends = await Attendance.find({ student: student._id }).sort({ date: -1 });
    return res.json({ student: { enrolmentNumber: student.enrolmentNumber, name: student.name, course: student.course }, attends });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};