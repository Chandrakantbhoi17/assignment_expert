import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '@/context/AuthContext.jsx';
import apiClient from '../../services/ApiClient';

const TaskList = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const transformData = (data) =>
    data.map((item) => ({
      id: item.id,
      title: item.title,
      details: item.details || '—',
      approval_status: item.approval_status,
      status:
        item.approval_status.charAt(0).toUpperCase() +
        item.approval_status.slice(1),
      amount: item.amount || 0,
      paid: `₹${item.total_paid || 0}`,
      file_url: item.completed_url,
      tempAmount: '',
    }));

  const fetchAssignments = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Access token not found');
      setLoading(false);
      return;
    }

    const endpoint =
      user?.role === 'admin'
        ? '/assignments'
        : '/assignments/my';

    try {
      const response = await apiClient.get(endpoint)
      const data = await response.data;
      setTableData(transformData(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const token = Cookies.get('token');
    const assignment = tableData.find((item) => item.id === id);
    const url = `http://52.66.34.20/assignments/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: assignment.amount || 0,
          approval_status: action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment status');
      }

      setTableData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                approval_status: action,
                status: action.charAt(0).toUpperCase() + action.slice(1),
              }
            : item
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-center w-100">Assignments</h2>
        {user?.role === 'user' && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/user/assignments/add')}
          >
            Add
          </button>
        )}
      </div>

      {loading ? (
        <div className="alert alert-info">Loading assignments...</div>
      ) : error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Details</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Download</th>
                <th>Status & Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.details}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.approval_status === 'approved'
                          ? 'bg-success'
                          : item.approval_status === 'rejected'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Admin can set amount only if not already set */}
                  <td>
                    {user?.role === 'admin' && item.amount === 0 ? (
                      <div className="d-flex justify-content-center">
                        <input
                          type="number"
                          className="form-control form-control-sm me-2"
                          placeholder="Set amount"
                          style={{ maxWidth: '100px' }}
                          value={item.tempAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTableData((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, tempAmount: value }
                                  : row
                              )
                            );
                          }}
                        />
                        <button
                          className="btn btn-sm btn-success"
                          onClick={async () => {
                            const token = Cookies.get('token');
                            const url = `http://52.66.34.20/assignments/${item.id}`;

                            try {
                              const response = await fetch(url, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  amount: Number(item.tempAmount),
                                  approval_status: item.approval_status,
                                }),
                              });

                              if (!response.ok) {
                                throw new Error('Failed to set amount');
                              }

                              setTableData((prev) =>
                                prev.map((row) =>
                                  row.id === item.id
                                    ? {
                                        ...row,
                                        amount: Number(item.tempAmount),
                                        tempAmount: '',
                                      }
                                    : row
                                )
                              );
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      `₹${item.amount}`
                    )}
                  </td>

                  <td>{item.paid}</td>

                  <td>
                    {item.file_url ? (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  <td>
                    {user?.role === 'admin' && item.approval_status === 'pending' ? (
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleAction(item.id, 'approved')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAction(item.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={`/user/assignments/view/${item.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
