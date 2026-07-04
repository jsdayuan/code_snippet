import React from 'react';
import { Card } from '../../ui/Card/Card';
import { Tag } from '../../ui/Tag/Tag';
import { LanguageBadge } from '../LanguageBadge/LanguageBadge';
import { formatDate } from '../../../utils/formatDate';
import { Snippet } from '../../../types/snippet';
import { useAppContext } from '../../../context/AppContext';
import styles from './SnippetCard.module.css';

export interface SnippetCardProps {
  snippet: Snippet;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const { dispatch } = useAppContext();

  const handleClick = () => {
    dispatch({ type: 'OPEN_SLIDEOVER', payload: { mode: 'view', snippet } });
  };

  return (
    <Card onClick={handleClick} className={styles.card}>
      <div className={styles.header}>
        <LanguageBadge language={snippet.language} />
      </div>

      <h3 className={styles.title}>{snippet.title}</h3>

      {snippet.description && (
        <p className={styles.description}>{snippet.description}</p>
      )}

      <div className={styles.tags}>
        {snippet.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <p className={styles.time}>{formatDate(snippet.createdAt)}</p>
    </Card>
  );
};