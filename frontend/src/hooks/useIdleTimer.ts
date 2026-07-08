'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIdleTimerOptions {
  timeoutMs: number;
  warningBeforeMs: number;
  onExpire: () => void;
}

export function useIdleTimer({ timeoutMs, warningBeforeMs, onExpire }: UseIdleTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const expiredRef = useRef(false);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingSeconds(0);
    expiredRef.current = false;
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivityRef.current;
      const warningThreshold = timeoutMs - warningBeforeMs;

      if (idleTime >= timeoutMs && !expiredRef.current) {
        expiredRef.current = true;
        setShowWarning(false);
        setRemainingSeconds(0);
        onExpire();
      } else if (idleTime >= warningThreshold && !expiredRef.current) {
        const timeLeftMs = timeoutMs - idleTime;
        setRemainingSeconds(Math.max(0, Math.ceil(timeLeftMs / 1000)));
        setShowWarning(true);
      } else {
        setShowWarning(false);
        setRemainingSeconds(0);
      }
    }, 500);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [timeoutMs, warningBeforeMs, onExpire]);

  return { showWarning, remainingSeconds, resetTimer };
}
