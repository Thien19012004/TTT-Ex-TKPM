import React, { useState, useEffect } from 'react';

const ValidationConfigForm = ({ onClose }) => {
    // Load config from localStorage or use defaults
    const defaultConfig = {
        emailDomain: '@student.university.edu.vn',
        phonePatterns: {
            phonePatterns: '^(?:\\+84|0)([3|5|7|8|9])([0-9]{8})$'
        },
        statusTransitions: {
            'Đang học': ['Bảo lưu', 'Tốt nghiệp', 'Đình chỉ'],
            'Bảo lưu': ['Đang học', 'Thôi học'],
            'Đình chỉ': ['Đang học', 'Thôi học'],
            'Tốt nghiệp': []
        }
    };

    const [config, setConfig] = useState(() => {
        const savedConfig = localStorage.getItem('validationConfig');
        return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    });


    useEffect(() => {
        localStorage.setItem('validationConfig', JSON.stringify(config));
    }, [config]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handlePhonePatternChange = (country, pattern) => {
        setConfig(prev => ({
            ...prev,
            phonePatterns: {
                ...prev.phonePatterns,
                [country]: pattern
            }
        }));
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Cấu hình validation</h5>
                <button className="btn btn-sm btn-secondary float-end" onClick={onClose}>
                    Đóng
                </button>

                <div className="mb-3">
                    <label className="form-label">Email Domain</label>
                    <input
                        type="text"
                        className="form-control"
                        name="emailDomain"
                        value={config.emailDomain}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Patterns</label>
                    <div className="card p-3">
                        {Object.entries(config.phonePatterns).map(([country, pattern]) => (
                            <div key={country} className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text">{country}</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={pattern}
                                        onChange={(e) => handlePhonePatternChange(country, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                       
                    </div>
                </div>

                

                <div className="text-center mt-3">
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            localStorage.setItem('validationConfig', JSON.stringify(config));
                            onClose();
                        }}
                    >
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValidationConfigForm;