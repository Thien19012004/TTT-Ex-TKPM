import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentForm = ({ onAddStudent, onUpdateStudent, selectedStudent }) => {
    const [student, setStudent] = useState({
        mssv: '',
        name: '',
        dob: '',
        gender: '',
        faculty: '',
        course: '',
        program: '',
        address: '',
        email: '',
        phone: '',
        status: ''
    });

    useEffect(() => {
        if (selectedStudent) {
            setStudent(selectedStudent);
        }
    }, [selectedStudent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedStudent) {
                await axios.put(`http://localhost:5000/api/students/${student.mssv}`, student);
                onUpdateStudent(student);
            } else {
                await axios.post('http://localhost:5000/api/students', student);
                onAddStudent(student);
            }
            setStudent({
                mssv: '',
                name: '',
                dob: '',
                gender: '',
                faculty: '',
                course: '',
                program: '',
                address: '',
                email: '',
                phone: '',
                status: ''
            });
        } catch (error) {
            console.error('Error saving student:', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">{selectedStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Cột 1 */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">MSSV</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="mssv"
                                    placeholder="MSSV"
                                    value={student.mssv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Họ tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Họ tên"
                                    value={student.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ngày sinh</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="dob"
                                    placeholder="Ngày sinh"
                                    value={student.dob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Giới tính</label>
                                <select
                                    className="form-select"
                                    name="gender"
                                    value={student.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Khoa</label>
                                <select
                                    className="form-select"
                                    name="faculty"
                                    value={student.faculty}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn khoa</option>
                                    <option value="Khoa Luật">Khoa Luật</option>
                                    <option value="Khoa Tiếng Anh thương mại">Khoa Tiếng Anh thương mại</option>
                                    <option value="Khoa Tiếng Nhật">Khoa Tiếng Nhật</option>
                                    <option value="Khoa Tiếng Pháp">Khoa Tiếng Pháp</option>
                                </select>
                            </div>
                        </div>

                        {/* Cột 2 */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Khóa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="course"
                                    placeholder="Khóa"
                                    value={student.course}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Chương trình</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="program"
                                    placeholder="Chương trình"
                                    value={student.program}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Địa chỉ"
                                    value={student.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Email"
                                    value={student.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={student.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tình trạng</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={student.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn tình trạng</option>
                                    <option value="Đang học">Đang học</option>
                                    <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                                    <option value="Đã thôi học">Đã thôi học</option>
                                    <option value="Tạm dừng học">Tạm dừng học</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Nút submit */}
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary">
                            {selectedStudent ? 'Cập nhật' : 'Thêm sinh viên'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;