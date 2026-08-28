import 'server-only';

import { and, asc, eq, gte, isNull, lte, or, type SQL } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { dateOnlyInTimeZone } from '@/lib/dateOnly';
import { db } from '@/lib/db';
import { leadershipMember, storageObject } from '@/lib/db/schema';
import { requireAdmin } from '@/modules/admin/guards';
import type { ILeadershipMember } from '@/types';

export const LEADERSHIP_CACHE_TAG = 'content:leadership';

export const getPublishedLeadership = unstable_cache(
  async (): Promise<ILeadershipMember[]> => {
    const today = dateOnlyInTimeZone(new Date(), 'America/Chicago');
    const rows = await leadershipQuery(
      and(
        eq(leadershipMember.status, 'published'),
        or(isNull(leadershipMember.termStart), lte(leadershipMember.termStart, today)),
        or(isNull(leadershipMember.termEnd), gte(leadershipMember.termEnd, today)),
      ),
    );

    return rows;
  },
  ['published-leadership-v1'],
  {
    tags: [LEADERSHIP_CACHE_TAG],
    revalidate: 60 * 60,
  },
);

export async function getAdminLeadership() {
  await requireAdmin();
  return leadershipQuery();
}

function leadershipQuery(condition?: SQL) {
  const query = db
    .select({
      id: leadershipMember.id,
      name: leadershipMember.name,
      role: leadershipMember.role,
      kind: leadershipMember.kind,
      bio: leadershipMember.bio,
      email: leadershipMember.email,
      imageId: leadershipMember.imageId,
      imageUrl: storageObject.publicUrl,
      status: leadershipMember.status,
      sortOrder: leadershipMember.sortOrder,
      termStart: leadershipMember.termStart,
      termEnd: leadershipMember.termEnd,
      createdAt: leadershipMember.createdAt,
      updatedAt: leadershipMember.updatedAt,
    })
    .from(leadershipMember)
    .leftJoin(
      storageObject,
      and(
        eq(leadershipMember.imageId, storageObject.id),
        isNull(storageObject.deletedAt),
      ),
    );

  const ordered = condition ? query.where(condition) : query;
  return ordered.orderBy(
    asc(leadershipMember.kind),
    asc(leadershipMember.sortOrder),
    asc(leadershipMember.id),
  );
}
