const express = require('express')
const router = express.Router()
const classService = require('./classes.service')

router.post('/getcurrentclass', getCurrent)
router.post('/createclass', createClass)
router.post('/getall', getAll)
router.post('/enrollclass', joinClass)
router.post('/getTeacherClass', getTeacherClasses)

module.exports = router;

function getCurrent(req, res) {
    classService.getCurrentClasses(req, res)
}

function createClass(req, res) {
    classService.create(req, res)
}

function getAll(req, res) {
    classService.getAllClasses(req, res)
}

function joinClass(req, res) {
    classService.insertClass(req, res);
}

function getTeacherClasses(req, res) {
    classService.getTeacherClass(req, res);
}