import { useState } from 'react';
import React from 'react';

const StudentList = ({ students, onDelete, onEdit, onImport, onExport }) => {
    const [exportFormat, setExportFormat] = useState('csv'); // Mặc định là CSV

    const handleExportClick = () => {
        onExport(students, exportFormat); // Truyền định dạng vào hàm onExport
    };

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
                        <button className="btn btn-primary me-2" onClick={onImport}>Import File</button>
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
                                <td>{student.faculty}</td>
                                <td>{student.course}</td>
                                <td>{student.program}</td>
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
                                <td>{student.status}</td>
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