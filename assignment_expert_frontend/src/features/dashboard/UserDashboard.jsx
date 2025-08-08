import React, { useContext, useEffect, useState } from 'react';
import styles from './UserDashboard.module.css';
import StatCard from '../components/StatCard/StatCards.jsx';
import { AuthContext } from '@/context/AuthContext.jsx';
import Cookies from 'js-cookie';
import apiClient from '../../services/ApiClient.jsx';
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from 'react-icons/fa';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({
    total_assignments: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = Cookies.get('token');
      if (!token || !user?.role) return;

      const endpoint =
        user.role === 'admin'
          ? '/admin/dashboard/assignment-summary'
          : '/user/dashboard/assignment-summary';

      try {
        const res = await apiClient.get(endpoint);
        const data = await res.data;
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user]);

  const pieData = [
    { name: 'Approved', value: summary.approved },
    { name: 'Pending', value: summary.pending },
    { name: 'Rejected', value: summary.rejected },
  ];

  const barData = [
    { name: 'Tasks', value: summary.total_assignments },
    { name: 'Approved', value: summary.approved },
    { name: 'Pending', value: summary.pending },
    { name: 'Rejected', value: summary.rejected },
  ];

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heading}>
        {user?.role === 'admin' ? 'Admin' : 'User'} Dashboard
      </h2>

      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <div className={styles.cardGrid}>
          <StatCard title="Total Tasks" value={summary.total_assignments} color="#3b82f6" icon={FaClipboardList} />
          <StatCard title="Approved" value={summary.approved} color="#10b981" icon={FaCheckCircle} />
          <StatCard title="Pending" value={summary.pending} color="#f59e0b" icon={FaClock} />
          <StatCard title="Rejected" value={summary.rejected} color="#ef4444" icon={FaTimesCircle} />
        </div>
      )}

      <div className={styles.chartSection}>
        <div className={styles.chartBox}>
          <div className={styles.chartHeader}>
            <h4>Task Overview</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#c1dff8ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartBox}>
          <h4>Status Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                 label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
