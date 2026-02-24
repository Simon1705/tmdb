import { useState } from 'react';
import { Toast, TOAST_DURATION } from '../lib';

export const useToast = () => {
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, TOAST_DURATION);
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
