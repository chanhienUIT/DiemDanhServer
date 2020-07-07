const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    classID: { type: String, unique: true, sparse: true, required: true },
    className: { type: String, required: true },
    student: [{ type: String }],
    teacherEmail: { type: String, required: true },
    teacher: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    day: { type: String, required: true }
}, { collection: 'classes' })

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Class', schema);