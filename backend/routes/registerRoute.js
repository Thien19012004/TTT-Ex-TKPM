const express = require('express');
const router = express.Router();
const Registration = require('../models/registrationModel');
const validateRegistration = require('../Middleware/validateRegistration');

// Get registrations by student ID
router.get('/:mssv', async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.params.mssv });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get number of registrations for a class
router.get('/class/:classId', async (req, res) => {
  try {
    console.log(req.params.classId);
    const registrations = await Registration.find({ classId: req.params.classId });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a student for a class
router.post('/', validateRegistration, async (req, res) => {
  const registration = new Registration({
    studentId: req.body.studentId,
    classId: req.body.classId,
  });

  try {
    const newRegistration = await registration.save();
    res.status(201).json(newRegistration);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel a registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Đăng ký không tồn tại' });
    }

    // Check semester deadline (example: May 1, 2025)
    const semesterDeadline = new Date('2025-05-01');
    if (new Date() > semesterDeadline) {
      return res.status(400).json({ message: 'Đã quá thời hạn hủy đăng ký' });
    }

    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đăng ký đã được hủy' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;