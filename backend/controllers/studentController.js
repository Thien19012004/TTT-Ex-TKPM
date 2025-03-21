const logger = require('../log/logger');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');

// Lấy danh sách sinh viên
const getStudents = async (req, res) => {
    try {
        const students = await Student.find()

        const formattedStudents = students.map(student => ({
            ...student._doc,
            dob: student.dob.toISOString().split('T')[0]
        }));
        res.json(formattedStudents);
    } catch (err) {
        logger.error({ message: `Error: ${err}` });
        res.status(500).json({ message: err.message });
    }
};

// Thêm sinh viên mới
const addStudent = async (req, res) => {
    try {
        const { faculty, program, status } = req.body;

        // Kiểm tra xem khoa, chương trình, trạng thái có tồn tại không
        const facultyExists = await Faculty.findById(faculty);
        if (!facultyExists) {
            return res.status(400).json({ message: "Faculty không tồn tại" });
        }

        const student = new Student(req.body);
        await student.save();
        logger.info({ message: `Student: ${req.body.mssv} add successfully` });
        res.status(201).json(student);
    } catch (err) {
        logger.error({ message: `Error: ${err}` });
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật thông tin sinh viên
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate({ mssv: req.params.mssv }, req.body, { new: true })
            .populate('faculty', 'name')
            .populate('program', 'name')
            .populate('status', 'name');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        logger.info({ message: `Student: ${req.params.mssv} updated successfully` });
        res.json(student);
    } catch (err) {
        logger.error({ message: `Error: ${err}` });
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
        logger.info({ message: `Student: ${req.params.mssv} deleted successfully` });
        res.status(204).send();
    } catch (err) {
        logger.error({ message: `Error: ${err}` });
        res.status(500).json({ message: err.message });
    }
};

// Tìm kiếm sinh viên
const searchStudents = async (req, res) => {
    try {
        const { q, faculty } = req.query;
        let queryConditions = {};

        if (q) {
            queryConditions.$or = [
                { name: { $regex: q, $options: 'i' } },
                { mssv: { $regex: q, $options: 'i' } }
            ];
        }

        if (faculty) {
            queryConditions.faculty = faculty;
        }

        const students = await Student.find(queryConditions)

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật tên khoa trong tất cả sinh viên khi khoa bị đổi tên
const updateFacultyName = async (facultyId, newName) => {
    try {
        await Student.updateMany({ faculty: facultyId }, { $set: { "faculty.name": newName } });
    } catch (err) {
        console.error("Lỗi khi cập nhật tên khoa:", err.message);
    }
};

// Cập nhật khoa
const updateFaculty = async (req, res) => {
    try {
        const { facultyId } = req.params;
        const { name } = req.body;

        const faculty = await Faculty.findByIdAndUpdate(facultyId, { name }, { new: true });

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Cập nhật lại tên khoa trong danh sách sinh viên
        await updateFacultyName(facultyId, name);

        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    updateFaculty
};
