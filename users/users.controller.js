const express = require('express')
const router = express.Router()
const userService = require('./users.service')

router.post('/authenticate', authenticate)
router.post('/register', createUser)
router.post('/edit', editUser)

module.exports = router;

function authenticate(req, res) {
    userService.authenticate(req, res);
}

function createUser(req, res) {
    userService.create(req, res);
}

function editUser(req, res) {
    userService.update(req, res);
}