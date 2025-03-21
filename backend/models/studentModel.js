const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    mssv: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Nam', 'Nữ'], required: true },
    faculty: { type: String, required: true },
    course: { type: String, required: true },
    program: { type: String, required: true },
    permanentAddress: { // Địa chỉ thường trú
        street: String, // Số nhà, Tên đường
        ward: String,   // Phường/Xã
        district: String, // Quận/Huyện
        city: String,   // Tỉnh/Thành phố
        country: String // Quốc gia
    },
    temporaryAddress: { // Địa chỉ tạm trú
        street: String,
        ward: String,
        district: String,
        city: String,
        country: String
    },
    mailingAddress: { // Địa chỉ nhận thư
        street: String,
        ward: String,
        district: String,
        city: String,
        country: String
    },
    identityDocument: { // Giấy tờ chứng minh nhân thân
        type: { type: String, enum: ['CMND', 'CCCD', 'Passport'], required: true },
        number: { type: String, required: true }, // Số CMND/CCCD/Hộ chiếu
        issueDate: { type: Date, required: true }, // Ngày cấp
        issuePlace: { type: String, required: true }, // Nơi cấp
        expiryDate: { type: Date }, // Ngày hết hạn
        hasChip: { type: Boolean }, // Có gắn chip hay không (chỉ dành cho CCCD)
        issueCountry: { type: String }, // Quốc gia cấp (chỉ dành cho hộ chiếu)
        notes: { type: String } // Ghi chú (chỉ dành cho hộ chiếu)
    },
    nationality: { type: String, required: true }, // Quốc tịch
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học'], required: true }
});

module.exports = mongoose.model('Student', studentSchema);