import React, { useState } from 'react';
import './Task.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/ApiClient';

const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [note, setNote] = useState('');
  const [due_date, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details || !due_date || !note) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create assignment
      const response = await apiClient.post('/assignments/create', {
        title,
        details,
        note,
        due_date,
      });

      const assignmentId = response.data?.id;
      if (!assignmentId) {
        throw new Error('Assignment ID missing in response');
      }

      // Step 2: Upload file if it exists
      if (file) {
        const formData = new FormData();
        formData.append('file', file); // MUST match backend param name

        // Debugging log
        for (let pair of formData.entries()) {
          console.log(pair[0] + ':', pair[1]);
        }

        try {
          const uploadRes = await apiClient.post(
            `/assignments/${assignmentId}/upload-file`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Upload success:', uploadRes.data);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          alert('File upload failed.');
        }
      }

      // Step 3: Navigate on success
      navigate('/user/assignments');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-assignment-page">
      <div className="add-assignment-container">
        <h2>Add Task</h2>
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

          <label>Note:</label>
          <textarea
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />

          <label>Deadline:</label>
          <input
            type="date"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <label>Upload File (optional):</label>
          <input
            type="file"
            onChange={(e) => {
              console.log('File selected:', e.target.files[0]);
              setFile(e.target.files[0]);
            }}
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