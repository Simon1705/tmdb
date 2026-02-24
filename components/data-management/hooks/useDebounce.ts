import { useState, useEffect } from 'react';
import { SEARCH_DEBOUNCE_DELAY } from '../lib';

export const useDebounce = <T>(value: T, delay: number = SEARCH_DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
