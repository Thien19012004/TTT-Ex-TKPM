const Status = require('../models/statusModel');
const Student = require('../models/studentModel');
// Lấy danh sách trạng thái
exports.getStatuses = async (req, res) => {
    try {
        const statuses = await Status.find();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm trạng thái mới
exports.addStatus = async (req, res) => {
    const status = new Status({
        name: req.body.name
    });

    try {
        const newStatus = await status.save();
        res.status(201).json(newStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật trạng thái
exports.updateStatus = async (req, res) => {
    try {
        const updatedStatus = await Status.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        res.json(updatedStatus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa trạng thái
exports.deleteStatus = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ request params
        const existingStudents = await Student.findOne({ status: id });
        if (existingStudents) {
                    return res.status(400).json({ message: "Không thể xóa vì có sinh viên đang thuộc trạng thái này!" });
                }
        await Status.findByIdAndDelete(req.params.id);
        res.json({ message: 'Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};