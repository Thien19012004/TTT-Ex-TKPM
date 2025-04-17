const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const validateClass = require('../Middleware/validateClass');

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('courseId');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new class
router.post('/', validateClass, async (req, res) => {
  const classData = new Class({
    classCode: req.body.classCode,
    courseId: req.body.courseId,
    academicYear: req.body.academicYear,
    semester: req.body.semester,
    lecturer: req.body.lecturer,
    maxStudents: req.body.maxStudents,
    schedule: req.body.schedule,
    room: req.body.room,
  });

  try {
    const newClass = await classData.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;