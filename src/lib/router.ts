import { useState, useEffect, useCallback } from 'react';

export function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return pathname;
}

export function parseQueryParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function useRouter() {
  const [path, setPath] = useState<string>(getCleanPath);
  const [query, setQuery] = useState<Record<string, string>>(parseQueryParams);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCleanPath());
      setQuery(parseQueryParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (typeof window === 'undefined') return;

    const [targetPath, searchStr] = to.split('?');
    const cleanTargetPath = targetPath.replace(/\/+$/, '') || '/';
    const fullUrl = searchStr ? `${cleanTargetPath}?${searchStr}` : cleanTargetPath;

    if (replace) {
      window.history.replaceState({}, '', fullUrl);
    } else {
      window.history.pushState({}, '', fullUrl);
    }

    setPath(cleanTargetPath);
    setQuery(searchStr ? parseQueryParams() : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const replace = useCallback((to: string) => navigate(to, true), [navigate]);

  return {
    path,
    query,
    navigate,
    replace,
    isPublic: path === '/' || path === '/auth/login' || path.startsWith('/auth/'),
  };
}
