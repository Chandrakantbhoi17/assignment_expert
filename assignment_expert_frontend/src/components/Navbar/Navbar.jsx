import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark px-4  ${styles.navbar} w-100`}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <strong>Logo</strong>
        </Link>

        {/* Toggler (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-center gap-3">
            {user ? (
              <li className="nav-item dropdown">
                <button
                    className={"btn bg-light text-dark rounded-circle ..."}
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                   <span className={styles.avatarLetter}>
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                   </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end mt-2 text-center" aria-labelledby="userDropdown">
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
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/signup">Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
