// backend/routes/studentRoutes.js
const express = require('express');
const {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents
} = require('../controllers/studentController');

const router = express.Router();

// Định nghĩa các route
router.get('/', getStudents);
router.post('/', addStudent);
router.put('/:mssv', updateStudent);
router.delete('/:mssv', deleteStudent);
router.get('/search', searchStudents);

module.exports = router;