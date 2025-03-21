const Student = require('../models/studentModel');

// Lấy danh sách sinh viên
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        const formattedStudents = students.map(student => ({
            ...student._doc,
            dob: student.dob.toISOString().split('T')[0] // Định dạng lại ngày tháng
        }));
        res.json(formattedStudents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm sinh viên mới
const addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật thông tin sinh viên
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate({ mssv: req.params.mssv }, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa sinh viên
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ mssv: req.params.mssv });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tìm kiếm sinh viên
const searchStudents = async (req, res) => {
    try {
        const { q, faculty } = req.query; // Lấy query và tên khoa từ request
        let queryConditions = {};

        // Nếu có query (tìm kiếm theo tên hoặc MSSV)
        if (q) {
            queryConditions.$or = [
                { name: { $regex: q, $options: 'i' } }, // Tìm kiếm không phân biệt chữ hoa chữ thường
                { mssv: { $regex: q, $options: 'i' } }
            ];
        }
        console.log(req.query);
        // Nếu có faculty (tìm kiếm theo khoa)
        if (faculty) {
            queryConditions.faculty = faculty; // Thêm điều kiện tìm kiếm theo tên khoa
        }

        // Tìm kiếm sinh viên dựa trên các điều kiện
        const students = await Student.find(queryConditions);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents
};