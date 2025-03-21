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
        permanentAddress: { street: '', ward: '', district: '', city: '', country: '' },
        temporaryAddress: { street: '', ward: '', district: '', city: '', country: '' },
        mailingAddress: { street: '', ward: '', district: '', city: '', country: '' },
        identityDocument: {
            type: 'CMND',
            number: '',
            issueDate: '',
            issuePlace: '',
            expiryDate: '',
            hasChip: false,
            issueCountry: '',
            notes: ''
        },
        nationality: '',
        email: '',
        phone: '',
        status: ''
    });

    const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi

    useEffect(() => {
        if (selectedStudent) {
            setStudent(selectedStudent);
        }
    }, [selectedStudent]);

    // Hàm kiểm tra tính hợp lệ
    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!student.email || !emailRegex.test(student.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^0\d{9}$/;
        if (!student.phone || !phoneRegex.test(student.phone)) {
            newErrors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });

        // Xóa thông báo lỗi khi người dùng nhập lại
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleAddressChange = (type, field, value) => {
        setStudent({
            ...student,
            [type]: { ...student[type], [field]: value }
        });
    };

    const handleIdentityDocumentChange = (field, value) => {
        setStudent({
            ...student,
            identityDocument: { ...student.identityDocument, [field]: value }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ trước khi gửi dữ liệu
        if (!validateForm()) {
            return; // Dừng lại nếu có lỗi
        }

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
                permanentAddress: { street: '', ward: '', district: '', city: '', country: '' },
                temporaryAddress: { street: '', ward: '', district: '', city: '', country: '' },
                mailingAddress: { street: '', ward: '', district: '', city: '', country: '' },
                identityDocument: {
                    type: 'CMND',
                    number: '',
                    issueDate: '',
                    issuePlace: '',
                    expiryDate: '',
                    hasChip: false,
                    issueCountry: '',
                    notes: ''
                },
                nationality: '',
                email: '',
                phone: '',
                status: ''
            });
            setErrors({}); // Xóa thông báo lỗi sau khi gửi thành công
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
                                <label className="form-label">Quốc tịch</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nationality"
                                    placeholder="Quốc tịch"
                                    value={student.nationality}
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
                                <label className="form-label">Địa chỉ thường trú</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Số nhà, Tên đường"
                                    value={student.permanentAddress.street}
                                    onChange={(e) => handleAddressChange('permanentAddress', 'street', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Phường/Xã"
                                    value={student.permanentAddress.ward}
                                    onChange={(e) => handleAddressChange('permanentAddress', 'ward', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Quận/Huyện"
                                    value={student.permanentAddress.district}
                                    onChange={(e) => handleAddressChange('permanentAddress', 'district', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Tỉnh/Thành phố"
                                    value={student.permanentAddress.city}
                                    onChange={(e) => handleAddressChange('permanentAddress', 'city', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Quốc gia"
                                    value={student.permanentAddress.country}
                                    onChange={(e) => handleAddressChange('permanentAddress', 'country', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Cột 2 */}
                        <div className="col-md-6">
                            {/* Địa chỉ tạm trú */}
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Địa chỉ tạm trú</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Số nhà, Tên đường"
                                        value={student.temporaryAddress.street}
                                        onChange={(e) => handleAddressChange('temporaryAddress', 'street', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Phường/Xã"
                                        value={student.temporaryAddress.ward}
                                        onChange={(e) => handleAddressChange('temporaryAddress', 'ward', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Quận/Huyện"
                                        value={student.temporaryAddress.district}
                                        onChange={(e) => handleAddressChange('temporaryAddress', 'district', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Tỉnh/Thành phố"
                                        value={student.temporaryAddress.city}
                                        onChange={(e) => handleAddressChange('temporaryAddress', 'city', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Quốc gia"
                                        value={student.temporaryAddress.country}
                                        onChange={(e) => handleAddressChange('temporaryAddress', 'country', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Địa chỉ nhận thư */}
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Địa chỉ nhận thư</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Số nhà, Tên đường"
                                        value={student.mailingAddress.street}
                                        onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Phường/Xã"
                                        value={student.mailingAddress.ward}
                                        onChange={(e) => handleAddressChange('mailingAddress', 'ward', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Quận/Huyện"
                                        value={student.mailingAddress.district}
                                        onChange={(e) => handleAddressChange('mailingAddress', 'district', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Tỉnh/Thành phố"
                                        value={student.mailingAddress.city}
                                        onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Quốc gia"
                                        value={student.mailingAddress.country}
                                        onChange={(e) => handleAddressChange('mailingAddress', 'country', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Giấy tờ chứng minh nhân thân */}
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Giấy tờ chứng minh nhân thân</h6>
                                    <select
                                        className="form-control mb-2"
                                        value={student.identityDocument.type}
                                        onChange={(e) => handleIdentityDocumentChange('type', e.target.value)}
                                    >
                                        <option value="CMND">Chứng minh nhân dân (CMND)</option>
                                        <option value="CCCD">Căn cước công dân (CCCD)</option>
                                        <option value="Passport">Hộ chiếu (Passport)</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Số CMND/CCCD/Hộ chiếu"
                                        value={student.identityDocument.number}
                                        onChange={(e) => handleIdentityDocumentChange('number', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        placeholder="Ngày cấp"
                                        value={student.identityDocument.issueDate}
                                        onChange={(e) => handleIdentityDocumentChange('issueDate', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Nơi cấp"
                                        value={student.identityDocument.issuePlace}
                                        onChange={(e) => handleIdentityDocumentChange('issuePlace', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        placeholder="Ngày hết hạn"
                                        value={student.identityDocument.expiryDate}
                                        onChange={(e) => handleIdentityDocumentChange('expiryDate', e.target.value)}
                                    />
                                    {student.identityDocument.type === 'CCCD' && (
                                        <div className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={student.identityDocument.hasChip}
                                                onChange={(e) => handleIdentityDocumentChange('hasChip', e.target.checked)}
                                            />
                                            <label className="form-check-label">Có gắn chip</label>
                                        </div>
                                    )}
                                    {student.identityDocument.type === 'Passport' && (
                                        <>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="Quốc gia cấp"
                                                value={student.identityDocument.issueCountry}
                                                onChange={(e) => handleIdentityDocumentChange('issueCountry', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="Ghi chú"
                                                value={student.identityDocument.notes}
                                                onChange={(e) => handleIdentityDocumentChange('notes', e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    placeholder="Email"
                                    value={student.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={student.phone}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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