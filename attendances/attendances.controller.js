const express = require('express')
const router = express.Router()
const attendanceService = require('./attendances.services')

router.post('/diemdanh', CheckAttendance)
router.post('/getAttendance', getCurrentAttendance)
router.post('/checkClassAttendance', CheckCurrentClassAttendance)
router.post('/teacherCheckClassAttendance', TeacherCheckClassAttendance)

module.exports = router;

function CheckAttendance(req, res) {
    attendanceService.check(req, res)
}

function getCurrentAttendance(req, res) {
    attendanceService.getCurrent(req, res);
}

function CheckCurrentClassAttendance(req, res) {
    attendanceService.getCurrentClassAttendance(req, res);
}

function TeacherCheckClassAttendance(req ,res) {
    attendanceService.getClassAttendance(req, res);
}