const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Registration', registrationSchema);