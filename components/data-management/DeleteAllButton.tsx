'use client';

import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DeleteAllButtonProps {
  totalMovies: number;
  onDeleteComplete: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function DeleteAllButton({ totalMovies, onDeleteComplete, onShowToast }: DeleteAllButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (showModal && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showModal, countdown]);

  // Cleanup: re-enable scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const openModal = () => {
    setShowModal(true);
    setShouldRenderModal(true);
    setCountdown(5);
    setConfirmText('');
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      setIsModalAnimating(true);
    }, 10);
  };

  const closeModal = () => {
    setIsModalAnimating(false);
    // Re-enable scrolling
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      setShowModal(false);
      setShouldRenderModal(false);
      setConfirmText('');
      setCountdown(5);
    }, 300);
  };

  const handleDeleteAll = async () => {
    if (confirmText !== 'DELETE ALL' || countdown > 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/movies/delete-all', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onShowToast(`Successfully deleted ${data.deletedCount} movies`, 'success');
        closeModal();
        onDeleteComplete();
      } else {
        onShowToast('Failed to delete movies', 'error');
      }
    } catch (error) {
      console.error('Delete all error:', error);
      onShowToast('An error occurred while deleting movies', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isConfirmValid = confirmText === 'DELETE ALL' && countdown === 0;

  return (
    <>
      <button
        onClick={openModal}
        disabled={totalMovies === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-full hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium cursor-pointer hover:-translate-y-0.5 active:scale-95"
        aria-label="Delete all movies"
        title={totalMovies === 0 ? 'No movies to delete' : 'Delete all movies'}
      >
        <Trash2 className="w-4 h-4" />
        Delete All
      </button>

      {/* Delete All Confirmation Modal */}
      {mounted && shouldRenderModal && createPortal(
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
            isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            zIndex: 2147483647,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            className={`relative bg-slate-900 rounded-xl max-w-md w-full shadow-2xl border border-red-500/30 transition-all duration-300 ${
              isModalAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              disabled={isDeleting}
              className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Delete All Movies</h2>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              {/* Warning message */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  You are about to permanently delete <span className="font-semibold text-white">{totalMovies} movies</span> from the database. All movie data, ratings, and metadata will be lost.
                </p>
              </div>

              {/* Confirmation input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type <span className="text-red-400 font-semibold">DELETE ALL</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={isDeleting}
                  placeholder="DELETE ALL"
                  className="w-full px-3 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  autoComplete="off"
                  autoFocus
                />
              </div>

              {/* Countdown timer */}
              {countdown > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                  <span>Please wait {countdown}s before confirming</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/30 border-t border-slate-800 flex gap-3">
              <button
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={!isConfirmValid || isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
