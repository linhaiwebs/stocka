import { useEffect, useRef, useCallback, useState } from 'react';

export interface TimeOnPageOptions {
  onMilestone?: (seconds: number) => void;
  milestones?: number[];
  updateIntervalMs?: number;
}

export function useTimeOnPage(options: TimeOnPageOptions = {}) {
  const {
    onMilestone,
    milestones = [10, 30, 60, 300],
    updateIntervalMs = 1000,
  } = options;

  const [timeOnPage, setTimeOnPage] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const activeTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout>();

  const updateTime = useCallback(() => {
    if (isActiveRef.current) {
      const now = Date.now();
      const elapsed = now - lastUpdateTimeRef.current;
      activeTimeRef.current += elapsed;
      lastUpdateTimeRef.current = now;

      const seconds = Math.floor(activeTimeRef.current / 1000);
      setTimeOnPage(seconds);

      milestones.forEach((milestone) => {
        if (
          seconds >= milestone &&
          !reachedMilestonesRef.current.has(milestone)
        ) {
          reachedMilestonesRef.current.add(milestone);
          onMilestone?.(milestone);
        }
      });
    }
  }, [milestones, onMilestone]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isActiveRef.current) {
          const now = Date.now();
          activeTimeRef.current += now - lastUpdateTimeRef.current;
        }
        isActiveRef.current = false;
      } else {
        isActiveRef.current = true;
        lastUpdateTimeRef.current = Date.now();
      }
    };

    const handleFocus = () => {
      isActiveRef.current = true;
      lastUpdateTimeRef.current = Date.now();
    };

    const handleBlur = () => {
      if (isActiveRef.current) {
        const now = Date.now();
        activeTimeRef.current += now - lastUpdateTimeRef.current;
      }
      isActiveRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    intervalRef.current = setInterval(updateTime, updateIntervalMs);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTime, updateIntervalMs]);

  const getTimeOnPage = useCallback(() => {
    if (isActiveRef.current) {
      const now = Date.now();
      return Math.floor((activeTimeRef.current + (now - lastUpdateTimeRef.current)) / 1000);
    }
    return Math.floor(activeTimeRef.current / 1000);
  }, []);

  const getReachedMilestones = useCallback(() => {
    return Array.from(reachedMilestonesRef.current);
  }, []);

  return {
    timeOnPage,
    getTimeOnPage,
    getReachedMilestones,
  };
}
