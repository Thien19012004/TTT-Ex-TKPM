const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    mssv: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Nam', 'Nữ'], required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }, // Tham chiếu bảng Faculty
    course: { type: String, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true }, // Tham chiếu bảng Program
    permanentAddress: {
        street: String,
        ward: String,
        district: String,
        city: String,
        country: String
    },
    temporaryAddress: {
        street: String,
        ward: String,
        district: String,
        city: String,
        country: String
    },
    mailingAddress: {
        street: String,
        ward: String,
        district: String,
        city: String,
        country: String
    },
    identityDocument: {
        type: { type: String, enum: ['CMND', 'CCCD', 'Passport'], required: true },
        number: { type: String, required: true },
        issueDate: { type: Date, required: true },
        issuePlace: { type: String, required: true },
        expiryDate: { type: Date },
        hasChip: { type: Boolean },
        issueCountry: { type: String },
        notes: { type: String }
    },
    nationality: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true } // Tham chiếu bảng Status
});

module.exports = mongoose.model('Student', studentSchema);
