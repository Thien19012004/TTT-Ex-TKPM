const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Tên chương trình (duy nhất)
});

module.exports = mongoose.model('Program', programSchema);