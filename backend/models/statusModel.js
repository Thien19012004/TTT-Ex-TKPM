const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Tên trạng thái (duy nhất)
});

module.exports = mongoose.model('Status', statusSchema);