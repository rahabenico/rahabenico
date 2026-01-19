import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem
} from '@/lib/utils/localStorage';

interface UseCardStateOptions {
  id: string | undefined;
  editKey?: string;
  isLoading?: boolean;
}

interface CardState {
  isEditable: boolean;
  closeCardForm: () => void;
  openCardForm: (key: string) => void;
}

/**
 * Hook for managing card edit state and localStorage
 * Handles edit key validation, URL parameter processing, and card form closure
 */
export function useCardState({ id, editKey, isLoading = false }: UseCardStateOptions): CardState {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);

  // Close card form editing - removes edit key and marks as closed
  const closeCardForm = useCallback(() => {
    if (!id) return;

    removeLocalStorageItem(`key-${id}`);
    setLocalStorageItem(`closed-${id}`, true);
    setIsEditable(false);

    // Remove key from URL if present
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('key');
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [id, searchParams, navigate]);

  // Open card form for editing with a valid key
  const openCardForm = useCallback((key: string) => {
    if (!id || !key) return;

    setLocalStorageItem(`key-${id}`, key);
    setIsEditable(true);

    // Remove key from URL after saving to localStorage
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('key');
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [id, searchParams, navigate]);

  useEffect(() => {
    if (!id || isLoading) return;

    const urlEditKey = searchParams.get('key');
    const newSearchParams = new URLSearchParams(searchParams);

    // Check if card form was previously closed
    const closed = getLocalStorageItem<boolean>(`closed-${id}`, false);
    if (closed) {
      setIsEditable(false);
      newSearchParams.delete('key');
      navigate({ search: newSearchParams.toString() }, { replace: true });
      return;
    }

    // Check for saved edit key
    const savedEditKey = getLocalStorageItem<string | null>(`key-${id}`, null);
    if (savedEditKey && editKey && savedEditKey === editKey) {
      setIsEditable(true);
    }

    // Handle URL edit key
    if (urlEditKey && editKey && urlEditKey === editKey) {
      openCardForm(urlEditKey);
    }
  }, [id, isLoading, editKey, searchParams, navigate, openCardForm]);

  return {
    isEditable,
    closeCardForm,
    openCardForm,
  };
}
