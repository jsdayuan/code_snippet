import React from 'react';
import clsx from 'clsx';
import styles from './TextArea.module.css';

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  spellCheck?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error,
  spellCheck = true,
}) => {
  return (
    <div className={styles.container}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        spellCheck={spellCheck}
        className={clsx(styles.textarea, { [styles.hasError]: error })}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};