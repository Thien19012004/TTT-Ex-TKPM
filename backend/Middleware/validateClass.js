const Course = require('../models/coursesModel');

const validateClass = async (req, res, next) => {
  const { classCode, courseId, maxStudents } = req.body;

  // Check course existence
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json({ message: 'Khóa học không tồn tại' });
  }

  // Check max students
  if (maxStudents < 1) {
    return res.status(400).json({ message: 'Số lượng sinh viên tối đa phải lớn hơn 0' });
  }

  // Check class code uniqueness
  const existingClass = await Class.findOne({ classCode });
  if (existingClass) {
    return res.status(400).json({ message: 'Mã lớp học đã tồn tại' });
  }

  next();
};

module.exports = validateClass;