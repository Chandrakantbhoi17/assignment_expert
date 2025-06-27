import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Task.css';
import Cookies from "js-cookie";

const ApprovalTable = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformData = (data) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      details: item.details || '—',
      document: 'Upload',
      requestApproval: item.approval_status === 'pending',
      status:
        item.approval_status.charAt(0).toUpperCase() +
        item.approval_status.slice(1),
      Amount: `₹${item.amount || 0}`,
      downloadLink: item.completed_url,
      viewLink: `/view/${item.id}`,
    }));

  useEffect(() => {
    const fetchAssignments = async () => {
      const token = Cookies.get("token")
      if (!token) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/assignments/my', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Bearer from cookie
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }

        const data = await response.json();
        setTableData(transformData(data));
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="task-page">
      <div className="approval-container">
        <div className="header-bar">
          <h2>Assignments</h2>
          <button className="add-btn" onClick={() => navigate('/add-assignment')}>
            Add Assignment
          </button>
        </div>

        {loading ? (
          <p>Loading assignments...</p>
        ) : error ? (
          <p className="error-msg">Error: {error}</p>
        ) : (
          <table className="approval-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Details</th>
          
                <th>Status</th>
                <th>Amount</th>
                <th>Download</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.details}</td>
                  <td>{item.status}</td>
                  <td>{item.Amount}</td>
                  <td>
                    {item.downloadLink ? (
                      <a
                        href={item.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="no-file">—</span>
                    )}
                  </td>
                  <td>
                    <a href={item.viewLink} className="view-btn">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApprovalTable;
