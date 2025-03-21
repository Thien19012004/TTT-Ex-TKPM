// models/Faculty.js
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Tên khoa (duy nhất)
});

module.exports = mongoose.model('Faculty', facultySchema);