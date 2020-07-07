const bodyParser = require('body-parser')
const express = require('express')
const config = require('./config.json');
const app = express()
var os = require('os');
const port = process.env.PORT || 80

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', require('./users/users.controller'))
app.use('/teacher', require('./teachers/teachers.controller'))
app.use('/class', require('./classes/classes.controller'))
app.use('/attendance', require('./attendances/attendances.controller'))

app.listen(port)
console.log("started at port " + port)

