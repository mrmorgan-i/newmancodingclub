import 'server-only';

import { and, count, desc, eq, gt, isNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  adminInvitation,
  adminMembership,
  auditLog,
  contentEvent,
  user,
} from '@/lib/db/schema';
import { requireAdmin } from '@/modules/admin/guards';

export async function getAdminOverview() {
  const context = await requireAdmin();
  const now = new Date();

  const [eventCounts, memberCount, invitationCount, activity, activeSeries] =
    await Promise.all([
      db
        .select({ status: contentEvent.status, count: count() })
        .from(contentEvent)
        .groupBy(contentEvent.status),
      db.select({ count: count() }).from(adminMembership),
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
          id: auditLog.id,
          action: auditLog.action,
          summary: auditLog.summary,
          createdAt: auditLog.createdAt,
          actorName: user.name,
        })
        .from(auditLog)
        .leftJoin(user, eq(user.id, auditLog.actorUserId))
        .orderBy(desc(auditLog.createdAt))
        .limit(8),
      db
        .select({
          title: contentEvent.title,
          startDate: contentEvent.startDate,
          endDate: contentEvent.endDate,
          dayOfWeek: contentEvent.dayOfWeek,
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
    activity,
    counts: {
      archivedEvents:
        eventCounts.find((item) => item.status === 'archived')?.count ?? 0,
      draftEvents: eventCounts.find((item) => item.status === 'draft')?.count ?? 0,
      members: memberCount[0]?.count ?? 0,
      pendingInvitations: invitationCount[0]?.count ?? 0,
      publishedEvents:
        eventCounts.find((item) => item.status === 'published')?.count ?? 0,
    },
  };
}
