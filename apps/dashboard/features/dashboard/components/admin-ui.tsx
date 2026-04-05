import type {ReactNode} from 'react';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';
import type {
  ButtonClassNameOptions,
  EmptyStateProps,
  InputShellProps,
  PageHeaderProps,
  PillProps,
  SectionCardProps,
  StatCardProps,
  StatusBadgeProps,
  StickyFormActionsProps
} from '@/features/dashboard/components/admin-ui.types';

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function buttonClassName({
  variant = 'secondary',
  size = 'md'
}: ButtonClassNameOptions) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' ? 'h-10 px-3.5 text-sm' : 'h-11 px-4 text-sm',
    variant === 'primary' && 'border border-[color:var(--brand)] bg-brand text-white shadow-[0_10px_24px_rgba(79,70,229,0.14)] hover:bg-brand-strong hover:border-[color:var(--brand-strong)]',
    variant === 'secondary' && 'border border-line bg-panel text-ink shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-line-strong hover:bg-panel-subtle',
    variant === 'ghost' && 'text-ink-soft hover:bg-panel-subtle hover:text-ink',
    variant === 'danger' && 'border border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] text-danger-strong hover:brightness-[0.98]'
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta
}: PageHeaderProps) {
  return (
    <header className="overflow-hidden rounded-[32px] border border-line bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(237,242,247,0.96))] px-6 py-6 shadow-[0_24px_48px_rgba(15,23,42,0.06)] sm:px-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-ink-muted">{eyebrow}</p>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[2.2rem]">{title}</h2>
            <p className="max-w-2xl text-sm leading-7 text-ink-muted sm:text-[15px]">{description}</p>
          </div>
          {meta ? <div className="flex flex-wrap items-center gap-2.5">{meta}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

export function StatCard({
  label,
  value,
  icon,
  meta,
  tone = 'default'
}: StatCardProps) {
  return (
    <section
      className={cn(
        'rounded-[28px] border p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]',
        tone === 'default' && 'border-line bg-panel',
        tone === 'brand' && 'border-[color:var(--brand-soft)] bg-[linear-gradient(180deg,#ffffff,var(--brand-soft))]',
        tone === 'warning' && 'border-[color:var(--warning-soft)] bg-[linear-gradient(180deg,#ffffff,#fff8eb)]'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-ink-muted">{label}</p>
          <div className="text-3xl font-semibold tracking-[-0.04em] text-ink">{value}</div>
          {meta ? <div className="text-sm text-ink-muted">{meta}</div> : null}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-[18px]',
            tone === 'warning' ? 'bg-warning-soft text-warning-strong' : 'bg-brand-soft text-brand-strong'
          )}
        >
          {icon}
        </div>
      </div>
    </section>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  compact = false
}: SectionCardProps) {
  return (
    <section className={cn('rounded-[28px] border border-line bg-panel shadow-[0_16px_36px_rgba(15,23,42,0.05)]', compact ? 'p-4' : 'p-5 sm:p-6')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink">{title}</h3>
            {description ? <p className="max-w-2xl text-sm leading-6 text-ink-muted">{description}</p> : null}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function StatusBadge({status}: StatusBadgeProps) {
  const labels = {
    active: 'Aktif',
    draft: 'Taslak',
    passive: 'Pasif'
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'active' && 'bg-success-soft text-success-strong',
        status === 'draft' && 'bg-warning-soft text-warning-strong',
        status === 'passive' && 'bg-panel-strong text-ink-soft'
      )}
    >
      {labels[status]}
    </span>
  );
}

export function InputShell({
  label,
  hint,
  error,
  htmlFor,
  children
}: InputShellProps) {
  return (
    <label className="flex flex-col gap-2.5" htmlFor={htmlFor}>
      <div className="space-y-1">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint ? <p className="text-xs leading-5 text-ink-muted">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-xs font-medium text-danger-strong">{error}</p> : null}
    </label>
  );
}

export function textInputClassName(hasError = false) {
  return cn(
    'w-full rounded-[18px] border bg-white px-4 py-3 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand/10',
    hasError ? 'border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)]/40' : 'border-line hover:border-line-strong'
  );
}

export function Pill({children}: PillProps) {
  return <span className="inline-flex items-center rounded-full border border-line bg-panel px-3 py-1.5 text-xs font-medium text-ink-soft">{children}</span>;
}

export function EmptyState({
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-line-strong bg-panel-subtle px-6 py-10 text-center">
      <div className="mx-auto max-w-md space-y-2">
        <h4 className="text-base font-semibold text-ink">{title}</h4>
        <p className="text-sm leading-6 text-ink-muted">{description}</p>
      </div>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function StickyFormActions({
  children
}: StickyFormActionsProps) {
  return (
    <div className="sticky bottom-4 z-20 rounded-[24px] border border-line bg-white/92 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">{children}</div>
    </div>
  );
}
