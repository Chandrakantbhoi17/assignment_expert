import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import styles from './UserLayout.module.css';
import Navbar from '../../components/Navbar/Navbar';
const UserLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
 

        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
