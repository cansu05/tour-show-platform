'use client';

import {Box} from '@mui/material';
import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';

const MAX_LOADER_MS = 10000;

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [routeKey, isLoading]);

  useEffect(() => {
    const startLoader = () => {
      setIsLoading(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        timeoutRef.current = null;
      }, MAX_LOADER_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest('a[href]');
      if (!anchor) {
        return;
      }

      if (anchor.getAttribute('target') === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      const url = new URL(href, window.location.href);
      const isInternal = url.origin === window.location.origin;
      if (!isInternal) {
        return;
      }

      const samePathAndQuery = url.pathname === window.location.pathname && url.search === window.location.search;
      if (samePathAndQuery) {
        return;
      }

      startLoader();
    };

    const onPopState = () => startLoader();

    window.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 2000,
        pointerEvents: 'none',
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}
    >
      <Box
        sx={{
          width: '34%',
          height: '100%',
          bgcolor: 'secondary.main',
          borderRadius: 999,
          animation: isLoading ? 'route-loader 1.15s ease-in-out infinite' : 'none',
          '@keyframes route-loader': {
            '0%': {transform: 'translateX(-120%)'},
            '50%': {transform: 'translateX(110%)'},
            '100%': {transform: 'translateX(300%)'}
          }
        }}
      />
    </Box>
  );
}
