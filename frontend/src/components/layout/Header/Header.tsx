import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { useAppContext } from '../../../context/AppContext';
import { useSearch } from '../../../hooks/useSearch';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { dispatch } = useAppContext();
  const { searchQuery, handleSearch } = useSearch();

  const handleNewClick = () => {
    dispatch({ type: 'OPEN_SLIDEOVER', payload: { mode: 'create' } });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>{'{}'}</div>
          <span>Code Snippet Vault</span>
        </div>

        <div className={styles.searchWrapper}>
          <Input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="搜索代码片段..."
            icon={<Search size={16} />}
          />
        </div>

        <Button onClick={handleNewClick} variant="primary">
          <Plus size={16} />
          新建
        </Button>
      </div>
    </header>
  );
};