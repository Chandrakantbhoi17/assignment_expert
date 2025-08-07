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
} from 'recharts';


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


  
  <div className={styles.chartBox}>
  <h4>Source</h4>
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        dataKey="value"
        data={[
          { name: 'Desktop', value: 63 },
          { name: 'Tablet', value: 15 },
          { name: 'Phone', value: 22 },
        ]}
        cx="50%"
        cy="50%"
        outerRadius={80}
        innerRadius={40}
        label
      >
        <Cell fill="#6366f1" /> {/* Blue */}
        <Cell fill="#f59e0b" /> {/* Orange */}
        <Cell fill="#10b981" /> {/* Green */}
      </Pie>
      <Legend
        verticalAlign="bottom"
        iconType="circle"
        align="center"
      />
    </PieChart>
  </ResponsiveContainer>
</div>

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
            <h4>Sales</h4>
            <span className={styles.syncText}></span>
          </div>
          <div className={styles.fakeChart}>[Bar Chart ]</div>
        </div>

        <div className={styles.chartBox}>
          <h4>Traffic Source</h4>
          <div className={styles.fakePieChart}></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
