import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (err) {
        // 防止 Prism 高亮失败导致整个页面崩溃
        console.warn('Prism highlight failed:', err);
      }
    }
  }, [code, language]);

  const getPrismLanguage = (lang: string): string => {
    const map: Record<string, string> = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      go: 'go',
      rust: 'rust',
      swift: 'swift',
      kotlin: 'kotlin',
      php: 'php',
      ruby: 'ruby',
      c: 'c',
      cpp: 'cpp',
      'c++': 'cpp',
      'c#': 'csharp',
      csharp: 'csharp',
      html: 'markup',
      xml: 'markup',
      css: 'css',
      sql: 'sql',
      json: 'json',
      markdown: 'markdown',
      md: 'markdown',
      bash: 'bash',
      shell: 'bash',
      sh: 'bash',
      yaml: 'yaml',
      yml: 'yaml',
    };
    return map[lang.toLowerCase()] || 'javascript';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.languageLabel}>{language}</span>
      </div>
      <pre className={styles.code}>
        <code ref={codeRef} className={`language-${getPrismLanguage(language)}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};