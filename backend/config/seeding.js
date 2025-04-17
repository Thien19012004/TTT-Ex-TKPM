const mongoose = require('mongoose');
require('dotenv').config();
const Faculty = require('../models/facultyModel');
const Program = require('../models/programModel');
const Status = require('../models/statusModel');
const Student = require('../models/studentModel');
const Course = require('../models/coursesModel');
const Class = require('../models/classModel');
const Registration = require('../models/registrationModel');
const Transcript = require('../models/transcriptModel');
// const connectDB = require('./db');



const faculties = [
  { name: 'Công nghệ Thông tin' },
  { name: 'Kinh tế' },
];

const programs = [
  { name: 'Kỹ sư Công nghệ Thông tin' },
  { name: 'Cử nhân Kinh tế' },
];

const statuses = [
  { name: 'Đang học' },
  { name: 'Bảo lưu' },
  { name: 'Đình chỉ' },
  { name: 'Tốt nghiệp' },
];

const students = [
  {
    mssv: 'SV001',
    name: 'Nguyễn Văn A',
    dob: new Date('2000-01-01'),
    gender: 'Nam',
    faculty: null, // Sẽ được cập nhật sau khi tạo faculties
    course: 'K2022',
    program: null, // Sẽ được cập nhật
    permanentAddress: {
      street: '123 Đường Láng',
      ward: 'Láng Thượng',
      district: 'Đống Đa',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    temporaryAddress: {
      street: '456 Đường Cầu Giấy',
      ward: 'Dịch Vọng',
      district: 'Cầu Giấy',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    mailingAddress: {
      street: '456 Đường Cầu Giấy',
      ward: 'Dịch Vọng',
      district: 'Cầu Giấy',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    identityDocument: {
      type: 'CCCD',
      number: '012345678901',
      issueDate: new Date('2020-01-01'),
      issuePlace: 'Hà Nội',
      expiryDate: new Date('2030-01-01'),
      hasChip: true,
      issueCountry: 'Việt Nam',
      notes: '',
    },
    nationality: 'Việt Nam',
    email: 'nguyenvana@student.university.edu.vn',
    phone: '+84912345678',
    status: null, // Sẽ được cập nhật
  },
  {
    mssv: 'SV002',
    name: 'Trần Thị B',
    dob: new Date('2001-02-02'),
    gender: 'Nữ',
    faculty: null,
    course: 'K2022',
    program: null,
    permanentAddress: {
      street: '789 Đường Nguyễn Trãi',
      ward: 'Thanh Xuân Trung',
      district: 'Thanh Xuân',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    temporaryAddress: {
      street: '101 Đường Giải Phóng',
      ward: 'Đồng Tâm',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    mailingAddress: {
      street: '101 Đường Giải Phóng',
      ward: 'Đồng Tâm',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    identityDocument: {
      type: 'Passport',
      number: 'A12345678',
      issueDate: new Date('2019-06-01'),
      issuePlace: 'Hà Nội',
      expiryDate: new Date('2029-06-01'),
      hasChip: false,
      issueCountry: 'Việt Nam',
      notes: 'Hộ chiếu du học',
    },
    nationality: 'Việt Nam',
    email: 'tranthib@student.university.edu.vn',
    phone: '+84987654321',
    status: null,
  },
];

const courses = [
  {
    courseCode: 'CS101',
    name: 'Lập trình cơ bản',
    credits: 3,
    department: 'Công nghệ Thông tin',
    description: 'Khóa học nhập môn lập trình',
    prerequisite: null,
    isActive: true,
  },
  {
    courseCode: 'CS102',
    name: 'Cấu trúc dữ liệu',
    credits: 3,
    department: 'Công nghệ Thông tin',
    description: 'Khóa học về cấu trúc dữ liệu và thuật toán',
    prerequisite: 'CS101',
    isActive: true,
  },
  {
    courseCode: 'CS103',
    name: 'Cơ sở dữ liệu',
    credits: 4,
    department: 'Công nghệ Thông tin',
    description: 'Khóa học về quản lý cơ sở dữ liệu',
    prerequisite: 'CS102',
    isActive: true,
  },
];

const classes = [
  {
    classCode: 'CS101-01',
    Name: 'Lập trình cơ bản',
    courseId: null,
    academicYear: '2025',
    semester: '1',
    lecturer: 'TS. Nguyễn Văn X',
    maxStudents: 50,
    schedule: 'Thứ 2, 8:00-10:00',
    room: 'A101',
  },
  {
    classCode: 'CS102-01',
    Name: 'Lập trình cơ bản',
    courseId: null,
    academicYear: '2025',
    semester: '1',
    lecturer: 'TS. Trần Thị Y',
    maxStudents: 40,
    schedule: 'Thứ 3, 10:00-12:00',
    room: 'A102',
  },
  {
    classCode: 'CS103-01',
    Name: 'Lập trình cơ bản',
    courseId: null,
    academicYear: '2025',
    semester: '1',
    lecturer: 'TS. Phạm Văn Z',
    maxStudents: 30,
    schedule: 'Thứ 4, 13:00-15:00',
    room: 'A103',
  },
];

const registrations = [
  {
    studentId: 'SV001',
    classId: null, // Sẽ được cập nhật (CS101-01)
    registeredAt: new Date(),
  },
  {
    studentId: 'SV002',
    classId: null, // Sẽ được cập nhật (CS101-01)
    registeredAt: new Date(),
  },
];

const transcripts = [
  {
    studentId: 'SV001',
    courseId: null, // Sẽ được cập nhật (CS101)
    grade: 8.5,
    semester: '2024-2',
  },
  {
    studentId: 'SV001',
    courseId: null, // Sẽ được cập nhật (CS102)
    grade: 7.0,
    semester: '2024-2',
  },
  {
    studentId: 'SV002',
    courseId: null, // Sẽ được cập nhật (CS101)
    grade: 9.0,
    semester: '2024-2',
  },
];

// Hàm seeding
const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await Promise.all([
      Faculty.deleteMany({}),
      Program.deleteMany({}),
      Status.deleteMany({}),
      Student.deleteMany({}),
      Course.deleteMany({}),
      Class.deleteMany({}),
      Registration.deleteMany({}),
      Transcript.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Chèn faculties
    const insertedFaculties = await Faculty.insertMany(faculties);
    console.log('Inserted faculties:', insertedFaculties);

    // Chèn programs
    const insertedPrograms = await Program.insertMany(programs);
    console.log('Inserted programs:', insertedPrograms);

    // Chèn statuses
    const insertedStatuses = await Status.insertMany(statuses);
    console.log('Inserted statuses:', insertedStatuses);

    // Cập nhật students với faculty, program, status
    const updatedStudents = students.map((student, index) => ({
      ...student,
      faculty: insertedFaculties[index % insertedFaculties.length]._id,
      program: insertedPrograms[index % insertedPrograms.length]._id,
      status: insertedStatuses[0]._id, // Đang học
    }));

    // Chèn students
    const insertedStudents = await Student.insertMany(updatedStudents);
    console.log('Inserted students:', insertedStudents);

    // Chèn courses
    const insertedCourses = await Course.insertMany(courses);
    console.log('Inserted courses:', insertedCourses);

    // Cập nhật classes với courseId
    const updatedClasses = classes.map((cls, index) => ({
      ...cls,
      courseId: insertedCourses[index % insertedCourses.length]._id,
    }));

    // Chèn classes
    const insertedClasses = await Class.insertMany(updatedClasses);
    console.log('Inserted classes:', insertedClasses);

    // Cập nhật registrations với classId
    const updatedRegistrations = registrations.map((reg, index) => ({
      ...reg,
      classId: insertedClasses[0]._id, // Đăng ký CS101-01
    }));

    // Chèn registrations
    const insertedRegistrations = await Registration.insertMany(updatedRegistrations);
    console.log('Inserted registrations:', insertedRegistrations);

    // Cập nhật transcripts với courseId
    const updatedTranscripts = transcripts.map((transcript, index) => ({
      ...transcript,
      courseId: insertedCourses[index % insertedCourses.length]._id,
    }));

    // Chèn transcripts
    const insertedTranscripts = await Transcript.insertMany(updatedTranscripts);
    console.log('Inserted transcripts:', insertedTranscripts);

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy seeding
seedDatabase();