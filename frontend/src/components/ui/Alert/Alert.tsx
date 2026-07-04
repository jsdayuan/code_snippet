import React from 'react';
import styles from './Alert.module.css';
import { Button } from '../Button/Button';
import { useAppContext } from '../../../context/AppContext';

export const Alert: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { alert } = state;

  if (!alert.isOpen) return null;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_ALERT' });
  };

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    handleClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{alert.title}</h3>
        {alert.message && <p className={styles.message}>{alert.message}</p>}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleClose}>
            {alert.cancelText || '取消'}
          </Button>
          <Button variant={alert.danger ? 'danger' : 'primary'} onClick={handleConfirm}>
            {alert.confirmText || '确定'}
          </Button>
        </div>
      </div>
    </div>
  );
};