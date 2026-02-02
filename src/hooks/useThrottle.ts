import { useRef, useCallback } from "react";

/**
 * Returns a throttled version of the callback that only executes once per delay period
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );
}
