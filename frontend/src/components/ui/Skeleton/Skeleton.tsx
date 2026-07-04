import React from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-md)',
  className,
  style,
}) => {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius, ...style }}
    />
  );
};