'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  errorResult,
  successResult,
  type ActionResult,
} from '@/lib/actionResult';
import { db } from '@/lib/db';
import { adminInvitation } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email/resend';
import { getAdminInvitationEmailTemplate } from '@/lib/email/templates';
import { writeAuditLog } from '@/modules/admin/audit';
import { requireAdmin, requireAuth } from '@/modules/admin/guards';
import {
  acceptInvitationAtomically,
  findActiveInvitation,
  findAdminMemberByEmail,
  revokePendingInvitationsForEmail,
} from '@/modules/admin/invitations';
import {
  createInvitationToken,
  getInvitationExpiry,
  hashInvitationToken,
  normalizeEmail,
} from '@/modules/admin/invitationUtils';
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLES,
} from '@/modules/admin/roles';

const inviteInputSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(255),
  role: z.enum([ADMIN_ROLES.OWNER, ADMIN_ROLES.EDITOR]),
});

export async function createInvitationAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session } = await requireAdmin([ADMIN_ROLES.OWNER]);
  const parsed = inviteInputSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return errorResult('Check the invitation details.', {
      email: parsed.error.issues
        .filter((issue) => issue.path[0] === 'email')
        .map((issue) => issue.message),
    });
  }

  const email = normalizeEmail(parsed.data.email);
  const existingMember = await findAdminMemberByEmail(email);
  if (existingMember) {
    return errorResult(`${email} already has admin access.`);
  }

  const now = new Date();
  const token = createInvitationToken();
  const expiresAt = getInvitationExpiry(now);

  await revokePendingInvitationsForEmail(email, now);

  const [invitation] = await db
    .insert(adminInvitation)
    .values({
      email,
      role: parsed.data.role,
      tokenHash: hashInvitationToken(token),
      invitedByUserId: session.user.id,
      expiresAt,
      lastSentAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: adminInvitation.id });

  const inviteUrl = createInviteUrl(token);
  const template = getAdminInvitationEmailTemplate({
    inviteUrl,
    inviterName: session.user.name,
    roleLabel: ADMIN_ROLE_LABELS[parsed.data.role],
  });

  try {
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    await db
      .update(adminInvitation)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(adminInvitation.id, invitation.id));
    console.error('[createInvitationAction]', error);
    return errorResult('The invitation could not be emailed. Try again.');
  }

  await writeAuditLog({
    actorUserId: session.user.id,
    action: 'admin.invitation.create',
    entityType: 'admin_invitation',
    entityId: invitation.id,
    summary: `Invited ${email} as ${ADMIN_ROLE_LABELS[parsed.data.role]}.`,
    metadata: { email, role: parsed.data.role },
  });

  revalidatePath('/admin/access');
  return successResult(`Invitation sent to ${email}.`);
}

export async function revokeInvitationAction(formData: FormData): Promise<void> {
  const { session } = await requireAdmin([ADMIN_ROLES.OWNER]);
  const id = z.string().uuid().safeParse(formData.get('id'));
  if (!id.success) return;

  const [revoked] = await db
    .update(adminInvitation)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(adminInvitation.id, id.data),
        isNull(adminInvitation.acceptedAt),
        isNull(adminInvitation.revokedAt),
      ),
    )
    .returning({ email: adminInvitation.email });

  if (!revoked) return;

  await writeAuditLog({
    actorUserId: session.user.id,
    action: 'admin.invitation.revoke',
    entityType: 'admin_invitation',
    entityId: id.data,
    summary: `Revoked the invitation for ${revoked.email}.`,
  });
  revalidatePath('/admin/access');
}

export async function acceptInvitationAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAuth();
  const token = String(formData.get('token') ?? '');
  const invitation = await findActiveInvitation(token);

  if (!invitation) {
    return errorResult('This invitation is invalid, expired, or no longer active.');
  }

  if (normalizeEmail(session.user.email) !== invitation.email) {
    return errorResult(`Sign in with ${invitation.email} to accept this invitation.`);
  }

  const accepted = await acceptInvitationAtomically({
    invitationId: invitation.id,
    invitedByUserId: invitation.invitedByUserId,
    role: invitation.role,
    userId: session.user.id,
  });

  if (!accepted) {
    return errorResult('This invitation was already used or is no longer active.');
  }

  await writeAuditLog({
    actorUserId: session.user.id,
    action: 'admin.invitation.accept',
    entityType: 'admin_invitation',
    entityId: invitation.id,
    summary: `${session.user.email} accepted admin access as ${ADMIN_ROLE_LABELS[invitation.role]}.`,
    metadata: { email: invitation.email, role: invitation.role },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/access');
  return successResult('Invitation accepted. You can open the club desk now.');
}

function createInviteUrl(token: string): string {
  const baseUrl =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    'http://localhost:3000';
  const url = new URL('/accept-admin-invite', baseUrl);
  url.searchParams.set('token', token);
  return url.toString();
}
