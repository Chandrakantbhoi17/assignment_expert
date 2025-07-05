import React from 'react';
import styles from './footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h3>Contact Us</h3>
          <p>Email: support@assignmenthub.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
        <div className={styles.footerColumn}>
          <h3>Address</h3>
          <p>TestQuest Pvt. Ltd.</p>
          <p>O-Hub Bhubaneswar,India</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Assignment Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
