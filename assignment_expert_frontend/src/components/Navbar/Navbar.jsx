import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark px-4 ${styles.navbar} w-100`}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <strong>Logo</strong>
        </Link>

        {/* Right Side */}
        <div className="d-flex align-items-center" ref={dropdownRef}>
          {user ? (
            <div className="position-relative">
              <button
                type="button"
                className="btn bg-light text-dark rounded-circle"
                onClick={toggleDropdown}
              >
                <span className={styles.avatarLetter}>
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </span>
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show mt-2 text-center" style={{ position: 'absolute', right: 0 }}>
                  <li>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">Settings</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user/dashboard">Dashboard</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>Logout</button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <>
              <Link className="btn btn-outline-light btn-sm me-2" to="/signup">Signup</Link>
              <Link className="btn btn-light btn-sm" to="/login">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
