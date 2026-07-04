import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import styles from './Tag.module.css';

export interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  children,
  selected = false,
  onClick,
  onRemove,
  removable = false,
}) => {
  return (
    <span
      className={clsx(styles.tag, { [styles.selected]: selected })}
      onClick={onClick}
    >
      {children}
      {removable && onRemove && (
        <button type="button" className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <X size={12} />
        </button>
      )}
    </span>
  );
};