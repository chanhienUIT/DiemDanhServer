const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    ClassID: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    student: { type: String, required: true },
    buoi: [{ type: String, required: true }]
}, { collection: 'attendancesummary' })

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AttendanceSummary', schema);