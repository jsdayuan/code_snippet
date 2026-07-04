import React from 'react';
import { Filter, X } from 'lucide-react';
import { Tag } from '../../ui/Tag/Tag';
import { Select, SelectOption } from '../../ui/Select/Select';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '../../../constants/languages';
import { useAppContext } from '../../../context/AppContext';
import styles from './FilterBar.module.css';

export const FilterBar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { selectedTags, selectedLanguage } = state;

  const languageOptions: SelectOption[] = [
    { value: '', label: '全部语言' },
    ...SUPPORTED_LANGUAGES.map((lang) => ({
      value: lang,
      label: LANGUAGE_LABELS[lang],
    })),
  ];

  const allTags = [...new Set(state.snippets.flatMap((s) => s.tags))];

  const handleTagClick = (tag: string) => {
    dispatch({ type: 'TOGGLE_TAG', payload: tag });
  };

  const handleLanguageChange = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_TAGS' });
    dispatch({ type: 'SET_LANGUAGE', payload: '' });
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedLanguage;

  return (
    <div className={styles.filterBar}>
      <div className={styles.left}>
        <span className={styles.filterLabel}>
          <Filter size={13} />
          标签
        </span>
        <div className={styles.tagsScroll}>
          {allTags.map((tag) => (
            <Tag
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        {hasActiveFilters && (
          <button type="button" className={styles.clearBtn} onClick={clearFilters}>
            <X size={13} />
            清除筛选
          </button>
        )}
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          options={languageOptions}
          placeholder="选择语言"
        />
      </div>
    </div>
  );
};