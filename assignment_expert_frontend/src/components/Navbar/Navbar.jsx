import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <div className={styles.nav_left}>
        <h1>Logo</h1>
      </div>
      <div className={styles.nav_right}>
        {user ? (
          <>
            <div className={styles.profile_circle}>
              {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <span onClick={logout} className={styles.nav_link}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/signup" className={styles.nav_link}>Signup</Link>
            <Link to="/login" className={styles.nav_link}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
