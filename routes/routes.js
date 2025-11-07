const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');
const attendanceCtrl = require('../controllers/attendanceController');

// Students
router.post('/students/register', studentCtrl.register);
router.get('/students', studentCtrl.list);
router.get('/students/:enrol', studentCtrl.getByEnrolment);

// Attendance
router.post('/attendance/mark', attendanceCtrl.mark);
router.get('/attendance', attendanceCtrl.list); // optional ?date=YYYY-MM-DD or ?enrolmentNumber=ENR001
router.get('/attendance/student/:enrol', attendanceCtrl.getByStudent);

module.exports = router;