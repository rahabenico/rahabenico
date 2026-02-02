import { format } from "date-fns";
import { de } from "date-fns/locale";

/**
 * Formats a date for display in the UI with a user-friendly format
 *
 * @param date - The date to format (can be a Date object or timestamp number)
 * @returns A formatted date string in German format (e.g., "02.02.2026 15:30")
 *
 * @example
 * ```typescript
 * const date = new Date('2026-02-02T15:30:00');
 * console.log(formatDisplayDate(date)); // "02.02.2026 15:30"
 *
 * const timestamp = 1767439800000; // Feb 2, 2026 15:30:00
 * console.log(formatDisplayDate(timestamp)); // "02.02.2026 15:30"
 * ```
 */
export function formatDisplayDate(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;
  return format(dateObj, "dd.MM.yyyy HH:mm", { locale: de });
}

/**
 * Formats a date for calendar display (date only)
 *
 * @param date - The date to format (can be a Date object or timestamp number)
 * @returns A formatted date string in German format (e.g., "25. Dezember 2023")
 *
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T15:30:00');
 * console.log(formatCalendarDate(date)); // "25. Dezember 2023"
 * ```
 */
export function formatCalendarDate(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;
  return format(dateObj, "PPP", { locale: de });
}
