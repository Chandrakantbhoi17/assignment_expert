
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./Account.module.css";

const Account = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    Fullname: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.fullname || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    // TODO: Send update request to backend here
  };

  return (
    <div className={styles.container}>
      <h2>Account Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>FullName</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Account;
