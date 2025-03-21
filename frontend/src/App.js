import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Nhập thư viện xlsx
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentSearch from './components/StudentSearch';
import Sidebar from './components/Sidebar';
import { Button, Container } from 'react-bootstrap';

const App = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

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

    const handleExport = (students, format, faculties, statuses, programs) => {
        console.log(faculties);
        console.log(statuses);
        console.log(programs);
        if (students.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }
    
        const headers = [
            "MSSV", "Họ tên", "Ngày sinh", "Giới tính", "Khoa", "Khóa", "Chương trình",
            "Địa chỉ thường trú", "Địa chỉ tạm trú", "Địa chỉ nhận thư", "Giấy tờ",
            "Quốc tịch", "Email", "Số điện thoại", "Tình trạng"
        ];
    
        const data = students.map(student => {
            const faculty = faculties.find(f => f._id === student.faculty);
            const program = programs.find(p => p._id === student.program);
            const status = statuses.find(s => s._id === student.status);
    
            console.log(`Student: ${student.name}, Faculty ID: ${student.faculty}, Mapped: ${faculty?.name}`);
            console.log(`Program ID: ${student.program}, Mapped: ${program?.name}`);
            console.log(`Status ID: ${student.status}, Mapped: ${status?.name}`);
    
            return [
                student.mssv,
                student.name,
                new Date(student.dob).toLocaleDateString(),
                student.gender,
                faculty ? faculty.name : student.faculty, // Nếu faculty tìm thấy thì lấy name, nếu không giữ nguyên id
                student.course,
                program ? program.name : student.program,
                `${student.permanentAddress.street}, ${student.permanentAddress.ward}, ${student.permanentAddress.district}, ${student.permanentAddress.city}, ${student.permanentAddress.country}`,
                `${student.temporaryAddress.street}, ${student.temporaryAddress.ward}, ${student.temporaryAddress.district}, ${student.temporaryAddress.city}, ${student.temporaryAddress.country}`,
                `${student.mailingAddress.street}, ${student.mailingAddress.ward}, ${student.mailingAddress.district}, ${student.mailingAddress.city}, ${student.mailingAddress.country}`,
                `${student.identityDocument.type}: ${student.identityDocument.number}, Ngày cấp: ${new Date(student.identityDocument.issueDate).toLocaleDateString()}, Nơi cấp: ${student.identityDocument.issuePlace}`,
                student.nationality,
                student.email,
                student.phone,
                status ? status.name : student.status
            ];
        });

        console.log(data);
    
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

    
    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Vui lòng chọn một file để import.");
            return;
        }
    
        if (!file.name.endsWith('.xlsx')) {
            alert("Vui lòng chọn file Excel (.xlsx).");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
    
            // Assuming the first sheet is the one to import
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
    
            // Convert sheet data to JSON
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
            // Assuming the first row is the header
            const headers = rows[0];
    
            // Map Excel column names to Mongoose schema field names
            const fieldMapping = {
                "MSSV": "mssv",
                "Họ tên": "name",
                "Ngày sinh": "dob",
                "Giới tính": "gender",
                "Khoa": "faculty",
                "Khóa": "course",
                "Chương trình": "program",
                "Địa chỉ thường trú": "permanentAddress",
                "Địa chỉ tạm trú": "temporaryAddress",
                "Địa chỉ nhận thư": "mailingAddress",
                "Giấy tờ": "identityDocument",
                "Quốc tịch": "nationality",
                "Email": "email",
                "Số điện thoại": "phone",
                "Tình trạng": "status"
            };
    
            // Fetch faculties, programs, and statuses from the backend
            let faculties, programs, statuses;
            try {
                const [facultiesRes, programsRes, statusesRes] = await Promise.all([
                    axios.get("http://localhost:5002/api/faculties"),
                    axios.get("http://localhost:5002/api/programs"),
                    axios.get("http://localhost:5002/api/statuses"),
                ]);
                faculties = facultiesRes.data;
                programs = programsRes.data;
                statuses = statusesRes.data;
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu từ backend:", error);
                alert("Có lỗi xảy ra khi lấy dữ liệu từ backend.");
                return;
            }
    
            const studentData = rows.slice(1).map(row => {
                const student = {};
                headers.forEach((header, index) => {
                    const fieldName = fieldMapping[header.trim()]; // Map header to field name
                    if (fieldName) {
                        student[fieldName] = row[index] ? row[index].trim() : ''; // Handle empty cells
                    }
                });
    
                // Convert date strings to Date objects
                if (student.dob) {
                    student.dob = new Date(student.dob);
                }
    
                // Map faculty, program, and status names to ObjectId references
                if (student.faculty) {
                    const faculty = faculties.find(f => f.name === student.faculty);
                    if (!faculty) {
                        console.error(`Không tìm thấy khoa với tên: ${student.faculty}`);
                        return null; // Skip this student if faculty is not found
                    }
                    student.faculty = faculty._id; // Map to ObjectId
                }
                if (student.program) {
                    const program = programs.find(p => p.name === student.program);
                    if (!program) {
                        console.error(`Không tìm thấy chương trình với tên: ${student.program}`);
                        return null; // Skip this student if program is not found
                    }
                    student.program = program._id; // Map to ObjectId
                }
                if (student.status) {
                    const status = statuses.find(s => s.name === student.status);
                    if (!status) {
                        console.error(`Không tìm thấy tình trạng với tên: ${student.status}`);
                        return null; // Skip this student if status is not found
                    }
                    student.status = status._id; // Map to ObjectId
                }
    
                // Parse address fields (if needed)
                if (student.permanentAddress) {
                    const addressParts = student.permanentAddress.split(', ');
                    if (addressParts.length === 5) {
                        const [street, ward, district, city, country] = addressParts;
                        student.permanentAddress = { street, ward, district, city, country };
                    } else {
                        student.permanentAddress = { street: '', ward: '', district: '', city: '', country: '' };
                    }
                }
    
                if (student.temporaryAddress) {
                    const addressParts = student.temporaryAddress.split(', ');
                    if (addressParts.length === 5) {
                        const [street, ward, district, city, country] = addressParts;
                        student.temporaryAddress = { street, ward, district, city, country };
                    } else {
                        student.temporaryAddress = { street: '', ward: '', district: '', city: '', country: '' };
                    }
                }
    
                if (student.mailingAddress) {
                    const addressParts = student.mailingAddress.split(', ');
                    if (addressParts.length === 5) {
                        const [street, ward, district, city, country] = addressParts;
                        student.mailingAddress = { street, ward, district, city, country };
                    } else {
                        student.mailingAddress = { street: '', ward: '', district: '', city: '', country: '' };
                    }
                }
    
                // Parse identity document (if needed)
                if (student.identityDocument) {
                    const documentParts = student.identityDocument.split(', ');
                    if (documentParts.length === 4) {
                        const [type, number, issueDate, issuePlace] = documentParts;
                        student.identityDocument = {
                            type: type.split(': ')[1] || '',
                            number: number.split(': ')[1] || '',
                            issueDate: new Date(issueDate.split(': ')[1]) || new Date(),
                            issuePlace: issuePlace.split(': ')[1] || ''
                        };
                    } else {
                        // Provide default values if the identity document is invalid
                        student.identityDocument = {
                            type: 'CCCD', // Default type
                            number: '000000000', // Default number
                            issueDate: new Date(), // Default issue date
                            issuePlace: 'VN' // Default issue place
                        };
                    }
                } else {
                    // Provide default values if identityDocument is missing
                    student.identityDocument = {
                        type: 'CCCD', // Default type
                        number: '000000000', // Default number
                        issueDate: new Date(), // Default issue date
                        issuePlace: 'VN' // Default issue place
                    };
                }
    
                return student;
            }).filter(student => student !== null); // Filter out skipped students
    
            try {
                const response = await axios.post('http://localhost:5002/api/students/import', studentData);
                if (response.status === 200) {
                    alert("Import thành công!");
                    fetchStudents(); // Refresh the student list
                }
            } catch (error) {
                console.error('Error importing students:', error);
                alert("Có lỗi xảy ra khi import dữ liệu.");
            }
    
            // Reset the file input after import
            event.target.value = "";
        };
    
        reader.readAsBinaryString(file); // Read XLSX as binary
    };
    return (
        <Container fluid className="mt-4">
            <h1 className="text-center mb-4">Quản lý sinh viên</h1>
            <Button variant="primary" onClick={() => setShowSidebar(true)}>
                Mở Sidebar
            </Button>
            <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />
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
        </Container>
    );
};

export default App;