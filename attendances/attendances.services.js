const config = require('../config.json')
const db = require('../_helpers/db')
const Teacher = db.Teacher
const Class = db.Class
const Attendance = db.Attendance
const AttendanceSummary = db.AttendanceSummary
const moment = require('moment')
module.exports = {
    check,
    getCurrent,
    getCurrentClassAttendance,
    getClassAttendance
}

async function getClassAttendance(req, res) {
    var idToken = req.body.idToken;
    verify(idToken);
    async function verify(token) {
        const { OAuth2Client } = require('google-auth-library');
        const CLIENT_ID = config.CLIENT_ID;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            var email = payload['email'];
            var classID = req.body.ClassID;
            console.log(email + " Check diem danh lop " + classID)
            res.send(await AttendanceSummary.find({ teacherEmail: email , ClassID: classID}));
        } catch (error) {
            console.log(error);
            res.sendStatus(401);
        }
    }
}

async function check(req, res) {
    var idToken = req.body.idToken;
    verify(idToken);
    async function verify(token) {
        const { OAuth2Client } = require('google-auth-library');
        const CLIENT_ID = config.CLIENT_ID;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            email = payload['email'];
            mssv = email.split("@")[0];
            classID = req.body.classID;
            const _class = await Class.findOne({ classID: classID });
            const teacher = await Teacher.findOne({ email: _class.teacherEmail });

            console.log(_class);
            console.log(teacher);

            //Bước 1: So sánh trong khoảng thời gian
            var CheckTime = false;
            var now = new Date();
            const currentDay = now.getDay();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            var current = currentHour + ":" + currentMinute;
            const currentTime = moment(current, "HH:mm");
            const startTime = moment(_class.startTime, "HH:mm");
            const endTime = moment(_class.endTime, "HH:mm");

            const ClassDay = _class.day;

            var days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

            console.log(startTime + " <= " + currentTime + " <= " + endTime);
            console.log(days[currentDay] + " vs " + ClassDay);

            if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime) && days[currentDay] == ClassDay) {
                CheckTime = true;
                console.log("[1] Thời gian OK")
            }
            console.log(CheckTime)

            //Bước 2: So sánh MAC của Access Point sinh viên kết nối và của GV
            var CheckMAC = false;
            const MacAPSinhVien = req.body.teacherMacAddr.toUpperCase();

            console.log(MacAPSinhVien + " == " + teacher.macAddr)

            if (MacAPSinhVien == teacher.macAddr) {
                CheckMAC = true;
                console.log("[2] MAC OK")
            }
            console.log(CheckMAC)
            //Bước 3: Kiểm tra sinh viên có trong lớp không
            var CheckStudentInClass = false;
            if (await Class.exists({ student: mssv }) == true) {
                CheckStudentInClass = true;
                console.log("[3] Danh sách OK")
            }
            console.log(CheckStudentInClass)

            //Bước 4: Kiểm tra một máy có điểm danh nhiều học sinh không
            var CheckPhoneMAC = false;
            const PhoneMAC = req.body.phoneMAC.toUpperCase();
            if (await Attendance.exists({ ClassID: classID, teacherEmail: teacher.email, studentPhoneMAC: PhoneMAC, buoi: buoi }) != true) {
                CheckPhoneMAC = true;
                console.log("[4] Không dùng một điện thoại điểm danh")
            }
            console.log(CheckPhoneMAC)

            var buoi = now.getWeek();
            console.log("Buổi thứ " + buoi)

            if (CheckTime && CheckMAC && CheckStudentInClass && CheckPhoneMAC) {
                const attendance = new Attendance({
                    ClassID: classID,
                    receivedTime: currentTime,
                    teacherEmail: teacher.email,
                    student: mssv,
                    studentPhoneMAC: PhoneMAC,
                    buoi: buoi
                });
                //Kiểm tra trùng
                if (await Attendance.exists({ ClassID: classID, teacherEmail: teacher.email, student: mssv, studentPhoneMAC: PhoneMAC, buoi: buoi }) != true) {
                    await attendance.save();
                    console.log(buoi);
                    if (await AttendanceSummary.exists({ ClassID: classID, student: mssv }) != true) {
                        const attendancesummary = new AttendanceSummary({ ClassID: classID, teacherEmail: teacher.email, student: mssv, buoi: buoi });
                        await attendancesummary.save();
                    } else {
                        const attendancesummary = await AttendanceSummary.findOne({ ClassID: classID, student: mssv });
                        attendancesummary.buoi.push(buoi);
                        await attendancesummary.save();
                        console.log(attendancesummary);
                    }
                    res.send({ buoi: buoi });
                } else {
                    res.sendStatus(409);
                }
            } else {
                res.sendStatus(400);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(401)
        }
    }
}

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = ((today - onejan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7)
};

async function getCurrentClassAttendance(req, res) {
    var idToken = req.body.idToken;
    verify(idToken);
    async function verify(token) {
        const { OAuth2Client } = require('google-auth-library');
        const CLIENT_ID = config.CLIENT_ID;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            var email = payload['email'];
            var mssv = email.split("@")[0];
            var ClassID = req.body.classID;
            if (await AttendanceSummary.exists({ ClassID: ClassID, student: mssv}) == true) {
                const result = await AttendanceSummary.findOne({ ClassID: ClassID, student: mssv}).select("buoi");
                res.send(result);
            } else {
                res.sendStatus(404);
            }
            
        } catch (error) {
            console.log(error)
            res.sendStatus(401);
        }
    }
}


async function getCurrent(req, res) {
    var idToken = req.body.idToken;
    verify(idToken);
    async function verify(token) {
        const { OAuth2Client } = require('google-auth-library');
        const CLIENT_ID = config.CLIENT_ID;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            var email = payload['email'];
            var mssv = email.split("@")[0];
            res.send(await Attendance.find({ student: mssv }));
            console.log(await Attendance.find({ student: mssv }))
        } catch (error) {
            res.sendStatus(401);
        }
    }
}