import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineCodeBracket, HiOutlineEnvelope } from 'react-icons/hi2';

import AcceptAdminInviteForm from '@/components/admin/AcceptAdminInviteForm';
import { getSession } from '@/modules/admin/guards';
import { getInvitationPreview } from '@/modules/admin/invitations';
import { ADMIN_ROLE_LABELS } from '@/modules/admin/roles';

export const metadata: Metadata = {
  title: 'Admin invitation',
  robots: { index: false, follow: false },
};

export default async function AcceptAdminInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token ?? '';
  const [invitation, session] = await Promise.all([
    getInvitationPreview(token),
    getSession(),
  ]);

  const returnPath = `/accept-admin-invite?token=${encodeURIComponent(token)}`;

  return (
    <div className="min-h-screen bg-[#edf3f2] px-4 py-16 text-[#172327]">
      <div className="mx-auto max-w-lg overflow-hidden border border-[#d5e0de] bg-white shadow-[0_24px_80px_rgba(23,35,39,0.13)]">
        <div className="bg-[#172327] px-6 py-7 text-white sm:px-8">
          <span className="grid size-11 place-items-center rounded-[14px] bg-[#3e9ba2]">
            <HiOutlineCodeBracket className="size-6" />
          </span>
          <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#83c9cb]">
            Newman Coding Club / Club desk
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin invitation</h1>
        </div>

        <div className="p-6 sm:p-8">
          {!invitation ? (
            <InvitationUnavailable message="This invitation link is invalid." />
          ) : invitation.status !== 'pending' ? (
            <InvitationUnavailable
              message={
                invitation.status === 'accepted'
                  ? 'This invitation has already been accepted.'
                  : invitation.status === 'revoked'
                    ? 'This invitation was revoked.'
                    : 'This invitation has expired. Ask an owner to send a new one.'
              }
            />
          ) : (
            <>
              <p className="text-base leading-7 text-[#5f7376]">
                You were invited as <strong className="text-[#25383b]">{ADMIN_ROLE_LABELS[invitation.role]}</strong>.
                Admin access is attached only after you sign in with the invited address.
              </p>
              <div className="mt-5 border border-[#d8e3e1] bg-[#f2f7f6] p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#688083]">
                  Invited email
                </p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-[#25383b]">
                  <HiOutlineEnvelope className="size-4 text-[#3e9ba2]" />
                  {invitation.email}
                </p>
              </div>

              {!session ? (
                <div className="mt-6">
                  <Link
                    href={`/auth/signin?redirectTo=${encodeURIComponent(returnPath)}`}
                    className="block w-full rounded-full bg-[#3e9ba2] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#327f85]"
                  >
                    Sign in or create an account
                  </Link>
                  <p className="mt-3 text-center text-xs leading-5 text-[#77888b]">
                    Use {invitation.email}; another account cannot accept this invitation.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-5 text-sm text-[#63777a]">
                    Signed in as <strong>{session.user.email}</strong>
                  </p>
                  <AcceptAdminInviteForm token={token} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InvitationUnavailable({ message }: { message: string }) {
  return (
    <div>
      <p className="text-base leading-7 text-[#5f7376]">{message}</p>
      <Link
        href="/"
        className="mt-6 block w-full rounded-full border border-[#c8d7d5] px-5 py-3 text-center text-sm font-bold text-[#31474a] transition hover:border-[#3e9ba2]"
      >
        Return to the club site
      </Link>
    </div>
  );
}
