import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, color, icon: Icon }) => {
  return (
    <div className={styles.card} style={{ borderLeftColor: color }}>
      <div className={styles.iconWrap}>
        {Icon && <Icon className={styles.icon} />}
      </div>
      <div>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
