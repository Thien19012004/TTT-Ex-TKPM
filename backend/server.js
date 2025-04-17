require('dotenv').config(); // Đọc biến môi trường từ file .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const statusRoutes = require('./routes/statusRoutes');
const programRoutes = require('./routes/programRoutes');
const courseRoutes = require('./routes/courseRoute'); // Thêm route cho courses
const classRoutes = require('./routes/classesRoute'); // Thêm route cho classes
const registrationRoutes = require('./routes/registerRoute'); // Thêm route cho registrations
const transcriptRoutes = require('./routes/transcriptRoute'); // Thêm route cho transcripts

const app = express();
const port = process.env.PORT || 3000; // Sử dụng biến môi trường PORT

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sử dụng routes
app.use('/api/students', studentRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/courses', courseRoutes); // Thêm route cho courses
app.use('/api/classes', classRoutes); // Thêm route cho classes
app.use('/api/registrations', registrationRoutes); // Thêm route cho registrations
app.use('/api/transcripts', transcriptRoutes); // Thêm route cho transcripts

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});