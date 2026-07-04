import React, { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { SnippetForm } from '../../snippet/SnippetForm/SnippetForm';
import styles from './SlideOver.module.css';

export const SlideOver: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { isSlideOverOpen } = state;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SLIDEOVER' });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isSlideOverOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isSlideOverOpen]);

  if (!isSlideOverOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <SnippetForm />
        </div>
      </div>
    </div>
  );
};