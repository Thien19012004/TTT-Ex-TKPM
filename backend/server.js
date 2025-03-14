const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let students = [];

// Lấy danh sách sinh viên
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Thêm sinh viên mới
app.post('/api/students', (req, res) => {
    const student = req.body;
    students.push(student);
    res.status(201).json(student);
});

// Cập nhật thông tin sinh viên
app.put('/api/students/:mssv', (req, res) => {
    const mssv = req.params.mssv;
    const updatedStudent = req.body;
    students = students.map(student => student.mssv === mssv ? updatedStudent : student);
    res.json(updatedStudent);
});

// Xóa sinh viên
app.delete('/api/students/:mssv', (req, res) => {
    const mssv = req.params.mssv;
    students = students.filter(student => student.mssv !== mssv);
    res.status(204).send();
});

// Tìm kiếm sinh viên
app.get('/api/students/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    const results = students.filter(student =>
        student.name.toLowerCase().includes(query) || student.mssv.toLowerCase().includes(query)
    );
    res.json(results);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});