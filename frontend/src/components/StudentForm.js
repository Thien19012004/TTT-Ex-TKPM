import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ValidationConfigForm from './ValidationConfigForm';

const StudentForm = ({ onAddStudent, onUpdateStudent, selectedStudent }) => {
    // Configuration for validation rules
    const [showConfig, setShowConfig] = useState(false);

// Replace the hardcoded validationConfig with this:
    const [validationConfig, setValidationConfig] = useState(() => {
    const savedConfig = localStorage.getItem('validationConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
        emailDomain: '@student.university.edu.vn',
        phonePatterns: {
            phonePatterns: /^(?:\+84|0)([3|5|7|8|9])([0-9]{8})$/
        },
        statusTransitions: {
            'Đang học': ['Bảo lưu', 'Tốt nghiệp', 'Đình chỉ'],
            'Bảo lưu': ['Đang học', 'Thôi học'],
            'Đình chỉ': ['Đang học', 'Thôi học'],
            'Tốt nghiệp': []
            }
        };
    });

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

    const [errors, setErrors] = useState({});
    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [currentStatusName, setCurrentStatusName] = useState('');

    useEffect(() => {
        if (selectedStudent) {
            setStudent(selectedStudent);
            // Find and set current status name when data is loaded
            if (statuses.length > 0) {
                const currentStatus = statuses.find(s => s._id === selectedStudent.status);
                if (currentStatus) setCurrentStatusName(currentStatus.name);
            }
        }

        const fetchData = async () => {
            try {
                const [facultiesRes, programsRes, statusesRes] = await Promise.all([
                    axios.get("http://localhost:5002/api/faculties"),
                    axios.get("http://localhost:5002/api/programs"),
                    axios.get("http://localhost:5002/api/statuses"),
                ]);

                setFaculties(facultiesRes.data);
                setPrograms(programsRes.data);
                setStatuses(statusesRes.data);

                // Set current status name after statuses are loaded
                if (selectedStudent) {
                    const currentStatus = statusesRes.data.find(s => s._id === selectedStudent.status);
                    if (currentStatus) setCurrentStatusName(currentStatus.name);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [selectedStudent]);

    const validateForm = () => {
        const newErrors = {};
    
        // Email validation
        if (!student.email || !student.email.endsWith(validationConfig.emailDomain)) {
            newErrors.email = `Email phải thuộc tên miền ${validationConfig.emailDomain}`;
        }
    
        // Phone validation - convert string pattern to RegExp if needed
        const phonePattern = typeof validationConfig.phonePatterns.phonePatterns === 'string' ? 
            new RegExp(validationConfig.phonePatterns.phonePatterns) : 
            validationConfig.phonePatterns.phonePatterns;
        
        if (!student.phone || !phonePattern.test(student.phone)) {
            newErrors.phone = 'Số điện thoại phải có định dạng +84 hoặc 0 theo sau bởi 3/5/7/8/9 và 8 chữ số';
        }
    
        // Status transition validation
        if (selectedStudent && student.status) {
            const newStatus = statuses.find(s => s._id === student.status);
            if (newStatus && currentStatusName) {
                const allowedTransitions = validationConfig.statusTransitions[currentStatusName] || [];
                if (!allowedTransitions.includes(newStatus.name)) {
                    newErrors.status = `Không thể chuyển từ "${currentStatusName}" sang "${newStatus.name}"`;
                }
            }
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "status") {
            const newStatus = statuses.find(s => s._id === value);
            if (newStatus) setCurrentStatusName(newStatus.name);
        }
    
        let selectedId = value;
    
        if (name === "faculty") {
            selectedId = faculties.find(f => f._id === value)?._id || value;
        } else if (name === "status") {
            selectedId = statuses.find(s => s._id === value)?._id || value;
        } else if (name === "program") {
            selectedId = programs.find(p => p._id === value)?._id || value;
        }
    
        setStudent({ ...student, [name]: selectedId });
    
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
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

        if (!validateForm()) return;

        try {
            if (selectedStudent) {
                await axios.put(`http://localhost:5002/api/students/${student.mssv}`, student);
                onUpdateStudent(student);
            } else {
                await axios.post('http://localhost:5002/api/students', student);
                onAddStudent(student);
            }
            // Reset form
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
            setErrors({});
            setCurrentStatusName('');
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
                        {/* Column 1 */}
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
                                    {faculties.map((faculty) => (
                                        <option key={faculty._id} value={faculty._id}>
                                            {faculty.name}
                                        </option>
                                    ))}
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
                                <select
                                    className="form-select"
                                    name="program"
                                    value={student.program}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn chương trình</option>
                                    {programs.map((program) => (
                                        <option key={program._id} value={program._id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
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

                        {/* Column 2 */}
                        <div className="col-md-6">
                            {/* Temporary Address */}
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

                            {/* Mailing Address */}
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

                            {/* Identity Document */}
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
                                    placeholder={`Email (phải kết thúc bằng ${validationConfig.emailDomain})`}
                                    value={student.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <button 
                                    className="btn btn-sm btn-outline-secondary float-end" 
                                    onClick={() => setShowConfig(true)} 
                                    >
                                    Cấu hình validation
                            </button>
                            {showConfig && (
                            <ValidationConfigForm 
                                onClose={() => {
                                const savedConfig = localStorage.getItem('validationConfig');
                                if (savedConfig) {
                                    setValidationConfig(JSON.parse(savedConfig));
                                }
                                setShowConfig(false);
                                }} 
                                />
                            )}
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    name="phone"
                                    placeholder="Số điện thoại (0 hoặc +84 theo sau bởi 3/5/7/8/9 và 8 số)"
                                    value={student.phone}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Trạng thái</label>
                                <select
                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                    name="status"
                                    value={student.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn trạng thái</option>
                                    {statuses.map((status) => (
                                        <option key={status._id} value={status._id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                            </div>
                        </div>
                    </div>

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