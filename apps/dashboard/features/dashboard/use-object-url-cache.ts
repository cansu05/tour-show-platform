'use client';

import {useEffect, useMemo, useRef, useState} from 'react';

type ObjectUrlEntry = {
  file: File;
  url: string;
};

export function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setUrl('');
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  return url;
}

export function useObjectUrlMap(items: Array<{id: string; file: File}>) {
  const cacheRef = useRef(new Map<string, ObjectUrlEntry>());
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const nextKeys = new Set(items.map((item) => item.id));
    let changed = false;

    for (const [key, entry] of cacheRef.current.entries()) {
      if (!nextKeys.has(key)) {
        URL.revokeObjectURL(entry.url);
        cacheRef.current.delete(key);
        changed = true;
      }
    }

    for (const item of items) {
      const cached = cacheRef.current.get(item.id);
      if (!cached || cached.file !== item.file) {
        if (cached) {
          URL.revokeObjectURL(cached.url);
        }

        cacheRef.current.set(item.id, {
          file: item.file,
          url: URL.createObjectURL(item.file)
        });
        changed = true;
      }
    }

    if (changed) {
      setVersion((current) => current + 1);
    }
  }, [items]);

  useEffect(() => {
    return () => {
      for (const entry of cacheRef.current.values()) {
        URL.revokeObjectURL(entry.url);
      }
      cacheRef.current.clear();
    };
  }, []);

  return useMemo(() => items.map((item) => cacheRef.current.get(item.id)?.url || ''), [items, version]);
}
