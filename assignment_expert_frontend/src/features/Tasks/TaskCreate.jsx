import React, { useState } from 'react';
import './Task.css';
import { useNavigate } from 'react-router-dom';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getCookie('access_token');
    if (!token) {
      alert('Unauthorized');
      return;
    }

    const payload = {
      title,
      details,
      due_date: dueDate, // Already in "YYYY-MM-DD"
    };

    try {
      const response = await fetch('http://172.168.5.59:8000/assignments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('Error:', result);
        alert('Failed to submit assignment.');
        return;
      }

      alert('Assignment submitted successfully!');
      navigate('/assignment');
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="add-assignment-page">
      <div className="add-assignment-container">
        <h2>Add Assignment</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Details:</label>
          <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} required />

          <label>Due Date:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

          <div className="form-buttons">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/assignment')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
