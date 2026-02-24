import { Toast as ToastType } from './lib';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[320px] border ${
        toast.type === 'success' 
          ? 'bg-emerald-500/15 border-emerald-400/40 text-white' 
          : 'bg-red-500/15 border-red-400/40 text-white'
      }`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <p className="flex-1 font-medium text-white">{toast.message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-indigo-100 hover:text-white cursor-pointer"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
