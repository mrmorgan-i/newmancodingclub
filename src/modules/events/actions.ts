'use server';

import { eq } from 'drizzle-orm';
import { updateTag, revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  errorResult,
  successResult,
  type ActionResult,
} from '@/lib/actionResult';
import { db } from '@/lib/db';
import { contentEvent } from '@/lib/db/schema';
import { writeAuditLog } from '@/modules/admin/audit';
import { requireAdmin } from '@/modules/admin/guards';
import { EVENTS_CACHE_TAG } from '@/modules/events/queries';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

const eventInputSchema = z
  .object({
    id: z.number().int().positive().optional(),
    title: z.string().trim().min(1, 'Enter an event title.').max(160),
    description: z.string().trim().min(1, 'Enter a short description.').max(2000),
    kind: z.enum(['single', 'weekly']),
    status: z.enum(['draft', 'published']),
    date: z.string().trim(),
    startDate: z.string().trim(),
    endDate: z.string().trim(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(timePattern, 'Choose a start time.'),
    endTime: z.string().regex(timePattern, 'Choose an end time.'),
    timeZone: z.string().trim().min(1).max(100),
    location: z.string().trim().min(1, 'Enter a location.').max(255),
    registrationUrl: z.string().trim().max(2000),
    tags: z.array(z.string().min(1).max(40)).max(12),
    isFeatured: z.boolean(),
    sortOrder: z.number().int().min(0).max(9999),
  })
  .superRefine((event, context) => {
    if (event.endTime <= event.startTime) {
      context.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: 'End time must be after start time.',
      });
    }

    if (event.registrationUrl && !isValidHttpUrl(event.registrationUrl)) {
      context.addIssue({
        code: 'custom',
        path: ['registrationUrl'],
        message: 'Use a complete http:// or https:// URL.',
      });
    }

    if (event.kind === 'single') {
      if (event.date && !datePattern.test(event.date)) {
        context.addIssue({
          code: 'custom',
          path: ['date'],
          message: 'Choose a valid date or leave it blank for TBD.',
        });
      }
      return;
    }

    if (!datePattern.test(event.startDate)) {
      context.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Choose the first meeting date.',
      });
    }
    if (!datePattern.test(event.endDate)) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Choose the final meeting date.',
      });
    }
    if (event.startDate && event.endDate && event.endDate < event.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Final meeting must be on or after the first meeting.',
      });
    }
    if (
      datePattern.test(event.startDate) &&
      getUtcDayOfWeek(event.startDate) !== event.dayOfWeek
    ) {
      context.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'First meeting must fall on the selected meeting day.',
      });
    }
    if (
      datePattern.test(event.endDate) &&
      getUtcDayOfWeek(event.endDate) !== event.dayOfWeek
    ) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Final meeting must fall on the selected meeting day.',
      });
    }
  });

export async function saveEventAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session } = await requireAdmin();
  const parsed = eventInputSchema.safeParse(readEventInput(formData));

  if (!parsed.success) {
    return errorResult(
      'Check the highlighted event details.',
      getFieldErrors(parsed.error),
    );
  }

  const input = parsed.data;
  const values = {
    title: input.title,
    description: input.description,
    kind: input.kind,
    status: input.status,
    date: input.kind === 'single' && input.date ? input.date : null,
    startDate: input.kind === 'weekly' ? input.startDate : null,
    endDate: input.kind === 'weekly' ? input.endDate : null,
    dayOfWeek: input.kind === 'weekly' ? input.dayOfWeek : null,
    startTime: input.startTime,
    endTime: input.endTime,
    timeZone: input.timeZone,
    location: input.location,
    registrationUrl: input.registrationUrl || null,
    tags: input.tags,
    isFeatured: input.isFeatured,
    sortOrder: input.sortOrder,
    updatedByUserId: session.user.id,
    updatedAt: new Date(),
  } as const;

  if (input.id) {
    const [existing] = await db
      .select({ id: contentEvent.id, title: contentEvent.title })
      .from(contentEvent)
      .where(eq(contentEvent.id, input.id))
      .limit(1);

    if (!existing) return errorResult('That event no longer exists.');

    await db.update(contentEvent).set(values).where(eq(contentEvent.id, input.id));
    await writeAuditLog({
      actorUserId: session.user.id,
      action: 'event.update',
      entityType: 'content_event',
      entityId: input.id,
      summary: `Updated ${input.title}.`,
      metadata: { previousTitle: existing.title, status: input.status },
    });
  } else {
    const [created] = await db
      .insert(contentEvent)
      .values({
        ...values,
        createdByUserId: session.user.id,
      })
      .returning({ id: contentEvent.id });

    await writeAuditLog({
      actorUserId: session.user.id,
      action: 'event.create',
      entityType: 'content_event',
      entityId: created.id,
      summary: `Created ${input.title}.`,
      metadata: { status: input.status },
    });
  }

  invalidateEventViews();
  return successResult(input.id ? 'Event saved.' : 'Event created.');
}

export async function archiveEventAction(formData: FormData): Promise<void> {
  const { session } = await requireAdmin();
  const id = z.coerce.number().int().positive().safeParse(formData.get('id'));
  if (!id.success) return;

  const [existing] = await db
    .select({ id: contentEvent.id, title: contentEvent.title })
    .from(contentEvent)
    .where(eq(contentEvent.id, id.data))
    .limit(1);

  if (!existing) return;

  await db
    .update(contentEvent)
    .set({
      status: 'archived',
      updatedByUserId: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(contentEvent.id, id.data));

  await writeAuditLog({
    actorUserId: session.user.id,
    action: 'event.archive',
    entityType: 'content_event',
    entityId: id.data,
    summary: `Archived ${existing.title}.`,
  });

  invalidateEventViews();
}

function readEventInput(formData: FormData) {
  const idValue = String(formData.get('id') ?? '').trim();
  const tagValues = String(formData.get('tags') ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: idValue ? Number(idValue) : undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    kind: formData.get('kind'),
    status: formData.get('status'),
    date: formData.get('date') ?? '',
    startDate: formData.get('startDate') ?? '',
    endDate: formData.get('endDate') ?? '',
    dayOfWeek: Number(formData.get('dayOfWeek') ?? 0),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    timeZone: formData.get('timeZone') ?? 'America/Chicago',
    location: formData.get('location'),
    registrationUrl: formData.get('registrationUrl') ?? '',
    tags: tagValues,
    isFeatured: formData.get('isFeatured') === 'on',
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  };
}

function getFieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form');
    errors[field] ??= [];
    errors[field].push(issue.message);
  }

  return errors;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getUtcDayOfWeek(value: string): number {
  return new Date(`${value}T00:00:00Z`).getUTCDay();
}

function invalidateEventViews(): void {
  updateTag(EVENTS_CACHE_TAG);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/events');
}
