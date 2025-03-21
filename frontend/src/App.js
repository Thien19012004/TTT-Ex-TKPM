import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentSearch from './components/StudentSearch';

const App = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Fetch danh sách sinh viên khi component được mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // Hàm fetch danh sách sinh viên từ backend
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // Hàm xử lý thêm sinh viên
    const handleAddStudent = (student) => {
        setStudents([...students, student]);
    };

    // Hàm xử lý cập nhật sinh viên
    const handleUpdateStudent = (updatedStudent) => {
        setStudents(students.map(student => student.mssv === updatedStudent.mssv ? updatedStudent : student));
        setSelectedStudent(null);
    };

    // Hàm xử lý xóa sinh viên
    const handleDeleteStudent = async (mssv) => {
        try {
            await axios.delete(`http://localhost:5002/api/students/${mssv}`);
            setStudents(students.filter(student => student.mssv !== mssv));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // Hàm xử lý tìm kiếm sinh viên
    const handleSearch = async (query, faculty) => {
        try {
            const response = await axios.get('http://localhost:5002/api/students/search', {
                params: {
                    q: query, // Từ khóa tìm kiếm (tên hoặc MSSV)
                    faculty: faculty // Khoa được chọn
                }
            });
            setStudents(response.data); // Cập nhật danh sách sinh viên với kết quả tìm kiếm
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Quản lý sinh viên</h1>
            <StudentForm
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                selectedStudent={selectedStudent}
            />
            <StudentSearch onSearch={handleSearch} />
            <StudentList
                students={students}
                onDelete={handleDeleteStudent}
                onEdit={setSelectedStudent}
            />
        </div>
    );
};

export default App;