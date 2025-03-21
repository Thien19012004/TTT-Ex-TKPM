const Program = require('../models/programModel');
const Student = require('../models/studentModel');
// Lấy danh sách chương trình
exports.getPrograms = async (req, res) => {
    try {
        const programs = await Program.find();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm chương trình mới
exports.addProgram = async (req, res) => {
    const program = new Program({
        name: req.body.name
    });

    try {
        const newProgram = await program.save();
        res.status(201).json(newProgram);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật chương trình
exports.updateProgram = async (req, res) => {
    try {
        const updatedProgram = await Program.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        res.json(updatedProgram);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa chương trình
exports.deleteProgram = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ request params
        const existingStudents = await Student.findOne({ program: id });
        if (existingStudents) {
                    return res.status(400).json({ message: "Không thể xóa vì có sinh viên đang thuộc chương trình này!" });
                }
        await Program.findByIdAndDelete(req.params.id);
        res.json({ message: 'Program deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};