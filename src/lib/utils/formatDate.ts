import { format } from "date-fns"

/**
 * Formats a date for display in the UI with a user-friendly format
 *
 * @param date - The date to format (can be a Date object or timestamp number)
 * @returns A formatted date string in the format "PPP 'at' p" (e.g., "December 25, 2023 at 3:30 PM")
 *
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T15:30:00');
 * console.log(formatDisplayDate(date)); // "December 25, 2023 at 3:30 PM"
 *
 * const timestamp = 1703512200000; // Dec 25, 2023 15:30:00
 * console.log(formatDisplayDate(timestamp)); // "December 25, 2023 at 3:30 PM"
 * ```
 */
export function formatDisplayDate(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  return format(dateObj, "PPP 'at' p")
}

/**
 * Formats a date for calendar display (date only)
 *
 * @param date - The date to format (can be a Date object or timestamp number)
 * @returns A formatted date string in the format "PPP" (e.g., "December 25, 2023")
 *
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T15:30:00');
 * console.log(formatCalendarDate(date)); // "December 25, 2023"
 * ```
 */
export function formatCalendarDate(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  return format(dateObj, "PPP")
}
