import type { Metadata } from 'next';
import { HiOutlineEnvelope, HiOutlineShieldCheck } from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import InviteAdminForm from '@/components/admin/InviteAdminForm';
import { revokeInvitationAction } from '@/modules/admin/invitationActions';
import { requireAdmin } from '@/modules/admin/guards';
import { getAccessManagementData } from '@/modules/admin/invitations';
import { ADMIN_ROLE_LABELS, ADMIN_ROLES } from '@/modules/admin/roles';

export const metadata: Metadata = {
  title: 'Admin access',
};

export default async function AdminAccessPage() {
  await requireAdmin([ADMIN_ROLES.OWNER]);
  const { invitations, members } = await getAccessManagementData();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="Admin access"
        description="Invite officers who should be able to update the website."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section
          id="invite"
          className="scroll-mt-24 rounded-lg border border-[#d8e2e0] bg-white"
        >
          <div className="border-b border-[#e2e9e8] px-5 py-4">
            <h2 className="text-lg font-bold text-[#253639]">Invite an administrator</h2>
          </div>
          <div className="p-5 sm:p-6">
            <InviteAdminForm />
          </div>
        </section>

        <section className="rounded-lg border border-[#d8e2e0] bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-[#e2e9e8] px-5 py-4">
            <h2 className="text-lg font-bold text-[#253639]">Current administrators</h2>
            <span className="text-sm text-[#6b7c7f]">{members.length}</span>
          </div>
          <div className="divide-y divide-[#e6eceb]">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-3 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#e4f2f1] text-[#267477]">
                  <HiOutlineShieldCheck className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#25383b]">{member.name}</p>
                  <p className="truncate text-sm text-[#6a7d80]">{member.email}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#eef4f3] px-2.5 py-1 text-xs font-semibold text-[#526c6f]">
                  {ADMIN_ROLE_LABELS[member.role]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#253639]">Invitations</h2>
          <span className="text-sm text-[#6b7c7f]">{invitations.length} recent</span>
        </div>

        {invitations.length ? (
          <>
            <div className="grid gap-3 lg:hidden sm:grid-cols-2">
              {invitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-lg border border-[#d8e2e0] bg-white lg:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#dce6e4] bg-[#f0f5f4] text-xs text-[#5e7275]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Expires</th>
                    <th className="px-5 py-3 text-right font-semibold">Action</th>
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
                        <RevokeInvitationButton
                          id={invitation.id}
                          status={invitation.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-[#bdcecb] bg-white px-6 py-12 text-center">
            <HiOutlineEnvelope className="mx-auto size-8 text-[#3e9ba2]" />
            <p className="mt-3 font-bold">No invitations yet</p>
            <p className="mt-1 text-sm text-[#6a7d80]">
              Invitations you send will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function InvitationCard({
  invitation,
}: {
  invitation: Awaited<ReturnType<typeof getAccessManagementData>>['invitations'][number];
}) {
  return (
    <article className="rounded-lg border border-[#d8e2e0] bg-white p-5">
      <p className="break-all font-semibold text-[#2c4043]">{invitation.email}</p>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs text-[#7a8a8d]">Role</dt>
          <dd className="mt-1 font-semibold text-[#405356]">
            {ADMIN_ROLE_LABELS[invitation.role]}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#7a8a8d]">Expires</dt>
          <dd className="mt-1 font-semibold text-[#405356]">
            {formatDate(invitation.expiresAt)}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#e5eceb] pt-4">
        <InvitationStatus status={invitation.status} />
        <RevokeInvitationButton id={invitation.id} status={invitation.status} />
      </div>
    </article>
  );
}

function RevokeInvitationButton({
  id,
  status,
}: {
  id: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
}) {
  if (status !== 'pending' && status !== 'expired') return null;

  return (
    <form action={revokeInvitationAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-sm font-semibold text-[#8d5149] hover:bg-[#fbefed] hover:text-[#6f332c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a84338]"
      >
        Revoke
      </button>
    </form>
  );
}

function InvitationStatus({
  status,
}: {
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
}) {
  const classes = {
    pending: 'bg-[#fff0c7] text-[#855f13]',
    accepted: 'bg-[#dcf2ee] text-[#1f716f]',
    revoked: 'bg-[#f6e8e5] text-[#8d5149]',
    expired: 'bg-[#edf0ef] text-[#69787a]',
  }[status];

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status[0]?.toUpperCase()}{status.slice(1)}
    </span>
  );
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'America/Chicago',
  }).format(value);
}
