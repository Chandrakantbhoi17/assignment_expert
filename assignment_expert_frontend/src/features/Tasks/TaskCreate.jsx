import React, { useState } from 'react';
import './Task.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiClient from '../../services/ApiClient';

const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [due_date, setDueDate] = useState('');
  const [file, setFile] = useState(null); // File state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      alert('Unauthorized');
      return;
    }

    const payload = {
      title,
      details,
      due_date: due_date,
    };

    setLoading(true);

    try {
      // Create the assignment
      const response = await apiClient.post('/assignments/create',{title,details,due_date})

      let result = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      }

      if (!response.ok) {
        console.error('Error:', result);
        alert((result && result.message) || 'Failed to submit assignment.');
        return;
      }

   
      // Upload file if provided
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(
          `http://localhost:8000/assignments/${result.id}/upload-file`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              // Do NOT manually set Content-Type for FormData
            },
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error('Upload Error:', uploadResult);
          alert('Assignment created, but file upload failed.');
        } 
      }

      navigate('/user/assignments');
    } catch (error) {
      console.error('Submission error:', error);
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-assignment-page">
      <div className="add-assignment-container">
        <h2>Add Assignment</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Details:</label>
          <textarea
            rows="4"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />

          <label>Due Date:</label>
          <input
            type="date"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <label>Upload File (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/assignment')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
