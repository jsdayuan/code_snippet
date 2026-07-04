import React, { useState, useEffect } from 'react';
import { X, Save, Copy, Check } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { TextArea } from '../../ui/TextArea/TextArea';
import { Select } from '../../ui/Select/Select';
import { Tag } from '../../ui/Tag/Tag';
import { CodeBlock } from '../../ui/CodeBlock/CodeBlock';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '../../../constants/languages';
import { useAppContext } from '../../../context/AppContext';
import { useClipboard } from '../../../hooks/useClipboard';
import { formatCode } from '../../../utils/formatCode';
import styles from './SnippetForm.module.css';

interface FormData {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

export const SnippetForm: React.FC = () => {
  const { state, dispatch, createSnippet, updateSnippet, deleteSnippet } = useAppContext();
  const { slideOverMode, currentSnippet } = state;
  const { isCopied, copy } = useClipboard();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (slideOverMode === 'edit' && currentSnippet) {
      setFormData({
        title: currentSnippet.title,
        description: currentSnippet.description || '',
        code: currentSnippet.code,
        language: currentSnippet.language,
        tags: [...currentSnippet.tags],
      });
    } else if (slideOverMode === 'create') {
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: [],
      });
    } else if (slideOverMode === 'view' && currentSnippet) {
      setFormData({
        title: currentSnippet.title,
        description: currentSnippet.description || '',
        code: currentSnippet.code,
        language: currentSnippet.language,
        tags: [...currentSnippet.tags],
      });
    }
  }, [slideOverMode, currentSnippet]);

  const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang,
    label: LANGUAGE_LABELS[lang],
  }));

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCopyCode = () => {
    copy(formData.code);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.code.trim()) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '标题和代码不能为空', type: 'error' } });
      return;
    }

    const formattedCode = formatCode(formData.code, formData.language);

    if (slideOverMode === 'create') {
      createSnippet({
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formattedCode,
        language: formData.language,
        tags: formData.tags,
      });
    } else if (slideOverMode === 'edit' && currentSnippet) {
      updateSnippet(currentSnippet.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formattedCode,
        language: formData.language,
        tags: formData.tags,
      });
    }

    dispatch({ type: 'CLOSE_SLIDEOVER' });
  };

  const handleDelete = () => {
    if (!currentSnippet) return;

    dispatch({
      type: 'OPEN_ALERT',
      payload: {
        title: '确认删除',
        message: '删除后无法恢复，确定要删除这个代码片段吗？',
        onConfirm: () => {
          deleteSnippet(currentSnippet!.id);
          dispatch({ type: 'CLOSE_SLIDEOVER' });
        },
        danger: true,
      },
    });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SLIDEOVER' });
  };

  const isEditable = slideOverMode === 'create' || slideOverMode === 'edit';

  return (
    <>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {slideOverMode === 'create' ? '新建代码片段' : slideOverMode === 'edit' ? '编辑代码片段' : '查看代码片段'}
          </h2>
          {slideOverMode === 'view' && currentSnippet && (
            <p className={styles.subtitle}>创建于 {new Date(currentSnippet.createdAt).toLocaleDateString()}</p>
          )}
        </div>
        <Button variant="text" size="sm" onClick={handleClose}>
          <X size={18} />
        </Button>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>标题 *</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e)}
            placeholder="输入代码片段标题"
            disabled={!isEditable}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>描述</label>
          <TextArea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e)}
            placeholder="输入代码片段描述（可选）"
            rows={3}
            disabled={!isEditable}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={styles.languageSelect}>
              <label className={styles.label}>语言</label>
              <Select
                value={formData.language}
                onChange={(value) => handleInputChange('language', value)}
                options={languageOptions}
                disabled={!isEditable}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopyCode}>
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              {isCopied ? '已复制' : '复制代码'}
            </Button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>代码 *</label>
          <div className={styles.codeContainer}>
            {isEditable ? (
              <TextArea
                value={formData.code}
                onChange={(e) => handleInputChange('code', e)}
                placeholder="粘贴或输入代码..."
                rows={16}
                spellCheck={false}
              />
            ) : (
              <CodeBlock code={formData.code || '// 暂无代码'} language={formData.language} />
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>标签</label>
          <div className={styles.tagsContainer}>
            <div className={styles.tags}>
              {formData.tags.map((tag) => (
                <Tag key={tag} removable={isEditable} onClick={() => isEditable && handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
            {isEditable && (
              <div className={styles.tagInputWrapper}>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入标签后按 Enter 添加"
                  size="sm"
                />
                <Button variant="secondary" size="sm" onClick={handleAddTag}>
                  添加
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {slideOverMode === 'view' && currentSnippet && (
          <>
            <Button variant="secondary" onClick={() => dispatch({ type: 'OPEN_SLIDEOVER', payload: { mode: 'edit', snippet: currentSnippet } })}>
              编辑
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              删除
            </Button>
          </>
        )}
        {isEditable && (
          <Button variant="primary" onClick={handleSubmit}>
            <Save size={16} />
            保存
          </Button>
        )}
      </div>
    </>
  );
};