const db = require('../_helpers/db')
const config = require('../config.json');
const { Teacher } = require('../_helpers/db');

const Class = db.Class

module.exports = {
    create,
    getAllClasses,
    getCurrentClasses,
    insertClass,
    getTeacherClass
}

async function create(req, res) {
    var idToken = req.body.idToken;
    verifyCreate(idToken);
    async function verifyCreate(token) {
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
            const _class = new Class({
                classID: req.body.classID,
                className: req.body.className,
                teacherEmail: email,
                teacher: req.body.name,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                day: req.body.day
            });
            if (Class.exists({classID: req.body.classID}) != true) {
                await _class.save();
                res.sendStatus(200);
            } else {
                res.sendStatus(409);
            }
            console.log(email + " creates class " + req.body.classID);
        } catch (error) {
            console.log(error);
            res.sendStatus(401)
        }
    }
}

async function getAllClasses(req, res) {
    var idToken = req.body.idToken;
    verifyGetAll(idToken);
    async function verifyGetAll(token) {
        const { OAuth2Client } = require('google-auth-library');
        const CLIENT_ID = config.CLIENT_ID;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            res.send(await Class.find());
            console.log(email + " gets all classes")
        } catch (error) {
            console.log(error);
            res.sendStatus(401)
        }
    }
}

async function getCurrentClasses(req, res) {
    var idToken = req.body.idToken;
    verifyGetAll(idToken);
    async function verifyGetAll(token) {
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
            res.send(await Class.find({ student: mssv }).select('-_id -student'));
            console.log(email + " gets current classes")
        } catch (error) {
            console.log(error);
            res.sendStatus(401);
        }
    }
}

async function insertClass(req, res) {
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
            const classID = req.body.ClassID;
            if (await Class.exists({ classID: classID, student: mssv }) != true) {
                const _class = await Class.findOne({ classID: classID });
                _class.student.push(mssv);
                await _class.save();
                res.sendStatus(200);
            } else {
                res.sendStatus(409)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(401);
        }
    }
}

async function getTeacherClass(req, res) {
    var idToken = req.body.idToken;
    verifyGetAll(idToken);
    async function verifyGetAll(token) {
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
            res.send(await Class.find({ teacherEmail: email }));
            console.log(email + "(teacher) gets current classes")
        } catch (error) {
            console.log(error);
            res.sendStatus(401);
        }
    }
}