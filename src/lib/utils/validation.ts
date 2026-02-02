export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates that a string field is not empty after trimming
 *
 * @param value - The string value to validate
 * @param fieldName - The name of the field for error messages
 * @returns A ValidationError if invalid, null if valid
 *
 * @example
 * ```typescript
 * const error = validateRequired('  ', 'username')
 * if (error) {
 *   console.log(error.message) // "Username is required"
 * }
 * ```
 */
export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value.trim()) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
    };
  }
  return null;
}

/**
 * Validates that a date field is not null or undefined
 *
 * @param value - The date value to validate
 * @param fieldName - The name of the field for error messages
 * @returns A ValidationError if invalid, null if valid
 *
 * @example
 * ```typescript
 * const error = validateRequiredDate(undefined, 'date')
 * if (error) {
 *   console.log(error.message) // "Date is required"
 * }
 * ```
 */
export function validateRequiredDate(value: Date | undefined, fieldName: string): ValidationError | null {
  if (!value) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
    };
  }
  return null;
}

/**
 * Validates an email address format
 *
 * @param value - The email value to validate
 * @param fieldName - The name of the field for error messages
 * @returns A ValidationError if invalid, null if valid
 *
 * @example
 * ```typescript
 * const error = validateEmail('invalid-email', 'email')
 * if (error) {
 *   console.log(error.message) // "Email is invalid"
 * }
 * ```
 */
export function validateEmail(value: string, fieldName: string): ValidationError | null {
  if (!value.trim()) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is invalid`,
    };
  }
  return null;
}

/**
 * Validates an entry form with username and date fields
 *
 * @param username - The username value
 * @param date - The date value
 * @returns A ValidationResult with validation status and errors
 *
 * @example
 * ```typescript
 * const result = validateEntryForm('', undefined)
 * if (!result.isValid) {
 *   console.log(result.errors) // [{ field: 'username', message: 'Username is required' }, { field: 'date', message: 'Date is required' }]
 * }
 * ```
 */
export function validateEntryForm(username: string, date: Date | undefined): ValidationResult {
  const errors: ValidationError[] = [];

  const usernameError = validateRequired(username, "username");
  if (usernameError) {
    errors.push(usernameError);
  }

  const dateError = validateRequiredDate(date, "date");
  if (dateError) {
    errors.push(dateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a card creation form with customId and task fields
 *
 * @param customId - The custom ID value
 * @param task - The task description value
 * @returns A ValidationResult with validation status and errors
 *
 * @example
 * ```typescript
 * const result = validateCardForm('', '')
 * if (!result.isValid) {
 *   console.log(result.errors) // [{ field: 'customId', message: 'Card ID is required' }, { field: 'task', message: 'Task is required' }]
 * }
 * ```
 */
export function validateCardForm(customId: string, task: string): ValidationResult {
  const errors: ValidationError[] = [];

  const customIdError = validateRequired(customId, "Card ID");
  if (customIdError) {
    errors.push(customIdError);
  }

  const taskError = validateRequired(task, "Task");
  if (taskError) {
    errors.push(taskError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets a validation error message for a specific field
 *
 * @param errors - Array of validation errors
 * @param fieldName - The field name to find an error for
 * @returns The error message for the field, or undefined if no error exists
 *
 * @example
 * ```typescript
 * const errors = [{ field: 'username', message: 'Username is required' }]
 * const message = getFieldError(errors, 'username')
 * console.log(message) // "Username is required" or undefined
 * ```
 */
export function getFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  const error = errors.find((err) => err.field === fieldName);
  return error ? error.message : undefined;
}
