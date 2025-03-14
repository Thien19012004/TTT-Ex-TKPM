import React, { useState } from 'react';

const StudentSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm); // Gọi hàm onSearch với từ khóa tìm kiếm
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Tìm kiếm sinh viên</h5>
                <form onSubmit={handleSearch} className="d-flex">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Nhập tên hoặc MSSV"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Tìm kiếm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentSearch;