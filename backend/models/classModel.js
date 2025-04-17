const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  classCode: { type: String, required: true, unique: true },
  Name: { type: String, required: true, unique: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  lecturer: { type: String, required: true },
  maxStudents: { type: Number, required: true, min: 1 },
  schedule: { type: String },
  room: { type: String },
});

module.exports = mongoose.model('Class', classSchema);