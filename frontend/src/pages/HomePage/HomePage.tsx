import React from 'react';
import { FilterBar } from '../../components/snippet/FilterBar/FilterBar';
import { SnippetList } from '../../components/snippet/SnippetList/SnippetList';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <FilterBar />
      <SnippetList />
    </div>
  );
};