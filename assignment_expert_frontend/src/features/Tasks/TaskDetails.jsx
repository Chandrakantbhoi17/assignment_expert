import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext.jsx'; // Adjust if needed
import apiClient from '../../services/ApiClient';

const TaskDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      try {
        const res = await apiClient.get(`/assignments/${id}`);
        setTask(res.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };

    fetchTask();
    loadRazorpayScript();
  }, [id]);

  const handlePayNow = async () => {
    if (!task?.amount || task.amount <= 0) {
      alert('Invalid amount.');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      alert('Authentication token missing.');
      return;
    }

    const halfAmount = Math.round(task.amount / 2);

    try {
      const response = await axios.post(
        'http://52.66.34.20/create-order/',
        { amount: halfAmount },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order_id, amount, currency } = response.data;

      const options = {
        key: 'rzp_test_ufH2mSm5RM3Vu6',
        amount,
        currency,
        name: 'Task Payment',
        description: `50% upfront payment for: ${task.title}`,
        order_id,
        handler: async function (paymentResponse) {
          try {
            await axios.post(
              'http://52.66.34.20/verify-payment/',
              {
                order_id,
                payment_id: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
                assignment_id: id,
                amount_paid: halfAmount,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            alert('Payment verified and recorded!');
          } catch (err) {
            console.error('Verification failed:', err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      alert('Authentication token missing.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);

      await axios.post(
        `http://52.66.34.20/admin/assignments/${id}/upload-final`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('File uploaded successfully!');
      setFile(null);
      setUploading(false);

      // Refresh task details
      const res = await apiClient.get(`/assignments/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed.');
      setUploading(false);
    }
  };

  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );

  if (!task)
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Loading task details...</div>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center text-primary">{task.title}</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Details:</strong> {task.details || '—'}
          </li>
          <li className="list-group-item">
            <strong>Status:</strong>{' '}
            <span
              className={`badge ${
                task.approval_status === 'approved'
                  ? 'bg-success'
                  : task.approval_status === 'rejected'
                  ? 'bg-danger'
                  : 'bg-warning text-dark'
              }`}
            >
              {task.approval_status}
            </span>
          </li>
          <li className="list-group-item">
            <strong>Amount:</strong> ₹{task.amount || 0}
          </li>
          <li className="list-group-item">
            <strong>Paid:</strong> ₹{task.total_paid || 0}
          </li>
          <li className="list-group-item">
            <strong>Final file:</strong>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control d-inline w-auto ms-2"
            />
            <button
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </li>

          {task.completed_url && (
            <li className="list-group-item">
              <strong>Download:</strong>{' '}
              <a
                href={task.completed_url}
                className="btn btn-sm btn-outline-secondary ms-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </a>
            </li>
          )}
        </ul>

        {user?.role === 'user' && task.total_paid < task.amount && (
          <div className="text-center mt-4">
            <button className="btn btn-primary btn-lg" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
