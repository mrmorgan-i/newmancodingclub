import type { Metadata } from 'next';
import { HiOutlineEnvelope, HiOutlineShieldCheck } from 'react-icons/hi2';

import InviteAdminForm from '@/components/admin/InviteAdminForm';
import { revokeInvitationAction } from '@/modules/admin/invitationActions';
import { requireAdmin } from '@/modules/admin/guards';
import { getAccessManagementData } from '@/modules/admin/invitations';
import { ADMIN_ROLE_LABELS, ADMIN_ROLES } from '@/modules/admin/roles';

export const metadata: Metadata = {
  title: 'Access',
};

export default async function AdminAccessPage() {
  await requireAdmin([ADMIN_ROLES.OWNER]);
  const { invitations, members } = await getAccessManagementData();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="border-b border-[#d6e1df] pb-7">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2f7f85]">
          Administration / Access
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#172327]">
          Invitation-only access
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#607477]">
          Public member accounts stay separate. Only people who accept an active
          invitation appear in the admin team.
        </p>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section id="invite" className="scroll-mt-24 border border-[#d5e0de] bg-white">
          <div className="border-b border-[#dce6e4] bg-[#edf5f4] px-5 py-4 sm:px-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#527174]">
              Secure invitation
            </p>
            <h2 className="mt-1 text-xl font-bold">Invite a teammate</h2>
          </div>
          <div className="p-5 sm:p-7">
            <InviteAdminForm />
          </div>
        </section>

        <section>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718689]">
            Active team
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Administrators</h2>
          <div className="mt-4 border border-[#d5e0de] bg-white">
            {members.map((member) => (
              <div
                key={member.userId}
                className="grid gap-3 border-b border-[#e0e8e6] p-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dff1ef] text-[#267477]">
                    <HiOutlineShieldCheck className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#25383b]">{member.name}</p>
                    <p className="truncate text-sm text-[#6a7d80]">{member.email}</p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-[#eef4f3] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#526c6f]">
                  {ADMIN_ROLE_LABELS[member.role]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718689]">
          Invitation history
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Recent invitations</h2>
        <div className="mt-4 overflow-x-auto border border-[#d5e0de] bg-white">
          {invitations.length ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#dce6e4] bg-[#f1f6f5] font-mono text-[10px] uppercase tracking-[0.14em] text-[#61777a]">
                <tr>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Access</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Expires</th>
                  <th className="px-5 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3eae9]">
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-5 py-4 font-semibold text-[#2c4043]">
                      {invitation.email}
                    </td>
                    <td className="px-5 py-4 text-[#64777a]">
                      {ADMIN_ROLE_LABELS[invitation.role]}
                    </td>
                    <td className="px-5 py-4">
                      <InvitationStatus status={invitation.status} />
                    </td>
                    <td className="px-5 py-4 text-[#64777a]">
                      {formatDate(invitation.expiresAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {(invitation.status === 'pending' || invitation.status === 'expired') && (
                        <form action={revokeInvitationAction}>
                          <input type="hidden" name="id" value={invitation.id} />
                          <button
                            type="submit"
                            className="font-bold text-[#8d5149] transition hover:text-[#6f332c]"
                          >
                            Revoke
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <HiOutlineEnvelope className="mx-auto size-8 text-[#3e9ba2]" />
              <p className="mt-3 font-bold">No invitations sent</p>
              <p className="mt-1 text-sm text-[#6a7d80]">Invite the first teammate above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InvitationStatus({ status }: { status: 'pending' | 'accepted' | 'revoked' | 'expired' }) {
  const classes = {
    pending: 'bg-[#fff0c7] text-[#855f13]',
    accepted: 'bg-[#dcf2ee] text-[#1f716f]',
    revoked: 'bg-[#f6e8e5] text-[#8d5149]',
    expired: 'bg-[#edf0ef] text-[#69787a]',
  }[status];

  return (
    <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${classes}`}>
      {status}
    </span>
  );
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'America/Chicago',
  }).format(value);
}
