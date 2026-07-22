'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration to prevent previous scroll positions from being restored
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Scroll to top immediately on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
