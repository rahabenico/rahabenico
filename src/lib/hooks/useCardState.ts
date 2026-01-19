import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/lib/utils/localStorage";

interface UseCardStateOptions {
  id: string | undefined;
  editKey?: string;
}

interface CardState {
  editMode: boolean;
  closeEntryWindow: () => void;
}

/**
 * Hook for managing card edit state and localStorage
 * Handles edit key validation, URL parameter processing, and card form closure
 */
export function useCardState({ id, editKey }: UseCardStateOptions): CardState {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize isEditable based on localStorage state and URL params
  const [editMode, setEditMode] = useState(false);

  const updateEditMode = useEffectEvent((state: boolean) => {
    console.log("updateEditMode", state);
    setEditMode(state);
  });

  const handleUrlKey = useEffectEvent(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.delete("key");
    navigate({ search: newSearchParams.toString() }, { replace: true });
  });

  useEffect(() => {
    if (!id || !editKey) return;

    const closed = getLocalStorageItem<boolean>(`closed-${id}`, false);

    if (closed) {
      return;
    }

    const urlKey = searchParams.get("key");

    // Handle URL edit key - save to localStorage and navigate (state already set in initial state)
    if (urlKey === editKey) {
      setLocalStorageItem(`key-${id}`, urlKey);
      handleUrlKey();
      updateEditMode(true);

      return;
    }

    const savedKey = getLocalStorageItem<string | null>(`key-${id}`, null);

    if (savedKey && savedKey === editKey) {
      updateEditMode(true);
      return;
    }

    return;
  }, [id, editKey, searchParams]);

  const closeEntryWindow = () => {
    removeLocalStorageItem(`key-${id}`);
    setLocalStorageItem(`closed-${id}`, true);
    setEditMode(false);
  };

  return {
    editMode,
    closeEntryWindow,
  };
}
