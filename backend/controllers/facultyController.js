// controllers/facultyController.js
const logger = require('../log/logger');
const Faculty = require('../models/facultyModel');
const Student = require('../models/studentModel');
// Lấy danh sách khoa
const getFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.json(faculties);
    } catch (err) {
        logger.error({ message: `Error: ${err} ` });
        res.status(500).json({ message: err.message });
    }
};

// Thêm khoa mới
const addFaculty = async (req, res) => {
    const faculty = new Faculty({ name: req.body.name });
    try {
        const newFaculty = await faculty.save();
        logger.info({ message: `Faculty: ${req.body.name} add successfully` });
        res.status(201).json(newFaculty);
    } catch (err) {
        logger.error({ message: `Error: ${err} ` });
        res.status(400).json({ message: err.message });
    }
};

// Đổi tên khoa
const updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        logger.info({ message: `Faculty: ${req.body.name} update successfully` });
        res.json(faculty);
    } catch (err) {
        logger.error({ message: `Error: ${err} ` });
        res.status(400).json({ message: err.message });
    }
};

// Xóa khoa
const deleteFaculty = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ request params
        console.log(id);
        // Kiểm tra xem có sinh viên nào thuộc khoa này không
        const existingStudents = await Student.findOne({ faculty: id });

        if (existingStudents) {
            return res.status(400).json({ message: "Không thể xóa vì có sinh viên đang thuộc khoa này!" });
        }

        // Xóa khoa nếu không có sinh viên thuộc khoa đó
        const faculty = await Faculty.findByIdAndDelete(id);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        logger.info({ message: `Faculty: ${req.body.name} delete successfully` });
        res.status(204).send();

    } catch (err) {
        res.status(500).json({ message: err.message });
        logger.error({ message: `Error: ${err} ` });
    }
};


module.exports = {
    getFaculties,
    addFaculty,
    updateFaculty,
    deleteFaculty
};