import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import styles from './Login.module.css';

import emailIcon from '../../../components/Assets/email.png';
import passwordIcon from '../../../components/Assets/password.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    let hasError = false;

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await login(email, password);
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>Login</div>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={emailIcon} alt="email" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {emailError && <p className={styles.error}>{emailError}</p>}

        <div className={styles.input}>
          <img src={passwordIcon} alt="password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {passwordError && <p className={styles.error}>{passwordError}</p>}
      </div>

      {loginError && <p className={styles.error}>{loginError}</p>}

      <div className={styles.submitContainer}>
        <div
          className={`${styles.submit} px-5 py-2`}
          onClick={handleLogin}
          style={{
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </div>
      </div>
    </div>
  );
};

export default Login;
