const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    email: { type: String, unique: true, sparse: true, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    profilepic: { type: String },
    macAddr: { type: String }
}, { collection: 'teachers' })

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Teacher', schema);