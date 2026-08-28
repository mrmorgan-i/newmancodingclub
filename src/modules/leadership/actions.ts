'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';

import { errorResult, successResult, type ActionResult } from '@/lib/actionResult';
import { db } from '@/lib/db';
import { leadershipMember } from '@/lib/db/schema';
import { writeAuditLog } from '@/modules/admin/audit';
import { requireAdmin } from '@/modules/admin/guards';
import { LEADERSHIP_CACHE_TAG } from '@/modules/leadership/queries';
import {
  deleteUnusedStorageObject,
  getActiveStorageObject,
} from '@/modules/storage/objects';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const leadershipInputSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(1, 'Enter a name.').max(160),
    role: z.string().trim().min(1, 'Enter a role.').max(120),
    kind: z.enum(['officer', 'advisor']),
    bio: z.string().trim().min(1, 'Enter a short bio.').max(2000),
    email: z.union([z.literal(''), z.email('Enter a valid email address.')]),
    imageId: z.union([z.literal(''), z.uuid('Upload a valid headshot.')]),
    status: z.enum(['draft', 'published']),
    sortOrder: z.number().int().min(0).max(9999),
    termStart: z.string().trim(),
    termEnd: z.string().trim(),
  })
  .superRefine((member, context) => {
    for (const field of ['termStart', 'termEnd'] as const) {
      if (member[field] && !datePattern.test(member[field])) {
        context.addIssue({
          code: 'custom',
          path: [field],
          message: 'Choose a valid date or leave it blank.',
        });
      }
    }

    if (member.termStart && member.termEnd && member.termEnd < member.termStart) {
      context.addIssue({
        code: 'custom',
        path: ['termEnd'],
        message: 'Term end must be on or after term start.',
      });
    }
  });

export async function saveLeadershipMemberAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session } = await requireAdmin();
  const parsed = leadershipInputSchema.safeParse(readLeadershipInput(formData));

  if (!parsed.success) {
    return errorResult(
      'Check the highlighted leadership details.',
      getFieldErrors(parsed.error),
    );
  }

  const input = parsed.data;
  const image = input.imageId ? await getActiveStorageObject(input.imageId) : null;
  if (input.imageId && (!image || image.endpoint !== 'leadershipHeadshot')) {
    return errorResult('Upload the headshot again.', {
      imageId: ['The selected headshot is no longer available.'],
    });
  }

  const values = {
    name: input.name,
    role: input.role,
    kind: input.kind,
    bio: input.bio,
    email: input.email || null,
    imageId: image?.id ?? null,
    status: input.status,
    sortOrder: input.sortOrder,
    termStart: input.termStart || null,
    termEnd: input.termEnd || null,
    updatedByUserId: session.user.id,
    updatedAt: new Date(),
  } as const;

  let previousImageId: string | null = null;

  if (input.id) {
    const [existing] = await db
      .select({
        id: leadershipMember.id,
        name: leadershipMember.name,
        imageId: leadershipMember.imageId,
      })
      .from(leadershipMember)
      .where(eq(leadershipMember.id, input.id))
      .limit(1);

    if (!existing) return errorResult('That leadership record no longer exists.');
    previousImageId = existing.imageId;

    await db
      .update(leadershipMember)
      .set(values)
      .where(eq(leadershipMember.id, input.id));

    await writeAuditLog({
      actorUserId: session.user.id,
      action: 'leadership.update',
      entityType: 'leadership_member',
      entityId: input.id,
      summary: `Updated ${input.name}.`,
      metadata: { previousName: existing.name, status: input.status },
    });
  } else {
    const [created] = await db
      .insert(leadershipMember)
      .values({ ...values, createdByUserId: session.user.id })
      .returning({ id: leadershipMember.id });

    await writeAuditLog({
      actorUserId: session.user.id,
      action: 'leadership.create',
      entityType: 'leadership_member',
      entityId: created.id,
      summary: `Created ${input.name}.`,
      metadata: { status: input.status },
    });
  }

  if (previousImageId && previousImageId !== image?.id) {
    try {
      await deleteUnusedStorageObject(previousImageId);
    } catch (error) {
      console.error('Failed to remove a replaced leadership image:', error);
    }
  }

  invalidateLeadershipViews();
  return successResult(input.id ? 'Leadership record saved.' : 'Leadership record created.');
}

export async function archiveLeadershipMemberAction(formData: FormData): Promise<void> {
  const { session } = await requireAdmin();
  const id = z.coerce.number().int().positive().safeParse(formData.get('id'));
  if (!id.success) return;

  const [existing] = await db
    .select({ id: leadershipMember.id, name: leadershipMember.name })
    .from(leadershipMember)
    .where(eq(leadershipMember.id, id.data))
    .limit(1);

  if (!existing) return;

  await db
    .update(leadershipMember)
    .set({
      status: 'archived',
      updatedByUserId: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(leadershipMember.id, id.data));

  await writeAuditLog({
    actorUserId: session.user.id,
    action: 'leadership.archive',
    entityType: 'leadership_member',
    entityId: id.data,
    summary: `Archived ${existing.name}.`,
  });

  invalidateLeadershipViews();
}

function readLeadershipInput(formData: FormData) {
  const idValue = String(formData.get('id') ?? '').trim();
  return {
    id: idValue ? Number(idValue) : undefined,
    name: formData.get('name'),
    role: formData.get('role'),
    kind: formData.get('kind'),
    bio: formData.get('bio'),
    email: formData.get('email') ?? '',
    imageId: formData.get('imageId') ?? '',
    status: formData.get('status'),
    sortOrder: Number(formData.get('sortOrder') ?? 0),
    termStart: formData.get('termStart') ?? '',
    termEnd: formData.get('termEnd') ?? '',
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

function invalidateLeadershipViews(): void {
  updateTag(LEADERSHIP_CACHE_TAG);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/leadership');
}
