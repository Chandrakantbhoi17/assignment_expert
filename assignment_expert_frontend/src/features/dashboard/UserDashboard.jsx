import React, { useContext, useEffect, useState } from 'react';
import styles from './UserDashboard.module.css';
import StatCard from '../components/StatCard/StatCards.jsx'
import { AuthContext } from '@/context/AuthContext.jsx';
import Cookies from "js-cookie";
import apiClient from '../../services/ApiClient.jsx';
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState({
    total_assignments: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = Cookies.get("token");
      if (!token || !user?.role) return;

      const endpoint =
        user.role === 'admin'
          ? '/admin/dashboard/assignment-summary'
          : '/user/dashboard/assignment-summary';

      try {

         const res =await apiClient.get(endpoint)
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

      <div className={styles.chartPlaceholder}>
        <h3>Chart (Coming Soon)</h3>
        <div className={styles.fakeChart}>[Chart Placeholder]</div>
      </div>
    </div>
  );
};

export default UserDashboard;
