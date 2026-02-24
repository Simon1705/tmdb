import { useState } from 'react';
import { MODAL_ANIMATION_DELAY } from '../lib';

export const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalOpening, setIsModalOpening] = useState(false);

  const openModal = () => {
    setShowModal(true);
    setIsModalOpening(true);
    // Trigger animation after mount
    setTimeout(() => {
      setIsModalOpening(false);
    }, 10);
  };

  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsModalClosing(false);
    }, MODAL_ANIMATION_DELAY);
  };

  return {
    showModal,
    isModalClosing,
    isModalOpening,
    openModal,
    closeModal,
  };
};
