// EmailConfig.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const EmailConfig = ({ formats, onSave }) => {
  const [show, setShow] = useState(false);
  const [newFormats, setNewFormats] = useState([...formats]);

  const handleAddFormat = () => {
    setNewFormats([...newFormats, '']);
  };

  const handleRemoveFormat = (index) => {
    const updated = newFormats.filter((_, i) => i !== index);
    setNewFormats(updated);
  };

  const handleFormatChange = (index, value) => {
    const updated = [...newFormats];
    updated[index] = value;
    setNewFormats(updated);
  };

  const handleSave = () => {
    onSave(newFormats.filter(f => f.trim() !== ''));
    setShow(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setShow(true)}>
        Configure Email Formats
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Email Format Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Add allowed email domains (e.g. @student.university.edu.vn)</p>
          {newFormats.map((format, index) => (
            <div key={index} className="d-flex mb-2">
              <Form.Control
                type="text"
                value={format}
                onChange={(e) => handleFormatChange(index, e.target.value)}
                placeholder="Enter email domain"
              />
              <Button 
                variant="danger" 
                className="ms-2"
                onClick={() => handleRemoveFormat(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="primary" onClick={handleAddFormat}>
            Add New Format
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailConfig;