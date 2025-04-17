import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tab, Tabs, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ValidationConfigForm from './ValidationConfigForm';

const StudentForm = ({ onAddStudent, onUpdateStudent, selectedStudent }) => {
  // Validation config
  const [validationConfig, setValidationConfig] = useState(() => {
    const savedConfig = localStorage.getItem('validationConfig');
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          emailDomain: '@student.university.edu.vn',
          phonePatterns: {
            phonePatterns: /^(?:\+84|0)([3|5|7|8|9])([0-9]{8})$/,
          },
          statusTransitions: {
            'Đang học': ['Bảo lưu', 'Tốt nghiệp', 'Đình chỉ'],
            'Bảo lưu': ['Đang học', 'Thôi học'],
            'Đình chỉ': ['Đang học', 'Thôi học'],
            'Tốt nghiệp': [],
          },
        };
  });

  // Student state
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
      notes: '',
    },
    nationality: '',
    email: '',
    phone: '',
    status: '',
  });

  // Additional states
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentStatusName, setCurrentStatusName] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // State for course management
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseCode: '',
    name: '',
    credits: '',
    prerequisite: '',
  });

  // Ref để theo dõi selectedStudent trước đó
  const prevSelectedStudentRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return; // Ngăn gọi API khi đang tải
      setIsLoading(true);
      setError(null);

      try {
        const [facultiesRes, programsRes, statusesRes, coursesRes, classesRes, registeredRes, transcriptRes] =
          await Promise.all([
            axios.get('http://localhost:5002/api/faculties'),
            axios.get('http://localhost:5002/api/programs'),
            axios.get('http://localhost:5002/api/statuses'),
            axios.get('http://localhost:5002/api/courses'),
            axios.get('http://localhost:5002/api/classes'),
            selectedStudent
              ? axios.get(`http://localhost:5002/api/registrations/${selectedStudent.mssv}`)
              : Promise.resolve({ data: [] }),
            selectedStudent
              ? axios.get(`http://localhost:5002/api/transcripts/${selectedStudent.mssv}`)
              : Promise.resolve({ data: [] }),
          ]);

        console.log('Fetched courses:', coursesRes.data);
        console.log('Fetched classes:', classesRes.data);
        console.log('Fetched registrations:', registeredRes.data);
        console.log('Fetched transcript:', transcriptRes.data);

        setFaculties(facultiesRes.data);
        setPrograms(programsRes.data);
        setStatuses(statusesRes.data);
        setCourses(coursesRes.data);
        setClasses(classesRes.data);
        setRegisteredClasses(registeredRes.data);
        setTranscript(transcriptRes.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    // Chỉ cập nhật student và status khi selectedStudent thay đổi
    if (selectedStudent && selectedStudent !== prevSelectedStudentRef.current) {
      setStudent(selectedStudent);
      if (statuses.length > 0) {
        const currentStatus = statuses.find((s) => s._id === selectedStudent.status);
        if (currentStatus) setCurrentStatusName(currentStatus.name);
      }
    }

    fetchData();
    prevSelectedStudentRef.current = selectedStudent;
  }, [selectedStudent]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!student.email || !student.email.endsWith(validationConfig.emailDomain)) {
      newErrors.email = `Email phải thuộc tên miền ${validationConfig.emailDomain}`;
    }

    const phonePattern =
      typeof validationConfig.phonePatterns.phonePatterns === 'string'
        ? new RegExp(validationConfig.phonePatterns.phonePatterns)
        : validationConfig.phonePatterns.phonePatterns;

    if (student.phone && !phonePattern.test(student.phone)) {
      newErrors.phone = 'Số điện thoại phải có định dạng +84 hoặc 0 theo sau bởi 3/5/7/8/9 và 8 chữ số';
    }

    if (selectedStudent && student.status) {
      const newStatus = statuses.find((s) => s._id === student.status);
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Chỉ cập nhật nếu giá trị thay đổi
    if (student[name] === value) return;

    if (name === 'status') {
      const newStatus = statuses.find((s) => s._id === value);
      if (newStatus) setCurrentStatusName(newStatus.name);
    }

    let selectedId = value;

    if (name === 'faculty') {
      selectedId = faculties.find((f) => f._id === value)?._id || value;
    } else if (name === 'status') {
      selectedId = statuses.find((s) => s._id === value)?._id || value;
    } else if (name === 'program') {
      selectedId = programs.find((p) => p._id === value)?._id || value;
    }

    setStudent((prev) => ({ ...prev, [name]: selectedId }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (type, field, value) => {
    setStudent((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleIdentityDocumentChange = (field, value) => {
    setStudent((prev) => ({
      ...prev,
      identityDocument: { ...prev.identityDocument, [field]: value },
    }));
  };

  const handleRegisterClass = async (classId) => {
    try {
      console.log('Registering class ID:', classId);
      const selectedClass = classes.find((c) => c._id === classId);
      if (!selectedClass) {
        alert('Lớp học không tồn tại!');
        return;
      }

      console.log('Selected class:', selectedClass);
      const course = courses.find((c) => c._id === selectedClass.courseId._id);
      if (!course) {
        console.log('Courses:', courses);
        console.log('Class courseId:', selectedClass.courseId._id);
        alert('Không tìm thấy môn học tương ứng với lớp này!');
        return;
      }

      console.log('Course:', course);
      if (course.prerequisite) {
        const prerequisiteCourse = courses.find((c) => c.courseCode === course.prerequisite);
        if (!prerequisiteCourse) {
          alert(`Không tìm thấy môn tiên quyết: ${course.prerequisite}`);
          return;
        }
        const hasPrerequisite = transcript.some(
          (t) => t.courseId === prerequisiteCourse._id && t.grade >= 5
        );
        if (!hasPrerequisite) {
          alert(`Sinh viên chưa hoàn thành môn tiên quyết: ${course.prerequisite}`);
          return;
        }
      }

      const registrations = await axios.get(`http://localhost:5002/api/registrations/class/${classId}`);
      if (registrations.data.length >= selectedClass.maxStudents) {
        alert('Lớp học đã đủ số lượng sinh viên!');
        return;
      }

      await axios.post('http://localhost:5002/api/registrations', {
        studentId: student.mssv,
        classId,
      });

      const updatedRegistrations = await axios.get(`http://localhost:5002/api/registrations/${student.mssv}`);
      setRegisteredClasses(updatedRegistrations.data);
      alert('Đăng ký lớp học thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng ký lớp học:', error);
      alert(`Đã có lỗi xảy ra khi đăng ký lớp học: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      const semesterDeadline = new Date('2025-05-01');
      if (new Date() > semesterDeadline) {
        alert('Đã quá thời hạn hủy đăng ký!');
        return;
      }

      console.log('Canceling registration ID:', registrationId);
      const response = await axios.delete(`http://localhost:5002/api/registrations/${registrationId}`);
      console.log('Hủy đăng ký response:', response.data);

      const updatedRegistrations = await axios.get(`http://localhost:5002/api/registrations/${student.mssv}`);
      setRegisteredClasses(updatedRegistrations.data);
      alert('Hủy đăng ký thành công!');
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký:', error);
      alert(`Đã có lỗi xảy ra khi hủy đăng ký: ${error.response?.data?.message || error.message}`);
    }
  };

  const generateTranscriptPDF = () => {
    if (transcript.length === 0) {
      alert('Không có dữ liệu bảng điểm để xuất.');
      return;
    }

    try {
      const doc = new jsPDF();
      console.log('jsPDF instance:', doc);
      console.log('autoTable:', autoTable);

      autoTable(doc, {
        startY: 60,
        head: [['Mã môn', 'Tên môn', 'Điểm', 'Học kỳ']],
        body: transcript.map((t) => {
          const course = courses.find((c) => c._id === t.courseId);
          return [
            course?.courseCode || t.courseId,
            course?.name || 'Không xác định',
            t.grade,
            t.semester,
          ];
        }),
      });

      doc.text('Bảng Điểm Sinh Viên', 20, 20);
      doc.text(`MSSV: ${student.mssv}`, 20, 30);
      doc.text(`Họ tên: ${student.name}`, 20, 40);
      doc.text(`Khoa: ${faculties.find((f) => f._id === student.faculty)?.name || 'Không xác định'}`, 20, 50);

      const totalCredits = transcript.reduce((sum, t) => sum + (courses.find((c) => c._id === t.courseId)?.credits || 0), 0);
      const weightedSum = transcript.reduce(
        (sum, t) => sum + (t.grade * (courses.find((c) => c._id === t.courseId)?.credits || 0)),
        0
      );
      const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

      doc.text(`GPA: ${gpa}`, 20, doc.lastAutoTable.finalY + 10);
      doc.save(`bang_diem_${student.mssv}.pdf`);
    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error);
      alert('Đã xảy ra lỗi khi tạo bảng điểm PDF. Vui lòng kiểm tra console để biết thêm chi tiết.');
    }
  };

  // Course management handlers
  const handleAddCourse = async () => {
    try {
      const response = await axios.post('http://localhost:5002/api/courses', newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({ courseCode: '', name: '', credits: '', prerequisite: '' });
      setShowAddCourseModal(false);
      alert('Thêm khóa học thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khóa học:', error);
      alert(`Đã có lỗi xảy ra khi thêm khóa học: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return;
    try {
      console.log('Attempting to delete course:', courseId);
      // Find all classes associated with this course
      const classesForCourse = classes.filter((cls) => {
        const classCourseId = cls.courseId?._id || cls.courseId;
        console.log('Class:', cls.classCode, 'CourseId:', classCourseId);
        return classCourseId === courseId;
      });
      console.log('Classes for course:', classesForCourse);

      // Check for registrations in each class
      let hasRegistrations = false;
      for (const cls of classesForCourse) {
        console.log('Checking registrations for class:', cls.classCode, 'Class ID:', cls._id);
        const registrations = await axios.get(`http://localhost:5002/api/registrations/class/${cls._id}`);
        console.log('Registrations for class', cls.classCode, ':', registrations.data);
        if (registrations.data.length > 0) {
          hasRegistrations = true;
          break;
        }
      }

      if (hasRegistrations) {
        console.log('Course deletion blocked: Active registrations found');
        alert('Không thể xóa khóa học vì vẫn còn sinh viên đang theo học.');
        return;
      }

      console.log('No registrations found, proceeding with deletion');
      await axios.delete(`http://localhost:5002/api/courses/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
      alert('Xóa khóa học thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa khóa học:', error);
      alert(`Đã có lỗi xảy ra khi xóa khóa học: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
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
          notes: '',
        },
        nationality: '',
        email: '',
        phone: '',
        status: '',
      });
      setErrors({});
      setCurrentStatusName('');
      setRegisteredClasses([]);
      setTranscript([]);
    } catch (error) {
      console.error('Error saving student:', error);
      setError('Lỗi khi lưu sinh viên. Vui lòng thử lại.');
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{selectedStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        {isLoading && <Alert variant="info">Đang tải dữ liệu...</Alert>}
        <Tabs defaultActiveKey="info" id="student-tabs" className="mb-3">
          <Tab eventKey="info" title="Thông tin sinh viên">
            <form onSubmit={handleSubmit}>
              <div className="row">
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
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Địa chỉ tạm trú</label>
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
                  <div className="mb-3">
                    <label className="form-label">Địa chỉ nhận thư</label>
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
                  <div className="mb-3">
                    <label className="form-label">Giấy tờ chứng minh nhân thân</label>
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
          </Tab>
          <Tab eventKey="registration" title="Đăng ký khóa học">
            {!selectedStudent ? (
              <Alert variant="info">Vui lòng chọn một sinh viên để quản lý đăng ký khóa học.</Alert>
            ) : (
              <>
                <h6>Danh sách lớp học khả dụng</h6>
                {classes.length === 0 ? (
                  <Alert variant="warning">Không có lớp học nào khả dụng.</Alert>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Mã lớp</th>
                        <th>Tên môn</th>
                        <th>Giảng viên</th>
                        <th>Học kỳ</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((cls) => {
                        console.log(cls);
                        return (
                          <tr key={cls._id}>
                            <td>{cls.classCode}</td>
                            <td>{cls.Name || 'Không xác định'}</td>
                            <td>{cls.lecturer}</td>
                            <td>{cls.semester}</td>
                            <td>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleRegisterClass(cls._id)}
                                disabled={registeredClasses.some((r) => r.classId === cls._id)}
                              >
                                Đăng ký
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
                <h6>Lớp học đã đăng ký</h6>
                {registeredClasses.length === 0 ? (
                  <Alert variant="warning">Sinh viên chưa đăng ký lớp học nào.</Alert>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Mã lớp</th>
                        <th>Tên môn</th>
                        <th>Giảng viên</th>
                        <th>Học kỳ</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredClasses.map((reg) => {
                        const cls = classes.find((c) => c._id === reg.classId);
                        return (
                          <tr key={reg._id}>
                            <td>{cls?.classCode || 'Không xác định'}</td>
                            <td>{cls?.Name || 'Không xác định'}</td>
                            <td>{cls?.lecturer || 'Không xác định'}</td>
                            <td>{cls?.semester || 'Không xác định'}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelRegistration(reg._id)}
                              >
                                Hủy
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </>
            )}
          </Tab>
          <Tab eventKey="transcript" title="Bảng điểm">
            {!selectedStudent ? (
              <Alert variant="info">Vui lòng chọn một sinh viên để xem bảng điểm.</Alert>
            ) : (
              <>
                <Button variant="primary" onClick={generateTranscriptPDF} className="mb-3">
                  In bảng điểm
                </Button>
                {transcript.length === 0 ? (
                  <Alert variant="warning">Sinh viên chưa có bảng điểm.</Alert>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Mã môn</th>
                        <th>Tên môn</th>
                        <th>Điểm</th>
                        <th>Học kỳ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transcript.map((t) => {
                        const course = courses.find((c) => c._id === t.courseId);
                        return (
                          <tr key={t._id}>
                            <td>{course?.courseCode || t.courseId}</td>
                            <td>{course?.name || 'Không xác định'}</td>
                            <td>{t.grade}</td>
                            <td>{t.semester}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </>
            )}
          </Tab>
          <Tab eventKey="courses" title="Khóa học">
            <>
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => setShowAddCourseModal(true)}
              >
                Thêm khóa học
              </Button>
              {courses.length === 0 ? (
                <Alert variant="warning">Không có khóa học nào.</Alert>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Mã môn</th>
                      <th>Tên môn</th>
                      <th>Số tín chỉ</th>
                      <th>Môn tiên quyết</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.courseCode}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{course.prerequisite || 'Không có'}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <Modal show={showAddCourseModal} onHide={() => setShowAddCourseModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Thêm khóa học mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Mã môn</Form.Label>
                      <Form.Control
                        type="text"
                        name="courseCode"
                        value={newCourse.courseCode}
                        onChange={handleNewCourseChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên môn</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={newCourse.name}
                        onChange={handleNewCourseChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Số tín chỉ</Form.Label>
                      <Form.Control
                        type="number"
                        name="credits"
                        value={newCourse.credits}
                        onChange={handleNewCourseChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Môn tiên quyết (Mã môn, để trống nếu không có)</Form.Label>
                      <Form.Control
                        type="text"
                        name="prerequisite"
                        value={newCourse.prerequisite}
                        onChange={handleNewCourseChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowAddCourseModal(false)}>
                    Hủy
                  </Button>
                  <Button variant="primary" onClick={handleAddCourse}>
                    Thêm
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentForm;