import { X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { posterBlurDataURL } from '@/lib/image-utils';

interface PosterZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterUrl: string;
  title: string;
}

export const PosterZoomModal = ({
  isOpen,
  onClose,
  posterUrl,
  title,
}: PosterZoomModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      setIsVisible(true);
      setIsImageLoading(true); // Reset loading state when modal opens
      setImageError(false); // Reset error state when modal opens
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-md w-full transition-all duration-300 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 p-2.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group"
          aria-label="Close"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Poster Container */}
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-900/50 border-2 border-white/10">
          {/* Loading Spinner */}
          {isImageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm text-indigo-200 font-medium">Loading poster...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 px-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-400" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Failed to Load Image</h4>
                  <p className="text-sm text-slate-300">The poster image could not be loaded.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <Image
              src={posterUrl}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={posterBlurDataURL}
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 448px"
              priority
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                setImageError(true);
              }}
            />
          )}
        </div>

        {/* Title */}
        <div className="mt-4 text-center px-4">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};
