import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import styles from './Toast.module.css';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  info: 'var(--color-info)',
};

export const Toast: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { toast } = state;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (toast.visible) {
      timer = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [toast.visible, dispatch]);

  if (!toast.visible) return null;

  return (
    <div className={styles.toast} style={{ borderLeftColor: colors[toast.type] }}>
      <span className={styles.icon} style={{ color: colors[toast.type] }}>
        {icons[toast.type]}
      </span>
      <span className={styles.message}>{toast.message}</span>
      <button type="button" className={styles.closeBtn} onClick={() => dispatch({ type: 'HIDE_TOAST' })}>
        <XCircle size={14} />
      </button>
    </div>
  );
};