require('dotenv').config(); // Đọc biến môi trường từ file .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const statusRoutes = require('./routes/statusRoutes');
const programRoutes = require('./routes/programRoutes'); // Import routes cho program

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
app.use('/api/programs', programRoutes); // Thêm routes cho program

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});