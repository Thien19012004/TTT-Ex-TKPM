const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  grade: { type: Number, required: true, min: 0, max: 10 },
  semester: { type: String, required: true },
});

module.exports = mongoose.model('Transcript', transcriptSchema);