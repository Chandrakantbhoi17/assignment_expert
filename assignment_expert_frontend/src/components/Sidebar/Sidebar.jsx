import React, { useContext } from 'react';
import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaTasks, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext.jsx'; // adjust path as needed

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext); // 👈 grab user and logout

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>
        {user?.role === 'admin' ? 'Admin Portal' : 'User Portal'}
      </h2>


      <nav className={styles.nav}>
         {user?.role === 'admin' && (
          <Link to="/admin/dashboard">
            <FaTachometerAlt /> Dashboard
          </Link>
        )}
        <Link to="/user/assignments">
          <FaTasks /> Tasks
        </Link>
    
        
      </nav>
    </div>
  );
};

export default Sidebar;
