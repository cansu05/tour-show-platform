'use client';

import type {AnchorHTMLAttributes, MouseEvent, ReactNode} from 'react';
import {useEffect, useState} from 'react';
import type {Route} from 'next';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/features/dashboard/components/admin-ui';

type LoadingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  loadingLabel?: string;
};

function getComparablePath(href: string) {
  return href.split('#')[0]?.split('?')[0] || href;
}

export function LoadingLink({
  href,
  children,
  className,
  loadingLabel = 'Yükleniyor...',
  onClick,
  ...props
}: LoadingLinkProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const comparableHref = getComparablePath(href);
  const isPending = pendingHref === href;

  useEffect(() => {
    if (!pendingHref) return;

    if (getComparablePath(pendingHref) === pathname) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === '_blank' ||
      comparableHref === pathname
    ) {
      return;
    }

    setPendingHref(href);
  };

  return (
    <Link href={href as Route} onClick={handleClick} aria-busy={isPending} className={cn('relative', className, isPending && 'pointer-events-none')} {...props}>
      {children}
      {isPending ? (
        <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-white/75 backdrop-blur-[1px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-ink shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
            {loadingLabel}
          </span>
        </span>
      ) : null}
    </Link>
  );
}

