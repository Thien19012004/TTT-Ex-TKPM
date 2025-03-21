const express = require('express');
const {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    updateFaculty
} = require('../controllers/studentController');

const router = express.Router();

// Lấy danh sách sinh viên
router.get('/', getStudents);

// Thêm sinh viên mới
router.post('/', addStudent);

// Cập nhật thông tin sinh viên
router.put('/:mssv', updateStudent);

// Xóa sinh viên
router.delete('/:mssv', deleteStudent);

// Tìm kiếm sinh viên
router.get('/search', searchStudents);

// Cập nhật tên khoa và tự động cập nhật tên khoa cho sinh viên
router.put('/faculty/:facultyId', updateFaculty);

module.exports = router;
