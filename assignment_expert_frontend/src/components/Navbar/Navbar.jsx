import React, { useContext } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // adjust path as needed

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // 👈 grab user and logout

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <div className="profile-circle">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span onClick={logout} className="nav-link">Logout</span>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-link">Signup</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
