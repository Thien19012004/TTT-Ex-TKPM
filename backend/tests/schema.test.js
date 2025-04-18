const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Class = require('../models/classModel');
const Course = require('../models/coursesModel');
const Faculty = require('../models/facultyModel');
const Program = require('../models/programModel');
const Registration = require('../models/registrationModel');
const Status = require('../models/statusModel');
const Student = require('../models/studentModel');
const Transcript = require('../models/transcriptModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Class Schema', () => {
  test('should create a valid class', async () => {
    const course = await Course.create({
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
    });

    const classData = {
      classCode: 'CS101-A',
      Name: 'CS101 Section A',
      courseId: course._id,
      academicYear: '2023-2024',
      semester: 'Fall',
      lecturer: 'Dr. Smith',
      maxStudents: 30,
      schedule: 'Mon 9:00-11:00',
      room: 'B101',
    };

    const classInstance = await Class.create(classData);
    expect(classInstance.classCode).toBe(classData.classCode);
    expect(classInstance.Name).toBe(classData.Name);
    expect(classInstance.courseId).toEqual(course._id);
  });

  test('should fail if required fields are missing', async () => {
    await expect(Class.create({})).rejects.toThrow();
  });

  test('should fail if classCode is not unique', async () => {
    const course = await Course.create({
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
    });

    const classData = {
      classCode: 'CS101-A',
      Name: 'CS101 Section A',
      courseId: course._id,
      academicYear: '2023-2024',
      semester: 'Fall',
      lecturer: 'Dr. Smith',
      maxStudents: 30,
    };

    await Class.create(classData);
    await expect(Class.create(classData)).rejects.toThrow();
  });
});

describe('Course Schema', () => {
  test('should create a valid course', async () => {
    const courseData = {
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
      description: 'Basic programming concepts',
      prerequisite: 'None',
      isActive: true,
    };

    const course = await Course.create(courseData);
    expect(course.courseCode).toBe(courseData.courseCode);
    expect(course.credits).toBe(courseData.credits);
    expect(course.isActive).toBe(true);
  });

  test('should fail if credits are less than 2', async () => {
    const courseData = {
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 1,
      department: 'Computer Science',
    };

    await expect(Course.create(courseData)).rejects.toThrow();
  });
});

describe('Faculty Schema', () => {
  test('should create a valid faculty', async () => {
    const faculty = await Faculty.create({ name: 'Computer Science' });
    expect(faculty.name).toBe('Computer Science');
  });

  test('should fail if name is not unique', async () => {
    await Faculty.create({ name: 'Computer Science' });
    await expect(Faculty.create({ name: 'Computer Science' })).rejects.toThrow();
  });
});

describe('Program Schema', () => {
  test('should create a valid program', async () => {
    const program = await Program.create({ name: 'BSc Computer Science' });
    expect(program.name).toBe('BSc Computer Science');
  });
});

describe('Registration Schema', () => {
  test('should create a valid registration', async () => {
    const course = await Course.create({
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
    });

    const classInstance = await Class.create({
      classCode: 'CS101-A',
      Name: 'CS101 Section A',
      courseId: course._id,
      academicYear: '2023-2024',
      semester: 'Fall',
      lecturer: 'Dr. Smith',
      maxStudents: 30,
    });

    const registration = await Registration.create({
      studentId: 'STU001',
      classId: classInstance._id,
    });

    expect(registration.studentId).toBe('STU001');
    expect(registration.classId).toEqual(classInstance._id);
  });
});

describe('Status Schema', () => {
  test('should create a valid status', async () => {
    const status = await Status.create({ name: 'Active' });
    expect(status.name).toBe('Active');
  });
});

describe('Student Schema', () => {
  test('should create a valid student', async () => {
    const faculty = await Faculty.create({ name: 'Computer Science' });
    const program = await Program.create({ name: 'BSc Computer Science' });
    const status = await Status.create({ name: 'Active' });

    const studentData = {
      mssv: 'STU001',
      name: 'John Doe',
      dob: new Date('2000-01-01'),
      gender: 'Nam',
      faculty: faculty._id,
      course: 'CS101',
      program: program._id,
      permanentAddress: { city: 'Hanoi' },
      temporaryAddress: { city: 'Hanoi' },
      mailingAddress: { city: 'Hanoi' },
      identityDocument: {
        type: 'CCCD',
        number: '123456789',
        issueDate: new Date('2020-01-01'),
        issuePlace: 'Hanoi',
      },
      nationality: 'Vietnam',
      email: 'john@example.com',
      phone: '1234567890',
      status: status._id,
    };

    const student = await Student.create(studentData);
    expect(student.mssv).toBe(studentData.mssv);
    expect(student.email).toBe(studentData.email);
  });

  test('should fail if email is not unique', async () => {
    const faculty = await Faculty.create({ name: 'Computer Science' });
    const program = await Program.create({ name: 'BSc Computer Science' });
    const status = await Status.create({ name: 'Active' });

    const studentData = {
      mssv: 'STU001',
      name: 'John Doe',
      dob: new Date('2000-01-01'),
      gender: 'Nam',
      faculty: faculty._id,
      course: 'CS101',
      program: program._id,
      permanentAddress: { city: 'Hanoi' },
      temporaryAddress: { city: 'Hanoi' },
      mailingAddress: { city: 'Hanoi' },
      identityDocument: {
        type: 'CCCD',
        number: '123456789',
        issueDate: new Date('2020-01-01'),
        issuePlace: 'Hanoi',
      },
      nationality: 'Vietnam',
      email: 'john@example.com',
      phone: '1234567890',
      status: status._id,
    };

    await Student.create(studentData);
    await expect(Student.create({ ...studentData, mssv: 'STU002' })).rejects.toThrow();
  });
});

describe('Transcript Schema', () => {
  test('should create a valid transcript', async () => {
    const course = await Course.create({
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
    });

    const transcript = await Transcript.create({
      studentId: 'STU001',
      courseId: course._id,
      grade: 8.5,
      semester: 'Fall',
    });

    expect(transcript.grade).toBe(8.5);
    expect(transcript.semester).toBe('Fall');
  });

  test('should fail if grade is out of range', async () => {
    const course = await Course.create({
      courseCode: 'CS101',
      name: 'Intro to CS',
      credits: 3,
      department: 'Computer Science',
    });

    await expect(
      Transcript.create({
        studentId: 'STU001',
        courseId: course._id,
        grade: 11,
        semester: 'Fall',
      })
    ).rejects.toThrow();
  });
});