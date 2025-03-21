import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Nhập thư viện xlsx
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
            const response = await axios.get('http://localhost:5000/api/students');
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
            await axios.delete(`http://localhost:5000/api/students/${mssv}`);
            setStudents(students.filter(student => student.mssv !== mssv));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // Hàm xử lý tìm kiếm sinh viên
    const handleSearch = async (query, faculty) => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/search', {
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

    const handleExport = (students, format) => {
        if (students.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }
    
        const headers = [
            "MSSV", "Họ tên", "Ngày sinh", "Giới tính", "Khoa", "Khóa", "Chương trình",
            "Địa chỉ thường trú", "Địa chỉ tạm trú", "Địa chỉ nhận thư", "Giấy tờ",
            "Quốc tịch", "Email", "Số điện thoại", "Tình trạng"
        ];
    
        const data = students.map(student => [
            student.mssv,
            student.name,
            new Date(student.dob).toLocaleDateString(),
            student.gender,
            student.faculty,
            student.course,
            student.program,
            `${student.permanentAddress.street}, ${student.permanentAddress.ward}, ${student.permanentAddress.district}, ${student.permanentAddress.city}, ${student.permanentAddress.country}`,
            `${student.temporaryAddress.street}, ${student.temporaryAddress.ward}, ${student.temporaryAddress.district}, ${student.temporaryAddress.city}, ${student.temporaryAddress.country}`,
            `${student.mailingAddress.street}, ${student.mailingAddress.ward}, ${student.mailingAddress.district}, ${student.mailingAddress.city}, ${student.mailingAddress.country}`,
            `${student.identityDocument.type}: ${student.identityDocument.number}, Ngày cấp: ${new Date(student.identityDocument.issueDate).toLocaleDateString()}, Nơi cấp: ${student.identityDocument.issuePlace}`,
            student.nationality,
            student.email,
            student.phone,
            student.status
        ]);
    
        if (format === 'csv') {
            // Xuất file CSV
            const csvRows = [headers.join(",")];
            data.forEach(row => csvRows.push(row.join(",")));
            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "students.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'excel') {
            // Xuất file Excel
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
            XLSX.writeFile(workbook, "students.xlsx");
        }
    };

    const handleImport = () => {

    }

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
                onImport={handleImport}
                onExport={handleExport}
            />
        </div>
    );
};

export default App;