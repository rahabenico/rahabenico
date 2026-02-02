import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { type ValidationResult, validateCardForm } from "../utils/validation";

export interface CardCreationState {
  customId: string;
  task: string;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  generatedUrl: string | null;
}

/**
 * Hook for managing card creation form state and submission
 *
 * @returns An object containing form state, handlers, and validation
 *
 * @example
 * ```typescript
 * function AdminForm() {
 *   const {
 *     formState,
 *     validation,
 *     handleInputChange,
 *     handleSubmit
 *   } = useCardCreation()
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="customId"
 *         value={formState.customId}
 *         onChange={handleInputChange}
 *         aria-invalid={!!validation.errors.find(e => e.field === 'customId')}
 *       />
 *       {validation.errors.find(e => e.field === 'customId')?.message}
 *
 *       <textarea
 *         name="task"
 *         value={formState.task}
 *         onChange={handleInputChange}
 *       />
 *
 *       <button type="submit" disabled={formState.isSubmitting}>
 *         {formState.isSubmitting ? 'Creating...' : 'Create Card'}
 *       </button>
 *
 *       {formState.error && <div className="error">{formState.error}</div>}
 *       {formState.success && <div className="success">Card created!</div>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useCardCreation(adminPassword: string | null) {
  const createCard = useMutation(api.cardEntries.createCard);

  const [formState, setFormState] = useState<CardCreationState>({
    customId: "",
    task: "",
    isSubmitting: false,
    error: null,
    success: false,
    generatedUrl: null,
  });

  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
      error: null,
      success: false,
    }));

    // Clear validation errors for this field
    setValidation((prev) => ({
      ...prev,
      errors: prev.errors.filter((error) => error.field !== name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminPassword) {
      setFormState((prev) => ({
        ...prev,
        error: "Please log in with admin password",
        isSubmitting: false,
      }));
      return;
    }

    const validationResult = validateCardForm(formState.customId, formState.task);
    setValidation(validationResult);

    if (!validationResult.isValid) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
      success: false,
    }));

    try {
      const result = await createCard({
        customId: formState.customId.trim(),
        task: formState.task.trim(),
        adminPassword,
      });

      const editUrl = `https://www.rahabenico.de/card/${formState.customId.trim()}?key=${result.editKey}`;

      setFormState((prev) => ({
        ...prev,
        success: true,
        isSubmitting: false,
        customId: prev.customId, // Keep the customId for QR code naming
        task: prev.task, // Keep the task for reference
        generatedUrl: editUrl,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create card";
      setFormState((prev) => ({
        ...prev,
        error: errorMessage,
        isSubmitting: false,
      }));
    }
  };

  const resetForm = () => {
    setFormState({
      customId: "",
      task: "",
      isSubmitting: false,
      error: null,
      success: false,
      generatedUrl: null,
    });
    setValidation({
      isValid: true,
      errors: [],
    });
  };

  return {
    formState,
    validation,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
