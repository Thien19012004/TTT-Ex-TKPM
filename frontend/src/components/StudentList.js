import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = ({ students, onDelete, onEdit }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Danh sách sinh viên</h5>
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
                            <th>Địa chỉ</th>
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
                                <td>{student.dob}</td>
                                <td>{student.gender}</td>
                                <td>{student.faculty}</td>
                                <td>{student.course}</td>
                                <td>{student.program}</td>
                                <td>{student.address}</td>
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