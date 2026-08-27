import 'server-only';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { adminMembership } from '@/lib/db/schema';
import type { AdminRole } from '@/modules/admin/roles';

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export const getAdminContext = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const [membership] = await db
    .select({
      role: adminMembership.role,
      createdAt: adminMembership.createdAt,
    })
    .from(adminMembership)
    .where(eq(adminMembership.userId, session.user.id))
    .limit(1);

  if (!membership) return null;

  return {
    membership,
    session,
  };
});

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect('/auth/signin?redirectTo=/admin');
  return session;
}

export async function requireAdmin(roles?: readonly AdminRole[]) {
  const context = await getAdminContext();

  if (!context) {
    const session = await getSession();
    if (!session) redirect('/auth/signin?redirectTo=/admin');
    redirect('/?adminAccess=denied');
  }

  if (roles && !roles.includes(context.membership.role)) {
    redirect('/admin?access=denied');
  }

  return context;
}
