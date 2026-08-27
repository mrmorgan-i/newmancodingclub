import type { Metadata } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/modules/admin/guards';

export const metadata: Metadata = {
  title: {
    default: 'Club desk',
    template: '%s · Club desk',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { membership, session } = await requireAdmin();

  return (
    <AdminShell
      user={{
        email: session.user.email,
        name: session.user.name,
        role: membership.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
