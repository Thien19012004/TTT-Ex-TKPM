const Course = require('../models/coursesModel');

const validateCourse = async (req, res, next) => {
  const { courseCode, credits, prerequisite } = req.body;

  // Check credits
  if (credits < 2) {
    return res.status(400).json({ message: 'Số tín chỉ phải lớn hơn hoặc bằng 2' });
  }

  // Check prerequisite
  if (prerequisite) {
    const prereqCourse = await Course.findOne({ courseCode: prerequisite });
    if (!prereqCourse) {
      return res.status(400).json({ message: 'Môn tiên quyết không tồn tại' });
    }
  }

  // Check course code uniqueness for POST
  if (req.method === 'POST') {
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Mã khóa học đã tồn tại' });
    }
  }

  next();
};

module.exports = validateCourse;