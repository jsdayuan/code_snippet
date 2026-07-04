import { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchSnippets } = useAppContext();

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchSnippets(searchQuery);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, searchSnippets]);

  return { searchQuery, handleSearch };
}