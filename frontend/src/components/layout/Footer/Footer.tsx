import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>Code Snippet Vault</p>
        <p className={styles.copyright}>© 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};