const config = require('../config.json')
const mongoose = require('mongoose')
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/users.model'),
    Teacher: require('../teachers/teachers.model'),
    Class: require('../classes/classes.model'),
    Attendance: require('../attendances/attendances.model'),
    AttendanceSummary: require('../attendances/attendancesummary.model')
}