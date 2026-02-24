import { useState } from 'react';
import { PersonDetails } from '../lib/types';

export const usePersonModal = () => {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personDetails, setPersonDetails] = useState<PersonDetails | null>(null);
  const [loadingPerson, setLoadingPerson] = useState(false);

  const openPersonModal = async (personId: number, personName: string) => {
    setSelectedPerson({ id: personId, name: personName });
    setIsPersonModalOpen(true);
    setLoadingPerson(true);
    setPersonDetails(null);
    document.body.style.overflow = 'hidden';
    
    try {
      const response = await fetch(`/api/people/${personId}`);
      if (response.ok) {
        const data = await response.json();
        setPersonDetails(data);
      }
    } catch (error) {
      console.error('Error fetching person details:', error);
    } finally {
      setLoadingPerson(false);
    }
  };

  const closePersonModal = () => {
    setIsPersonModalOpen(false);
    setSelectedPerson(null);
    setPersonDetails(null);
    document.body.style.overflow = 'unset';
  };

  return {
    selectedPerson,
    isPersonModalOpen,
    personDetails,
    loadingPerson,
    openPersonModal,
    closePersonModal,
  };
};
