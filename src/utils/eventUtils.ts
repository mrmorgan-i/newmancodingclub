import {
    dateOnlyInTimeZone,
    formatDateOnly,
    parseDateOnly,
    serializeDateOnly,
} from "@/lib/dateOnly";
import type { IEvent, IRecurringEvent } from "@/types";

const CLUB_TIME_ZONE = "America/Chicago";
const FULL_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

interface TimeRange {
    startMinutes: number;
    endMinutes: number;
}

function addUtcDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

function getTimeZoneMinutes(date: Date, timeZone: string): number | null {
    const parts = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
    }).formatToParts(date);
    const values = new Map(parts.map((part) => [part.type, part.value]));
    const hour = Number(values.get("hour"));
    const minute = Number(values.get("minute"));

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
    return hour * 60 + minute;
}

function parseClockTime(
    hourValue: string,
    minuteValue: string,
    periodValue: string,
): number | null {
    const hour = Number(hourValue);
    const minute = Number(minuteValue);
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

    const normalizedHour = hour % 12 + (periodValue.toUpperCase() === "PM" ? 12 : 0);
    return normalizedHour * 60 + minute;
}

function parseTimeRange(value: string): TimeRange | null {
    const match = value.match(
        /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i,
    );
    if (!match) return null;

    const startMinutes = parseClockTime(match[1], match[2], match[3]);
    const endMinutes = parseClockTime(match[4], match[5], match[6]);
    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
        return null;
    }

    return { startMinutes, endMinutes };
}

function hasTodaysOccurrenceEnded(event: IRecurringEvent, now: Date): boolean {
    const range = parseTimeRange(event.time);
    const currentMinutes = getTimeZoneMinutes(now, event.timeZone);
    return range !== null && currentMinutes !== null && currentMinutes >= range.endMinutes;
}

function getEventTimeZone(event: IEvent): string {
    return event.timeZone ?? CLUB_TIME_ZONE;
}

export function getNextOccurrence(event: IEvent, now: Date = new Date()): Date | null {
    if (!event.isRecurring) return null;

    const startDate = parseDateOnly(event.startDate);
    const endDate = parseDateOnly(event.endDate);
    const today = parseDateOnly(dateOnlyInTimeZone(now, event.timeZone));
    if (!startDate || !endDate || !today || startDate > endDate) return null;

    const searchStart = today < startDate ? startDate : today;
    const dayOffset = (event.dayOfWeek - searchStart.getUTCDay() + 7) % 7;
    let nextOccurrence = addUtcDays(searchStart, dayOffset);

    if (
        nextOccurrence.getTime() === today.getTime() &&
        hasTodaysOccurrenceEnded(event, now)
    ) {
        nextOccurrence = addUtcDays(nextOccurrence, 7);
    }

    return nextOccurrence <= endDate ? nextOccurrence : null;
}

export function getDisplayDate(event: IEvent, now: Date = new Date()): string {
    if (event.isRecurring) {
        const nextOccurrence = getNextOccurrence(event, now);
        if (nextOccurrence) {
            const date = formatDateOnly(serializeDateOnly(nextOccurrence), FULL_DATE_FORMAT);
            return `Next: ${date}`;
        }

        if (hasEventPassed(event, now)) {
            return `Ended: ${formatDateOnly(event.endDate, FULL_DATE_FORMAT)}`;
        }

        return event.date;
    }

    return formatDateOnly(event.date, FULL_DATE_FORMAT);
}

export function isEventToday(event: IEvent, now: Date = new Date()): boolean {
    const today = dateOnlyInTimeZone(now, getEventTimeZone(event));

    if (event.isRecurring) {
        const nextOccurrence = getNextOccurrence(event, now);
        return nextOccurrence !== null && serializeDateOnly(nextOccurrence) === today;
    }

    return parseDateOnly(event.date) !== null && event.date === today;
}

export function isEventThisWeek(event: IEvent, now: Date = new Date()): boolean {
    const timeZone = getEventTimeZone(event);
    const today = parseDateOnly(dateOnlyInTimeZone(now, timeZone));
    if (!today) return false;

    const startOfWeek = addUtcDays(today, -today.getUTCDay());
    const endOfWeek = addUtcDays(startOfWeek, 6);
    const eventDate = event.isRecurring
        ? getNextOccurrence(event, now)
        : parseDateOnly(event.date);

    return eventDate !== null && eventDate >= startOfWeek && eventDate <= endOfWeek;
}

function getUpcomingDate(event: IEvent, now: Date): Date | null {
    if (event.isRecurring) return getNextOccurrence(event, now);

    const date = parseDateOnly(event.date);
    if (!date || hasEventPassed(event, now)) return null;
    return date;
}

export function sortEventsByDate(events: IEvent[], now: Date = new Date()): IEvent[] {
    return events
        .filter((event) => event.isActive !== false)
        .map((event, originalIndex) => {
            const upcomingDate = getUpcomingDate(event, now);
            const bucket = upcomingDate ? 0 : hasEventPassed(event, now) ? 2 : 1;
            return { event, originalIndex, upcomingDate, bucket };
        })
        .sort((a, b) => {
            if (a.bucket !== b.bucket) return a.bucket - b.bucket;
            if (a.upcomingDate && b.upcomingDate) {
                return a.upcomingDate.getTime() - b.upcomingDate.getTime();
            }
            return a.originalIndex - b.originalIndex;
        })
        .map(({ event }) => event);
}

export function getNextHighlightEvent(
    events: IEvent[],
    now: Date = new Date(),
): IEvent | null {
    return events
        .filter((event) => event.isActive !== false && !event.isRecurring)
        .map((event) => ({ event, date: getUpcomingDate(event, now) }))
        .filter((entry): entry is { event: IEvent; date: Date } => entry.date !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.event ?? null;
}

export function getUpcomingEvents(
    events: IEvent[],
    count: number = 5,
    now: Date = new Date(),
): IEvent[] {
    return sortEventsByDate(events, now).slice(0, count);
}

export function hasEventPassed(event: IEvent, now: Date = new Date()): boolean {
    const today = dateOnlyInTimeZone(now, getEventTimeZone(event));

    if (event.isRecurring) {
        if (today > event.endDate) return true;
        return today === event.endDate && hasTodaysOccurrenceEnded(event, now);
    }

    return parseDateOnly(event.date) !== null && event.date < today;
}

export function getEventStatus(
    event: IEvent,
    now: Date = new Date(),
): 'today' | 'upcoming' | 'past' | 'recurring' {
    if (hasEventPassed(event, now)) return 'past';
    if (isEventToday(event, now)) return 'today';
    return event.isRecurring ? 'recurring' : 'upcoming';
}

export function filterEventsByTag(events: IEvent[], tag: string): IEvent[] {
    return events.filter(
        (event) =>
            event.isActive !== false &&
            event.tags.some((eventTag) =>
                eventTag.toLowerCase().includes(tag.toLowerCase()),
            ),
    );
}
