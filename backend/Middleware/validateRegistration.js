const Course = require('../models/coursesModel');
const Class = require('../models/classModel');
const Registration = require('../models/registrationModel');
const Transcript = require('../models/transcriptModel');
const Student = require('../models/studentModel');

const validateRegistration = async (req, res, next) => {
  const { studentId, classId } = req.body;

  const student = await Student.findOne({ mssv: studentId });
  if (!student) {
    return res.status(400).json({ message: 'Sinh viên không tồn tại' });
  }

  // Check class existence
  const classData = await Class.findById(classId);
  if (!classData) {
    return res.status(400).json({ message: 'Lớp học không tồn tại' });
  }

  // Check course prerequisite
  const course = await Course.findById(classData.courseId);
  if (course.prerequisite) {
    const prereqCourse = await Course.findOne({ courseCode: course.prerequisite });
    if (prereqCourse) {
      const hasPassed = await Transcript.findOne({
        studentId,
        courseId: prereqCourse._id,
        grade: { $gte: 5 },
      });
      if (!hasPassed) {
        return res.status(400).json({ message: `Chưa hoàn thành môn tiên quyết: ${course.prerequisite}` });
      }
    }
  }

  // Check class capacity
  const registrations = await Registration.countDocuments({ classId });
  if (registrations >= classData.maxStudents) {
    return res.status(400).json({ message: 'Lớp học đã đủ số lượng sinh viên' });
  }

  // Check if already registered
  const existingRegistration = await Registration.findOne({ studentId, classId });
  if (existingRegistration) {
    return res.status(400).json({ message: 'Sinh viên đã đăng ký lớp học này' });
  }

  next();
};

module.exports = validateRegistration;