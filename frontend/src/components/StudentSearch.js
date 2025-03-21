import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm (tên hoặc MSSV)
    const [selectedFaculty, setSelectedFaculty] = useState(''); // Khoa được chọn
    const [faculties, setFaculties] = useState([]); // Danh sách khoa

    // Lấy danh sách khoa từ backend
    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/faculties'); // Gọi API lấy danh sách khoa
                setFaculties(response.data);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };
        fetchFaculties();
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = async (e) => {
        e.preventDefault();
        onSearch(searchTerm, selectedFaculty); // Truyền kết quả tìm kiếm lên component cha  
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Tìm kiếm sinh viên</h5>
                <form onSubmit={handleSearch}>
                    <div className="mb-3">
                        <label className="form-label">Chọn khoa</label>
                        <select
                            className="form-control"
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                        >
                            <option value="">Tất cả khoa</option>
                            {faculties.map((faculty) => (
                                <option key={faculty._id} value={faculty._id}>
                                    {faculty.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tên hoặc MSSV</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên hoặc MSSV"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Tìm kiếm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentSearch;