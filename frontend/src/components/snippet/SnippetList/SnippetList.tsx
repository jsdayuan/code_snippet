import React from 'react';
import { SnippetCard } from '../SnippetCard/SnippetCard';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { Skeleton } from '../../ui/Skeleton/Skeleton';
import { useSnippets } from '../../../hooks/useSnippets';
import styles from './SnippetList.module.css';

export const SnippetList: React.FC = () => {
  const { snippets, isLoading } = useSnippets();

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.skeletonCard}>
            <Skeleton width="80px" height="24px" borderRadius="var(--radius-full)" />
            <Skeleton width="100%" height="24px" style={{ marginTop: '12px' }} />
            <Skeleton width="70%" height="20px" style={{ marginTop: '8px' }} />
            <div className={styles.skeletonTags}>
              <Skeleton width="60px" height="20px" borderRadius="var(--radius-full)" />
              <Skeleton width="50px" height="20px" borderRadius="var(--radius-full)" style={{ marginLeft: '8px' }} />
            </div>
            <Skeleton width="60px" height="16px" style={{ marginTop: '12px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <EmptyState
        title="暂无代码片段"
        description="点击右上角的「新建」按钮，开始创建您的第一个代码片段"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
};