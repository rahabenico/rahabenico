import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/lib/utils/localStorage";

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

  // Initialize isEditable based on localStorage state and URL params
  const [isEditable, setIsEditable] = useState(() => {
    if (!id) return false;

    const closed = getLocalStorageItem<boolean>(`closed-${id}`, false);
    if (closed) return false;

    // Check for saved edit key
    const savedEditKey = getLocalStorageItem<string | null>(`key-${id}`, null);
    if (savedEditKey && editKey && savedEditKey === editKey) {
      return true;
    }

    // Check URL edit key
    const urlEditKey = searchParams.get("key");
    if (urlEditKey && editKey && urlEditKey === editKey) {
      return true;
    }

    return false;
  });

  // Close card form editing - removes edit key and marks as closed
  const closeCardForm = useCallback(() => {
    if (!id) return;

    removeLocalStorageItem(`key-${id}`);
    setLocalStorageItem(`closed-${id}`, true);
    setIsEditable(false);

    // Remove key from URL if present
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("key");
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [id, searchParams, navigate]);

  // Open card form for editing with a valid key
  const openCardForm = useCallback(
    (key: string) => {
      if (!id || !key) return;

      setLocalStorageItem(`key-${id}`, key);
      setIsEditable(true);

      // Remove key from URL after saving to localStorage
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("key");
      navigate({ search: newSearchParams.toString() }, { replace: true });
    },
    [id, searchParams, navigate]
  );

  useEffect(() => {
    if (!id || isLoading) return;

    const urlEditKey = searchParams.get("key");
    const newSearchParams = new URLSearchParams(searchParams);

    // Check if card form was previously closed - only handle navigation
    const closed = getLocalStorageItem<boolean>(`closed-${id}`, false);
    if (closed) {
      newSearchParams.delete("key");
      navigate({ search: newSearchParams.toString() }, { replace: true });
      return;
    }

    // Handle URL edit key - save to localStorage and navigate (state already set in initial state)
    if (urlEditKey && editKey && urlEditKey === editKey) {
      setLocalStorageItem(`key-${id}`, urlEditKey);
      newSearchParams.delete("key");
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [id, isLoading, editKey, searchParams, navigate]);

  return {
    isEditable,
    closeCardForm,
    openCardForm,
  };
}
