const Student = require('../models/StudentSchema');

function genEnrolment() {
  // simple POC generator (change as needed)
  return 'ENR' + Date.now().toString().slice(-8);
}

exports.register = async (req, res) => {
  try {

    console.log('Registering student with data:', req.body);
    const { enrolmentNumber, password, name, course } = req.body;
    if (!enrolmentNumber || !password || !name || !course) {
      return res.status(400).json({ error: 'enrolmentNumber, password, name and course required' });
    }

    const existing = await Student.findOne({ enrolmentNumber });
    if (existing) return res.status(409).json({ error: 'enrolmentNumber already exists' });

    const student = new Student({
      enrolmentNumber,
      password,
      name,
      course
    });

    await student.save();
    return res.status(201).json({ message: 'Student registered', student });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const students = await Student.find().select('-__v -password');
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getByEnrolment = async (req, res) => {
  try {
    const { enrol } = req.params;
    const student = await Student.findOne({ enrolmentNumber: enrol }).select('-__v -password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.json(student);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};