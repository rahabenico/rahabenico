import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { GPSPosition } from "../utils/geolocation";
import { type ValidationResult, validateEntryForm } from "../utils/validation";

interface SuggestionItem {
  id: string;
  value: string;
}

export interface EntryFormData {
  username: string;
  date: Date | undefined;
  location: string;
  comment: string;
  showComment: boolean;
  instagram: string;
  showInstagram: boolean;
  gpsPosition: GPSPosition | null;
  city: string;
  artistSuggestions: SuggestionItem[];
  taskSuggestions: SuggestionItem[];
  showArtistSuggestions: boolean;
  showTaskSuggestions: boolean;
}

export interface EntryFormState extends EntryFormData {
  isSubmitting: boolean;
  validation: ValidationResult;
}

/**
 * Hook for managing entry form state and submission
 *
 * @param cardId - The ID of the card to add the entry to
 * @param onSuccess - Callback function called when entry is successfully created
 * @returns An object containing form state and control functions
 *
 * @example
 * ```typescript
 * function EntryForm({ cardId, onSuccess }) {
 *   const {
 *     formState,
 *     handleInputChange,
 *     handleDateChange,
 *     handleSubmit,
 *     addArtistSuggestion,
 *     removeArtistSuggestion,
 *     toggleComment,
 *     setGPSData
 *   } = useEntryFormState(cardId, onSuccess)
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="username"
 *         value={formState.username}
 *         onChange={handleInputChange}
 *       />
 *       <DatePicker
 *         date={formState.date}
 *         onChange={handleDateChange}
 *       />
 *       <button type="submit" disabled={formState.isSubmitting}>
 *         {formState.isSubmitting ? 'Saving...' : 'Save Entry'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useEntryFormState(cardId: Id<"cards">, onSuccess?: () => void) {
  const createCardEntry = useMutation(api.cardEntries.createCardEntry);

  const [formState, setFormState] = useState<EntryFormState>({
    username: "",
    date: undefined,
    location: "",
    comment: "",
    showComment: false,
    instagram: "",
    showInstagram: false,
    gpsPosition: null,
    city: "",
    artistSuggestions: [{ id: "artist-0", value: "" }],
    taskSuggestions: [{ id: "task-0", value: "" }],
    showArtistSuggestions: false,
    showTaskSuggestions: false,
    isSubmitting: false,
    validation: { isValid: true, errors: [] },
  });

  const updateFormField = <K extends keyof EntryFormData>(field: K, value: EntryFormData[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      validation: {
        ...prev.validation,
        errors: prev.validation.errors.filter((error) => error.field !== field),
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormField(name as keyof EntryFormData, value);
  };

  const handleFieldChange = (field: keyof EntryFormData, value: EntryFormData[keyof EntryFormData]) => {
    updateFormField(field, value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Preserve the current time or set to current time if date was previously undefined
      const currentDate = formState.date || new Date();
      const newDate = new Date(date);
      newDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
      updateFormField("date", newDate);
    } else {
      updateFormField("date", date);
    }
  };

  const toggleComment = () => {
    setFormState((prev) => ({
      ...prev,
      showComment: !prev.showComment,
      comment: !prev.showComment ? prev.comment : "",
    }));
  };

  const toggleInstagram = () => {
    setFormState((prev) => ({
      ...prev,
      showInstagram: !prev.showInstagram,
      instagram: !prev.showInstagram ? prev.instagram : "",
    }));
  };

  const toggleArtistSuggestions = () => {
    setFormState((prev) => ({
      ...prev,
      showArtistSuggestions: !prev.showArtistSuggestions,
      artistSuggestions: !prev.showArtistSuggestions
        ? [{ id: "artist-0", value: "" }]
        : [{ id: "artist-0", value: "" }],
    }));
  };

  const toggleTaskSuggestions = () => {
    setFormState((prev) => ({
      ...prev,
      showTaskSuggestions: !prev.showTaskSuggestions,
      taskSuggestions: !prev.showTaskSuggestions ? [{ id: "task-0", value: "" }] : [{ id: "task-0", value: "" }],
    }));
  };

  const addArtistSuggestion = () => {
    setFormState((prev) => ({
      ...prev,
      artistSuggestions: [...prev.artistSuggestions, { id: `artist-${Date.now()}`, value: "" }],
    }));
  };

  const removeArtistSuggestion = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      artistSuggestions: prev.artistSuggestions.filter((_, i) => i !== index),
    }));
  };

  const updateArtistSuggestion = (index: number, value: string) => {
    setFormState((prev) => ({
      ...prev,
      artistSuggestions: prev.artistSuggestions.map((suggestion, i) =>
        i === index ? { ...suggestion, value } : suggestion
      ),
    }));
  };

  const addTaskSuggestion = () => {
    setFormState((prev) => ({
      ...prev,
      taskSuggestions: [...prev.taskSuggestions, { id: `task-${Date.now()}`, value: "" }],
    }));
  };

  const removeTaskSuggestion = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      taskSuggestions: prev.taskSuggestions.filter((_, i) => i !== index),
    }));
  };

  const updateTaskSuggestion = (index: number, value: string) => {
    setFormState((prev) => ({
      ...prev,
      taskSuggestions: prev.taskSuggestions.map((suggestion, i) =>
        i === index ? { ...suggestion, value } : suggestion
      ),
    }));
  };

  const setGPSData = useCallback((position: GPSPosition | null, city: string = "") => {
    setFormState((prev) => ({
      ...prev,
      gpsPosition: position,
      city,
    }));
  }, []);

  const resetForm = () => {
    setFormState({
      username: "",
      date: undefined,
      location: "",
      comment: "",
      showComment: false,
      instagram: "",
      showInstagram: false,
      gpsPosition: null,
      city: "",
      artistSuggestions: [{ id: "artist-0", value: "" }],
      taskSuggestions: [{ id: "task-0", value: "" }],
      showArtistSuggestions: false,
      showTaskSuggestions: false,
      isSubmitting: false,
      validation: { isValid: true, errors: [] },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validateEntryForm(formState.username, formState.date);
    setFormState((prev) => ({
      ...prev,
      validation: validationResult,
    }));

    if (!validationResult.isValid) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      await createCardEntry({
        cardId,
        username: formState.username.trim(),
        date: formState.date!.getTime(),
        gpsPosition: formState.gpsPosition || undefined,
        location: formState.location.trim() || undefined,
        city: formState.city.trim() || undefined,
        comment: formState.comment.trim() || undefined,
        instagram: formState.instagram.trim() || undefined,
        artistSuggestions: formState.showArtistSuggestions
          ? formState.artistSuggestions.filter((s) => s.value.trim()).length > 0
            ? formState.artistSuggestions.filter((s) => s.value.trim()).map((s) => s.value)
            : undefined
          : undefined,
        taskSuggestions: formState.showTaskSuggestions
          ? formState.taskSuggestions.filter((s) => s.value.trim()).length > 0
            ? formState.taskSuggestions.filter((s) => s.value.trim()).map((s) => s.value)
            : undefined
          : undefined,
      });

      // Reset form
      resetForm();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating entry:", error);
      alert("Failed to save entry. Please try again.");
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  return {
    formState,
    handleInputChange,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    toggleComment,
    toggleInstagram,
    toggleArtistSuggestions,
    toggleTaskSuggestions,
    addArtistSuggestion,
    removeArtistSuggestion,
    updateArtistSuggestion,
    addTaskSuggestion,
    removeTaskSuggestion,
    updateTaskSuggestion,
    setGPSData,
    resetForm,
  };
}
