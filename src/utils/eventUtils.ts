import { IEvent } from "@/types";

/**
 * Utility functions for handling both recurring and single events
 */

function parseLocalDate(dateString: string): Date {
    // For ISO date strings like "2025-09-02", treat as local date
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
}

/**
 * Get the next occurrence date for a recurring event
 */
export function getNextOccurrence(event: IEvent): Date | null {
    if (!event.isRecurring || !event.dayOfWeek || !event.startDate) {
        return null;
    }

    const today = new Date();
    const startDate = parseLocalDate(event.startDate);
    
    // If start date is in the future, return start date
    if (startDate > today) {
        return startDate;
    }

    // Find next occurrence
    const daysUntilNext = (event.dayOfWeek - today.getDay() + 7) % 7;
    const nextOccurrence = new Date(today);
    
    if (daysUntilNext === 0) {
        const [time, period] = event.time.split(' - ')[0].split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const eventHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
        
        const eventTime = new Date(today);
        eventTime.setHours(eventHours, minutes, 0, 0);
        
        if (eventTime > today) {
            return today;
        } else {
            nextOccurrence.setDate(today.getDate() + 7);
        }
    } else {
        nextOccurrence.setDate(today.getDate() + daysUntilNext);
    }

    return nextOccurrence;
}

/**
 * Get formatted date string for display
 */
export function getDisplayDate(event: IEvent): string {
    if (event.isRecurring) {
        const nextOccurrence = getNextOccurrence(event);
        if (nextOccurrence) {
            const options: Intl.DateTimeFormatOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return `Next: ${nextOccurrence.toLocaleDateString('en-US', options)}`;
        }
        return event.date;
    } else {
        try {
            const date = parseLocalDate(event.date);
            const options: Intl.DateTimeFormatOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        } catch {
            return event.date;
        }
    }
}

/**
 * Check if an event is happening today
 */
export function isEventToday(event: IEvent): boolean {
    const today = new Date();
    
    if (event.isRecurring) {
        return today.getDay() === event.dayOfWeek;
    } else {
        try {
            const eventDate = parseLocalDate(event.date);
            return eventDate.toDateString() === today.toDateString();
        } catch {
            return false;
        }
    }
}

/**
 * Check if an event is happening this week
 */
export function isEventThisWeek(event: IEvent): boolean {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (event.isRecurring) {
        return true;
    } else {
        try {
            const eventDate = parseLocalDate(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        } catch {
            return false;
        }
    }
}

/**
 * Sort events by next occurrence date, prioritizing single events over recurring ones
 */
export function sortEventsByDate(events: IEvent[]): IEvent[] {
    const activeEvents = events.filter(event => event.isActive !== false);
    
    // Separate single and recurring events
    const singleEvents = activeEvents.filter(event => !event.isRecurring);
    const recurringEvents = activeEvents.filter(event => event.isRecurring);
    
    // Sort single events by date
    const sortedSingleEvents = singleEvents.sort((a, b) => {
        const dateA = parseLocalDate(a.date);
        const dateB = parseLocalDate(b.date);
        return dateA.getTime() - dateB.getTime();
    });
    
    // Sort recurring events by next occurrence
    const sortedRecurringEvents = recurringEvents.sort((a, b) => {
        const dateA = getNextOccurrence(a);
        const dateB = getNextOccurrence(b);
        
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return dateA.getTime() - dateB.getTime();
    });
    
    // Return single events first, then recurring events
    return [...sortedSingleEvents, ...sortedRecurringEvents];
}

/**
 * Get the next single event that should be highlighted
 */
export function getNextHighlightEvent(events: IEvent[]): IEvent | null {
    const activeEvents = events.filter(event => event.isActive !== false);
    const singleEvents = activeEvents.filter(event => !event.isRecurring);
    
    if (singleEvents.length === 0) return null;
    
    // Sort by date and return the first upcoming single event
    const sortedSingleEvents = singleEvents.sort((a, b) => {
        const dateA = parseLocalDate(a.date);
        const dateB = parseLocalDate(b.date);
        return dateA.getTime() - dateB.getTime();
    });
    
    // Return the first event that hasn't passed yet
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sortedSingleEvents.find(event => {
        const eventDate = parseLocalDate(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
    }) || null;
}

/**
 * Get upcoming events (next N events)
 */
export function getUpcomingEvents(events: IEvent[], count: number = 5): IEvent[] {
    return sortEventsByDate(events).slice(0, count);
}

/**
 * Check if a single event has passed
 */
export function hasEventPassed(event: IEvent): boolean {
    if (event.isRecurring) return false; // Recurring events never "pass"
    
    try {
        const eventDate = parseLocalDate(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        return eventDate < today;
    } catch {
        return false;
    }
}

/**
 * Get event status for display
 */
export function getEventStatus(event: IEvent): 'today' | 'upcoming' | 'past' | 'recurring' {
    if (event.isRecurring) {
        return isEventToday(event) ? 'today' : 'recurring';
    }
    
    if (hasEventPassed(event)) return 'past';
    if (isEventToday(event)) return 'today';
    return 'upcoming';
}

/**
 * Filter events by tag
 */
export function filterEventsByTag(events: IEvent[], tag: string): IEvent[] {
    return events.filter(event => 
        event.isActive !== false && 
        event.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
}
