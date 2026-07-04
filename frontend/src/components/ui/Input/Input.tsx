import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  icon,
  size = 'md',
  onKeyDown,
}) => {
  return (
    <div className={styles.container}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(styles.input, styles[size], {
          [styles.hasError]: error,
          [styles.hasIcon]: icon,
        })}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};