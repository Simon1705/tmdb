import { useState, useEffect } from 'react';

interface UseCollapsibleOptions {
  storageKey: string;
  defaultExpanded?: boolean;
}

export const useCollapsible = ({ 
  storageKey, 
  defaultExpanded = false 
}: UseCollapsibleOptions) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setIsExpanded(stored === 'true');
    }
  }, [storageKey]);

  const toggle = () => {
    setIsAnimating(true);
    setIsExpanded(prev => {
      const newValue = !prev;
      localStorage.setItem(storageKey, String(newValue));
      return newValue;
    });
    
    // Reset animating state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return {
    isExpanded,
    isAnimating,
    toggle,
  };
};
