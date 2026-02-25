import { useState } from 'react';

interface PosterZoomState {
  posterUrl: string;
  title: string;
}

export const usePosterZoom = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [posterData, setPosterData] = useState<PosterZoomState>({
    posterUrl: '',
    title: '',
  });

  const openPosterZoom = (posterUrl: string, title: string) => {
    setPosterData({ posterUrl, title });
    setIsOpen(true);
  };

  const closePosterZoom = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    posterData,
    openPosterZoom,
    closePosterZoom,
  };
};
