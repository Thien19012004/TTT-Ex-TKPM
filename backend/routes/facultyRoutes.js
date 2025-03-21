// routes/facultyRoutes.js
const express = require('express');
const {
    getFaculties,
    addFaculty,
    updateFaculty,
    deleteFaculty
} = require('../controllers/facultyController');

const router = express.Router();

// Định nghĩa các route
router.get('/', getFaculties); // Lấy danh sách khoa
router.post('/', addFaculty); // Thêm khoa mới
router.put('/:id', updateFaculty); // Đổi tên khoa
router.delete('/:id', deleteFaculty); // Xóa khoa

module.exports = router;