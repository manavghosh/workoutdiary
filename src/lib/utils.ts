import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateWithOrdinal(date: Date): string {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  return `${day}${suffix} ${format(date, 'MMMM yyyy')}`;
}

function getOrdinalSuffix(day: number): string {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

/**
 * Converts a Date to a datetime-local string (YYYY-MM-DDTHH:MM) preserving local timezone
 * This is used for HTML datetime-local input fields
 */
export function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Creates a Date object from a datetime-local string, preserving local timezone
 */
export function parseDateTimeLocal(dateTimeLocal: string): Date {
  // Split the datetime-local string into date and time components
  const [datePart, timePart] = dateTimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create Date object using local timezone
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Creates a Date object set to the start of the day (00:00:00) in local timezone
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

/**
 * Creates a Date object set to the end of the day (23:59:59.999) in local timezone
 */
export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/**
 * Parses a URL date parameter (YYYY-MM-DD format) to a Date object in local timezone
 */
export function parseURLDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Format UTC timestamp for display in user's local timezone
export function formatTimestampForDisplay(timestamp: Date | string, formatStr: string): string {
  const date = new Date(timestamp);
  // For now, just format using the user's system timezone
  // TODO: Add proper timezone handling when needed
  return format(date, formatStr);
}
