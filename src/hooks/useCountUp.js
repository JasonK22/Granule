import { useEffect, useRef, useState } from 'react';

/**
 * Animates a numeric value from its previous value to `target` whenever
 * `target` changes. Respects prefers-reduced-motion by collapsing the
 * animation to a single (still-async) frame instead of a visible count-up.
 */
export const useCountUp = (target, duration = 700) => {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const effectiveDuration = prefersReduced ? 0 : duration;

    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) {
      fromRef.current = target;
      return undefined;
    }

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = effectiveDuration === 0 ? 1 : Math.min(elapsed / effectiveDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + delta * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
};
