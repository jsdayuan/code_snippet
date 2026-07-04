import React from 'react';
import { Code, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <Code className={styles.icon} size={48} />
        </div>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>页面未找到</p>
        <p className={styles.subDescription}>
          您访问的页面不存在或已被移动。
        </p>
        <Button onClick={() => navigate('/')} variant="primary">
          <ArrowLeft size={16} className={styles.buttonIcon} />
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;