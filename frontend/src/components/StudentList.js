import axios from 'axios';
import React, { useState, useEffect } from 'react';

const StudentList = ({ students, onDelete, onEdit, onImport, onExport }) => {
    const [exportFormat, setExportFormat] = useState('csv');
    const [faculties, setFaculties] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [programs, setPrograms] = useState([]);

    // Create a reference to the hidden file input
    const fileInputRef = React.useRef(null);

    // Handle the button click to trigger the file input
    const handleImportClick = () => {
        fileInputRef.current.click(); // Programmatically click the hidden file input
    };

    // Handle the file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImport(event); // Pass the event to the parent component
        }
    };

    const handleExportClick = () => {
        onExport(students, exportFormat, faculties, statuses, programs);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultiesRes, programsRes, statusesRes] = await Promise.all([
                    axios.get("http://localhost:5002/api/faculties"),
                    axios.get("http://localhost:5002/api/programs"),
                    axios.get("http://localhost:5002/api/statuses"),
                ]);

                setFaculties(facultiesRes.data);
                setStatuses(statusesRes.data);
                setPrograms(programsRes.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [students]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Danh sách sinh viên</h5>
                    <div className="d-flex align-items-center">
                        <select
                            className="form-select me-2"
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            style={{ width: 'auto' }}
                        >
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".xlsx"
                        />
                        {/* Import button */}
                        <button className="btn btn-primary me-2" onClick={handleImportClick}>
                            Import File
                        </button>
                        <button className="btn btn-success" onClick={handleExportClick}>Export File</button>
                    </div>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Khoa</th>
                            <th>Khóa</th>
                            <th>Chương trình</th>
                            <th>Địa chỉ thường trú</th>
                            <th>Địa chỉ tạm trú</th>
                            <th>Địa chỉ nhận thư</th>
                            <th>Giấy tờ CMND/CCCD/Passport</th>
                            <th>Quốc tịch</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Tình trạng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.mssv}>
                                <td>{student.mssv}</td>
                                <td>{student.name}</td>
                                <td>{new Date(student.dob).toLocaleDateString()}</td>
                                <td>{student.gender}</td>
                                <td>{faculties.find(faculty => faculty._id === student.faculty)?.name || "Không xác định"}</td>
                                <td>{student.course}</td>
                                <td>{programs.find(program => program._id === student.program)?.name || "Không xác định"}</td>
                                <td>
                                    {student.permanentAddress.street}, {student.permanentAddress.ward}, {student.permanentAddress.district}, {student.permanentAddress.city}, {student.permanentAddress.country}
                                </td>
                                <td>
                                    {student.temporaryAddress.street}, {student.temporaryAddress.ward}, {student.temporaryAddress.district}, {student.temporaryAddress.city}, {student.temporaryAddress.country}
                                </td>
                                <td>
                                    {student.mailingAddress.street}, {student.mailingAddress.ward}, {student.mailingAddress.district}, {student.mailingAddress.city}, {student.mailingAddress.country}
                                </td>
                                <td>
                                    {student.identityDocument.type}: {student.identityDocument.number}<br />
                                    Ngày cấp: {new Date(student.identityDocument.issueDate).toLocaleDateString()}<br />
                                    Nơi cấp: {student.identityDocument.issuePlace}<br />
                                    {student.identityDocument.expiryDate && `Ngày hết hạn: ${new Date(student.identityDocument.expiryDate).toLocaleDateString()}`}<br />
                                    {student.identityDocument.type === 'CCCD' && `Có gắn chip: ${student.identityDocument.hasChip ? 'Có' : 'Không'}`}<br />
                                    {student.identityDocument.type === 'Passport' && `Quốc gia cấp: ${student.identityDocument.issueCountry}`}<br />
                                    {student.identityDocument.type === 'Passport' && `Ghi chú: ${student.identityDocument.notes}`}
                                </td>
                                <td>{student.nationality}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{statuses.find(status => status._id === student.status)?.name || "Không xác định"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => onEdit(student)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onDelete(student.mssv)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;