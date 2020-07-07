const express = require('express')
const router = express.Router()
const teacherService = require('./teachers.service')

router.post('/authenticate', authenticate)
router.post('/register', createUser)

module.exports = router;

function authenticate(req, res) {
    teacherService.authenticate(req, res);
}

function createUser(req, res) {
    teacherService.create(req, res)
}

