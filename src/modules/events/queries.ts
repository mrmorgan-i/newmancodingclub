import 'server-only';

import { asc, desc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';
import { contentEvent } from '@/lib/db/schema';
import { formatRecurrenceLabel, normalizeWeekdays } from '@/lib/recurrence';
import { requireAdmin } from '@/modules/admin/guards';
import type { IEvent, ISingleEvent } from '@/types';

export const EVENTS_CACHE_TAG = 'content:events';

export const getPublishedEvents = unstable_cache(
  async (): Promise<IEvent[]> => {
    const rows = await db
      .select()
      .from(contentEvent)
      .where(eq(contentEvent.status, 'published'))
      .orderBy(asc(contentEvent.sortOrder), asc(contentEvent.id));

    return rows.map(toPublicEvent);
  },
  ['published-events-v3'],
  {
    tags: [EVENTS_CACHE_TAG],
    revalidate: 60 * 60,
  },
);

export async function getAdminEvents() {
  await requireAdmin();

  return db
    .select()
    .from(contentEvent)
    .orderBy(asc(contentEvent.sortOrder), desc(contentEvent.updatedAt));
}

function toPublicEvent(row: typeof contentEvent.$inferSelect): IEvent {
  const base = {
    id: row.id,
    title: row.title,
    time: `${formatClockTime(row.startTime)} - ${formatClockTime(row.endTime)}`,
    location: row.location,
    description: row.description,
    tags: row.tags,
    registerLink: row.registrationUrl || '#',
    isFeatured: row.isFeatured,
    timeZone: row.timeZone,
    isActive: true,
  };

  if (row.kind === 'weekly' && row.startDate && row.endDate) {
    const daysOfWeek = normalizeWeekdays(row.daysOfWeek);
    return {
      ...base,
      date: formatRecurrenceLabel(row.repeatInterval, daysOfWeek),
      isRecurring: true,
      recurrencePattern: 'weekly',
      repeatInterval: row.repeatInterval,
      daysOfWeek,
      startDate: row.startDate,
      endDate: row.endDate,
      timeZone: row.timeZone,
    };
  }

  const event: ISingleEvent = {
    ...base,
    date: row.date ?? 'TBD',
    isRecurring: false,
  };

  return event;
}

function formatClockTime(value: string): string {
  const [hoursValue, minutesValue] = value.split(':');
  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}
