import { useState, useEffect, useRef } from 'react';

export function useValueObserver<T>(
  value: T,
  callback: (prevValue: T, newValue: T) => void,
): T {
  const [trackedValue, setTrackedValue] = useState<T>(value);
  const prevValueRef = useRef<T>(value);

  useEffect(() => {
    if (value !== trackedValue) {
      callback(prevValueRef.current, value);

      prevValueRef.current = trackedValue;

      setTrackedValue(value);
    }
  }, [value, trackedValue, callback]);

  return trackedValue;
}
