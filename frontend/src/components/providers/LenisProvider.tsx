'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Only enable smooth scrolling on the main page, not dashboard pages
    if (!pathname || pathname === '/dashboard') {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8, // Faster duration for better responsiveness
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
