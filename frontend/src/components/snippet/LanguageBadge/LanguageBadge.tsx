import React from 'react';
import { LANGUAGE_LABELS, LANGUAGE_COLORS, Language } from '../../../constants/languages';
import styles from './LanguageBadge.module.css';

export interface LanguageBadgeProps {
  language: string;
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const safeLanguage = language.toLowerCase() as Language;
  const colors = LANGUAGE_COLORS[safeLanguage] || LANGUAGE_COLORS.javascript;
  const label = LANGUAGE_LABELS[safeLanguage] || language;

  return (
    <span className={styles.badge} style={{ backgroundColor: colors.bg }}>
      <span className={styles.dot} style={{ backgroundColor: colors.color }} />
      <span className={styles.label}>{label}</span>
    </span>
  );
};