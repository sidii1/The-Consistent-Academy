import { useEffect } from 'react';
import Lenis from 'lenis';
import { IS_TOUCH } from '@/lib/device';

export const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Lenis only smooths wheel input; on touch devices it would just run an
    // idle rAF loop every frame, so skip it there (native scrolling is used).
    if (IS_TOUCH) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
