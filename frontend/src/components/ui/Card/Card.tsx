import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className,
  hoverable = true,
}) => {
  return (
    <div
      className={clsx(styles.card, { [styles.hoverable]: hoverable }, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};