import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Movie } from './lib';

interface DeleteConfirmModalProps {
  movie: Movie | null;
  isOpen: boolean;
  isClosing: boolean;
  isOpening: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  movie,
  isOpen,
  isClosing,
  isOpening,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && !isClosing) {
      // Opening
      setShouldRender(true);
      // Trigger animation after render
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else if (isClosing) {
      // Closing
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  if (!shouldRender || !movie) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div 
        className={`bg-white/10 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 shadow-2xl border border-white/15 transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in border border-red-400/40">
            <Trash2 className="w-8 h-8 text-red-300" />
          </div>
          
          <h2 id="delete-modal-title" className="text-2xl font-bold mb-2">Delete Movie?</h2>
          <p className="text-indigo-100/80 mb-2">
            Are you sure you want to delete
          </p>
          <p className="text-lg font-semibold text-white mb-6">
            "{movie.title}"?
          </p>
          <p className="text-sm text-red-300 mb-6 font-medium">
            ⚠️ This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/15 transition-all font-semibold cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-400 transition-all font-semibold shadow-lg shadow-red-500/30 cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-2"
              aria-label={`Confirm delete ${movie.title}`}
            >
              {isDeleting && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
