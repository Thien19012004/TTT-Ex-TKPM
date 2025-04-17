const express = require('express');
const router = express.Router();
const Course = require('../models/coursesModel');
const Class = require('../models/classModel');
const Registration = require('../models/registrationModel');
const validateCourse = require('../Middleware/validateCourse');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new course
router.post('/', validateCourse, async (req, res) => {
  const course = new Course({
    courseCode: req.body.courseCode,
    name: req.body.name,
    credits: req.body.credits,
    department: req.body.department,
    description: req.body.description,
    prerequisite: req.body.prerequisite,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a course
router.put('/:id', validateCourse, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Khóa học không tồn tại' });
    }

    // Check if course has registrations
    const classes = await Class.find({ courseId: req.params.id });
    const hasRegistrations = await Registration.exists({
      classId: { $in: classes.map(c => c._id) },
    });

    if (hasRegistrations && req.body.credits !== course.credits) {
      return res.status(400).json({ message: 'Không thể thay đổi số tín chỉ vì đã có sinh viên đăng ký' });
    }

    if (req.body.courseCode !== course.courseCode) {
      return res.status(400).json({ message: 'Không thể thay đổi mã khóa học' });
    }

    course.name = req.body.name;
    course.description = req.body.description;
    course.department = req.body.department;
    course.credits = req.body.credits;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Khóa học không tồn tại' });
    }

    // Check if created within 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (course.createdAt < thirtyMinutesAgo) {
      return res.status(400).json({ message: 'Chỉ có thể xóa khóa học trong vòng 30 phút sau khi tạo' });
    }

    // Check if course has classes
    const hasClasses = await Class.exists({ courseId: req.params.id });
    if (hasClasses) {
      course.isActive = false; // Deactivate instead of delete
      await course.save();
      return res.json({ message: 'Khóa học đã được đánh dấu là không hoạt động' });
    }

    await course.remove();
    res.json({ message: 'Khóa học đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;