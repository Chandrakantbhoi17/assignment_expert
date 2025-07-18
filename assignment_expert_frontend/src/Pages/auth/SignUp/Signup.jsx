import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

import userIcon from '../../../components/Assets/password.png';
import emailIcon from '../../../components/Assets/email.png';
import passwordIcon from '../../../components/Assets/password.png';

import apiClient from '../../../services/apiClient.jsx'; // ← Use your axios instance

const Signup = () => {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!full_name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/users/register', {
        full_name,
        email,
        password,
      });

      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(
        `Signup failed: ${
          error.response?.data?.message || error.message || 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="font-bold ">SignUp</div>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={userIcon} alt="user" />
          <input
            type="text"
            placeholder="Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className={styles.input}>
          <img src={emailIcon} alt="email" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.input}>
          <img src={passwordIcon} alt="password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.submitContainer}>
        <div
          className={styles.submit}
          onClick={handleSignup}
          style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </div>

        <div className='mt-2' onClick={() => navigate('/login')}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
};

export default Signup;
