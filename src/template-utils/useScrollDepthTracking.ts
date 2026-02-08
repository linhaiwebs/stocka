import { useEffect, useRef, useCallback } from 'react';

export interface ScrollDepthOptions {
  onDepthReached?: (depth: number) => void;
  checkpoints?: number[];
  throttleMs?: number;
}

export function useScrollDepthTracking(options: ScrollDepthOptions = {}) {
  const {
    onDepthReached,
    checkpoints = [25, 50, 75, 100],
    throttleMs = 250,
  } = options;

  const maxDepthRef = useRef(0);
  const reachedCheckpointsRef = useRef<Set<number>>(new Set());
  const lastCallTimeRef = useRef(0);

  const calculateScrollDepth = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const scrollableHeight = documentHeight - windowHeight;
    if (scrollableHeight <= 0) return 100;

    const scrollPercent = Math.round((scrollTop / scrollableHeight) * 100);
    return Math.min(scrollPercent, 100);
  }, []);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastCallTimeRef.current < throttleMs) {
      return;
    }
    lastCallTimeRef.current = now;

    const currentDepth = calculateScrollDepth();

    if (currentDepth > maxDepthRef.current) {
      maxDepthRef.current = currentDepth;

      checkpoints.forEach((checkpoint) => {
        if (
          currentDepth >= checkpoint &&
          !reachedCheckpointsRef.current.has(checkpoint)
        ) {
          reachedCheckpointsRef.current.add(checkpoint);
          onDepthReached?.(checkpoint);
        }
      });
    }
  }, [calculateScrollDepth, checkpoints, onDepthReached, throttleMs]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getMaxDepth = useCallback(() => {
    return maxDepthRef.current;
  }, []);

  const getReachedCheckpoints = useCallback(() => {
    return Array.from(reachedCheckpointsRef.current);
  }, []);

  return {
    getMaxDepth,
    getReachedCheckpoints,
  };
}
