import type { Weekday } from '@/types';

export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function normalizeWeekdays(values: readonly number[]): Weekday[] {
  return [...new Set(values)]
    .filter((value): value is Weekday => Number.isInteger(value) && value >= 0 && value <= 6)
    .sort((left, right) => left - right);
}

export function formatWeekdayList(daysOfWeek: readonly Weekday[]): string {
  const names = normalizeWeekdays(daysOfWeek).map((day) => WEEKDAY_NAMES[day]);

  if (names.length === 0) return 'No meeting days';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

export function formatRecurrenceLabel(
  repeatInterval: number,
  daysOfWeek: readonly Weekday[],
): string {
  const weekdays = formatWeekdayList(daysOfWeek);

  if (repeatInterval === 1) return `Every ${weekdays}`;
  if (repeatInterval === 2) return `Every other week on ${weekdays}`;

  return `Every ${repeatInterval} weeks on ${weekdays}`;
}
