import type {ReactNode} from 'react';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';

export type ButtonClassNameOptions = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
};

export type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: ReactNode;
};

export type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  meta?: ReactNode;
  tone?: 'default' | 'brand' | 'warning';
};

export type SectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  compact?: boolean;
};

export type StatusBadgeProps = {
  status: TourLifecycleStatus;
};

export type InputShellProps = {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
};

export type PillProps = {
  children: ReactNode;
};

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export type StickyFormActionsProps = {
  children: ReactNode;
};
