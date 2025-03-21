const Student = require("../models/studentModel");

exports.importCSV = async (req , res) => {
    const students = req.body;

    try {
        for (const student of students) {
            if (!student.mssv || !student.name || !student.dob || !student.gender || !student.faculty) {
                throw new Error(`Missing required fields for student: ${JSON.stringify(student)}`);
            }
        }

        await Student.insertMany(students);
        res.status(200).send('Import thành công!');
    } catch (error) {
        console.error('Error importing students:', error);
        res.status(500).send('Có lỗi xảy ra khi import dữ liệu.');
    }
}