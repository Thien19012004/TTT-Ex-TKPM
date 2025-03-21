import React, { useState, useEffect } from 'react';
import { Offcanvas, ListGroup, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa'; // Import icons


const Sidebar = ({ show, handleClose }) => {
    const [faculties, setFaculties] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [editingFacultyId, setEditingFacultyId] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [editingProgramId, setEditingProgramId] = useState(null);
    const [newFacultyName, setNewFacultyName] = useState('');
    const [newStatusName, setNewStatusName] = useState('');
    const [newProgramName, setNewProgramName] = useState('');
    const [newFaculty, setNewFaculty] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newProgram, setNewProgram] = useState('');

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/faculties');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    // Xử lý xóa khoa
    const handleDeleteFaculty = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/faculties/${id}`);
            fetchFaculties(); // Cập nhật lại danh sách khoa sau khi xóa
        } catch (error) {
            console.error('Error deleting faculty:', error);
            alert(error.response?.data?.message || "Lỗi khi xóa khoa!");
        }
    };

    // Xử lý cập nhật tên khoa
    const handleUpdateFaculty = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/faculties/${id}`, { name: newFacultyName });
            setEditingFacultyId(null); // Tắt chế độ chỉnh sửa
            fetchFaculties(); // Cập nhật lại danh sách khoa sau khi sửa
        } catch (error) {
            console.error('Error updating faculty:', error);
        }
    };

    const handleAddFaculty = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/faculties', { name: newFaculty });
            setFaculties([...faculties, response.data]); // Thêm khoa mới vào danh sách
            setNewFaculty(''); // Reset trường nhập liệu
        } catch (error) {
            console.error('Error adding faculty:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/statuses');
            setStatuses(response.data);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchStatuses();
    }, []);


     // Xử lý thêm, sửa, xóa statuses
    const handleAddStatus = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/statuses', { name: newStatus });
            setStatuses([...statuses, response.data]);
            setNewStatus('');
        } catch (error) {
            console.error('Error adding status:', error);
        }
    };

    const handleUpdateStatus = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/statuses/${id}`, { name: newStatusName });
            setEditingStatusId(null);
            fetchStatuses();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteStatus = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/statuses/${id}`);
            fetchStatuses();
        } catch (error) {
            console.error('Error deleting status:', error);
            alert(error.response?.data?.message || "Lỗi khi xóa khoa!");
        }
    };
            
    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/programs');
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchStatuses();
        fetchPrograms();
    }, []);

    // Xử lý thêm, sửa, xóa programs
    const handleAddProgram = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/programs', { name: newProgram });
            setPrograms([...programs, response.data]);
            setNewProgram('');
        } catch (error) {
            console.error('Error adding program:', error);
        }
    };

    const handleUpdateProgram = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/programs/${id}`, { name: newProgramName });
            setEditingProgramId(null);
            fetchPrograms();
        } catch (error) {
            console.error('Error updating program:', error);
        }
    };

    const handleDeleteProgram = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/programs/${id}`);
            fetchPrograms();
        } catch (error) {
            console.error('Error deleting program:', error);
            alert(error.response?.data?.message || "Lỗi khi xóa khoa!");
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Quản lý</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup>
                <ListGroup.Item>
                        <h5>Khoa</h5>
                        <div className="d-flex mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên khoa mới"
                                value={newFaculty}
                                onChange={(e) => setNewFaculty(e.target.value)}
                                className="me-2"
                            />
                            <Button variant="primary" size="sm" onClick={handleAddFaculty}>
                                <FaPlus /> Thêm
                            </Button>
                        </div>
                        <ul className="list-unstyled">
                            {faculties.map((faculty) => (
                                <li key={faculty._id} className="d-flex justify-content-between align-items-center mb-2">
                                    {editingFacultyId === faculty._id ? (
                                        <Form.Control
                                            type="text"
                                            defaultValue={faculty.name}
                                            onChange={(e) => setNewFacultyName(e.target.value)}
                                            className="me-2"
                                        />
                                    ) : (
                                        <span>{faculty.name}</span>
                                    )}
                                    <div>
                                        {editingFacultyId === faculty._id ? (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleUpdateFaculty(faculty._id)}
                                                className="me-2"
                                            >
                                                <FaSave />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingFacultyId(faculty._id);
                                                    setNewFacultyName(faculty.name);
                                                }}
                                                className="me-2"
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteFaculty(faculty._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h5>Trạng thái</h5>
                        <div className="d-flex mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nhập trạng thái mới"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="me-2"
                            />
                            <Button variant="primary" size="sm" onClick={handleAddStatus}>
                                <FaPlus /> Thêm
                            </Button>
                        </div>
                        <ul className="list-unstyled">
                            {statuses.map((status) => (
                                <li key={status._id} className="d-flex justify-content-between align-items-center mb-2">
                                    {editingStatusId === status._id ? (
                                        <Form.Control
                                            type="text"
                                            defaultValue={status.name}
                                            onChange={(e) => setNewStatusName(e.target.value)}
                                            className="me-2"
                                        />
                                    ) : (
                                        <span>{status.name}</span>
                                    )}
                                    <div>
                                        {editingStatusId === status._id ? (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(status._id)}
                                                className="me-2"
                                            >
                                                <FaSave />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingStatusId(status._id);
                                                    setNewStatusName(status.name);
                                                }}
                                                className="me-2"
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteStatus(status._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h5>Chương trình</h5>
                        <div className="d-flex mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nhập chương trình mới"
                                value={newProgram}
                                onChange={(e) => setNewProgram(e.target.value)}
                                className="me-2"
                            />
                            <Button variant="primary" size="sm" onClick={handleAddProgram}>
                                <FaPlus /> Thêm
                            </Button>
                        </div>
                        <ul className="list-unstyled">
                            {programs.map((program) => (
                                <li key={program._id} className="d-flex justify-content-between align-items-center mb-2">
                                    {editingProgramId === program._id ? (
                                        <Form.Control
                                            type="text"
                                            defaultValue={program.name}
                                            onChange={(e) => setNewProgramName(e.target.value)}
                                            className="me-2"
                                        />
                                    ) : (
                                        <span>{program.name}</span>
                                    )}
                                    <div>
                                        {editingProgramId === program._id ? (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleUpdateProgram(program._id)}
                                                className="me-2"
                                            >
                                                <FaSave />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingProgramId(program._id);
                                                    setNewProgramName(program.name);
                                                }}
                                                className="me-2"
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteProgram(program._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ListGroup.Item>
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;