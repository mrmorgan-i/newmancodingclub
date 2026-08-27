import 'server-only';

import {
  and,
  desc,
  eq,
  gt,
  ilike,
  isNull,
  sql,
} from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  adminInvitation,
  adminMembership,
  user,
} from '@/lib/db/schema';
import type { AdminRole } from '@/modules/admin/roles';
import {
  getInvitationStatus,
  hashInvitationToken,
  isValidInvitationToken,
  normalizeEmail,
} from '@/modules/admin/invitationUtils';

export async function getAccessManagementData() {
  const [members, invitations] = await Promise.all([
    db
      .select({
        userId: adminMembership.userId,
        name: user.name,
        email: user.email,
        role: adminMembership.role,
        createdAt: adminMembership.createdAt,
      })
      .from(adminMembership)
      .innerJoin(user, eq(user.id, adminMembership.userId))
      .orderBy(desc(adminMembership.createdAt)),
    db
      .select({
        id: adminInvitation.id,
        email: adminInvitation.email,
        role: adminInvitation.role,
        acceptedAt: adminInvitation.acceptedAt,
        revokedAt: adminInvitation.revokedAt,
        expiresAt: adminInvitation.expiresAt,
        lastSentAt: adminInvitation.lastSentAt,
      })
      .from(adminInvitation)
      .orderBy(desc(adminInvitation.createdAt))
      .limit(50),
  ]);

  return {
    members,
    invitations: invitations.map((invitation) => ({
      ...invitation,
      status: getInvitationStatus(invitation),
    })),
  };
}

export async function getInvitationPreview(token: string) {
  if (!isValidInvitationToken(token)) return null;

  const [invitation] = await db
    .select({
      id: adminInvitation.id,
      email: adminInvitation.email,
      role: adminInvitation.role,
      acceptedAt: adminInvitation.acceptedAt,
      revokedAt: adminInvitation.revokedAt,
      expiresAt: adminInvitation.expiresAt,
    })
    .from(adminInvitation)
    .where(eq(adminInvitation.tokenHash, hashInvitationToken(token)))
    .limit(1);

  if (!invitation) return null;

  return {
    email: invitation.email,
    role: invitation.role,
    status: getInvitationStatus(invitation),
    expiresAt: invitation.expiresAt,
  };
}

export async function findActiveInvitation(token: string) {
  if (!isValidInvitationToken(token)) return null;

  const [invitation] = await db
    .select()
    .from(adminInvitation)
    .where(
      and(
        eq(adminInvitation.tokenHash, hashInvitationToken(token)),
        isNull(adminInvitation.acceptedAt),
        isNull(adminInvitation.revokedAt),
        gt(adminInvitation.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return invitation ?? null;
}

export async function findAdminMemberByEmail(email: string) {
  const [membership] = await db
    .select({ userId: adminMembership.userId, role: adminMembership.role })
    .from(adminMembership)
    .innerJoin(user, eq(user.id, adminMembership.userId))
    .where(ilike(user.email, normalizeEmail(email)))
    .limit(1);

  return membership ?? null;
}

export async function revokePendingInvitationsForEmail(
  email: string,
  now: Date,
): Promise<void> {
  await db
    .update(adminInvitation)
    .set({ revokedAt: now, updatedAt: now })
    .where(
      and(
        eq(adminInvitation.email, normalizeEmail(email)),
        isNull(adminInvitation.acceptedAt),
        isNull(adminInvitation.revokedAt),
      ),
    );
}

export async function acceptInvitationAtomically({
  invitationId,
  invitedByUserId,
  role,
  userId,
}: {
  invitationId: string;
  invitedByUserId: string | null;
  role: AdminRole;
  userId: string;
}): Promise<boolean> {
  const now = new Date();
  const result = await db.execute<{ userId: string }>(sql`
    WITH accepted_invitation AS (
      UPDATE ${adminInvitation}
      SET
        ${sql.identifier(adminInvitation.acceptedByUserId.name)} = ${userId},
        ${sql.identifier(adminInvitation.acceptedAt.name)} = ${now},
        ${sql.identifier(adminInvitation.updatedAt.name)} = ${now}
      WHERE
        ${adminInvitation.id} = ${invitationId}
        AND ${adminInvitation.acceptedAt} IS NULL
        AND ${adminInvitation.revokedAt} IS NULL
        AND ${adminInvitation.expiresAt} > ${now}
      RETURNING ${adminInvitation.id}
    )
    INSERT INTO ${adminMembership} (
      ${sql.identifier(adminMembership.userId.name)},
      ${sql.identifier(adminMembership.role.name)},
      ${sql.identifier(adminMembership.invitedByUserId.name)},
      ${sql.identifier(adminMembership.createdAt.name)},
      ${sql.identifier(adminMembership.updatedAt.name)}
    )
    SELECT ${userId}, CAST(${role} AS "admin_role"), ${invitedByUserId}, ${now}, ${now}
    FROM accepted_invitation
    ON CONFLICT (${sql.identifier(adminMembership.userId.name)}) DO UPDATE SET
      ${sql.identifier(adminMembership.role.name)} = EXCLUDED.${sql.identifier(adminMembership.role.name)},
      ${sql.identifier(adminMembership.invitedByUserId.name)} = EXCLUDED.${sql.identifier(adminMembership.invitedByUserId.name)},
      ${sql.identifier(adminMembership.updatedAt.name)} = EXCLUDED.${sql.identifier(adminMembership.updatedAt.name)}
    RETURNING ${adminMembership.userId}
  `);

  return result.rows.length === 1;
}
