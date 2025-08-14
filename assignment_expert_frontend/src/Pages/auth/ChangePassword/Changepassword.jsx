import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Password Change Data:", passwordData);

    // TODO: Send password change request to backend here
    // Example:
    // fetch("/api/change-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(passwordData),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     alert("Password changed successfully!");
    //     navigate("/account"); // Redirect to account page
    //   });

    // For now, just reset the form
    setPasswordData({ oldPassword: "", newPassword: "" });
  };

  return (
    <div className={styles.container}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="oldPassword">Old Password</label>
        <input
          id="oldPassword"
          type="password"
          name="oldPassword"
          value={passwordData.oldPassword}
          onChange={handleChange}
          required
        />

        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
