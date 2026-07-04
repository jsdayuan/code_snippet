import React, { useEffect, useRef, useState } from 'react';
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
  const fullscreenCodeRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (err) {
        console.warn('Prism highlight failed:', err);
      }
    }
  }, [code, language]);

  useEffect(() => {
    if (isFullscreen && fullscreenCodeRef.current) {
      try {
        Prism.highlightElement(fullscreenCodeRef.current);
      } catch (err) {
        console.warn('Prism highlight failed in fullscreen:', err);
      }
    }
  }, [isFullscreen, code, language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

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

  const handleFullscreenClick = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.dots}>
            <span className={clsx(styles.dot, styles.red)} />
            <span className={clsx(styles.dot, styles.yellow)} />
            <span className={clsx(styles.dot, styles.green)} onClick={handleFullscreenClick} />
          </div>
          <span className={styles.languageLabel}>{language}</span>
        </div>
        <pre className={styles.code}>
          <code ref={codeRef} className={`language-${getPrismLanguage(language)}`}>
            {code}
          </code>
        </pre>
      </div>

      {isFullscreen && (
        <div className={styles.fullscreenBackdrop} onClick={handleCloseFullscreen}>
          <div className={styles.fullscreenPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.fullscreenHeader}>
              <div className={styles.dots}>
                <span className={clsx(styles.dot, styles.red)} onClick={handleCloseFullscreen} />
                <span className={clsx(styles.dot, styles.yellow)} />
                <span className={clsx(styles.dot, styles.green)} />
              </div>
              <span className={styles.fullscreenLanguageLabel}>{language}</span>
            </div>
            <div className={styles.fullscreenContent}>
              <pre className={styles.fullscreenCode}>
                <code ref={fullscreenCodeRef} className={`language-${getPrismLanguage(language)}`}>
                  {code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
