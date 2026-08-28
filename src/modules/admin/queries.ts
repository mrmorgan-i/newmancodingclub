import 'server-only';

import { and, count, desc, eq, gt, isNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  adminInvitation,
  adminMembership,
  clubMember,
  contentEvent,
} from '@/lib/db/schema';
import { requireAdmin } from '@/modules/admin/guards';

export async function getAdminOverview() {
  const context = await requireAdmin();
  const now = new Date();

  const [
    eventCounts,
    adminMemberCount,
    clubMemberCount,
    invitationCount,
    activeSeries,
  ] = await Promise.all([
      db
        .select({ status: contentEvent.status, count: count() })
        .from(contentEvent)
        .groupBy(contentEvent.status),
      db.select({ count: count() }).from(adminMembership),
      db.select({ count: count() }).from(clubMember),
      context.membership.role === 'owner'
        ? db
            .select({ count: count() })
            .from(adminInvitation)
            .where(
              and(
                isNull(adminInvitation.acceptedAt),
                isNull(adminInvitation.revokedAt),
                gt(adminInvitation.expiresAt, now),
              ),
            )
        : Promise.resolve([{ count: 0 }]),
      db
        .select({
          title: contentEvent.title,
          startDate: contentEvent.startDate,
          endDate: contentEvent.endDate,
          repeatInterval: contentEvent.repeatInterval,
          daysOfWeek: contentEvent.daysOfWeek,
          startTime: contentEvent.startTime,
          endTime: contentEvent.endTime,
          location: contentEvent.location,
        })
        .from(contentEvent)
        .where(
          and(
            eq(contentEvent.kind, 'weekly'),
            eq(contentEvent.status, 'published'),
          ),
        )
        .orderBy(desc(contentEvent.startDate))
        .limit(1),
    ]);

  return {
    activeSeries: activeSeries[0] ?? null,
    counts: {
      archivedEvents:
        eventCounts.find((item) => item.status === 'archived')?.count ?? 0,
      draftEvents: eventCounts.find((item) => item.status === 'draft')?.count ?? 0,
      adminMembers: adminMemberCount[0]?.count ?? 0,
      clubMembers: clubMemberCount[0]?.count ?? 0,
      pendingInvitations: invitationCount[0]?.count ?? 0,
      publishedEvents:
        eventCounts.find((item) => item.status === 'published')?.count ?? 0,
    },
  };
}

export async function getClubMembers() {
  await requireAdmin();

  return db
    .select({
      id: clubMember.id,
      name: clubMember.name,
      email: clubMember.email,
      phone: clubMember.phone,
      major: clubMember.major,
      welcomeEmailSentAt: clubMember.welcomeEmailSentAt,
      lastEmailAttemptAt: clubMember.lastEmailAttemptAt,
      lastEmailError: clubMember.lastEmailError,
      joinedAt: clubMember.joinedAt,
      lastJoinedAt: clubMember.lastJoinedAt,
    })
    .from(clubMember)
    .orderBy(desc(clubMember.lastJoinedAt))
    .limit(250);
}
