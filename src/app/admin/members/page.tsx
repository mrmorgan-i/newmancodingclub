import type { Metadata } from 'next';
import Link from 'next/link';
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

import { getClubMembers } from '@/modules/admin/queries';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function AdminMembersPage() {
  const members = await getClubMembers();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col gap-5 border-b border-[#d6e1df] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2f7f85]">
            Club operations / Members
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#172327]">
            Member directory
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#607477]">
            A member appears here as soon as they join. Welcome email status stays
            visible even when delivery is delayed.
          </p>
        </div>
        <div className="w-fit border-l-2 border-[#3e9ba2] pl-4">
          <p className="font-mono text-3xl font-bold text-[#172327]">{members.length}</p>
          <p className="text-sm text-[#65797c]">most recent signups</p>
        </div>
      </header>

      {members.length ? (
        <div className="overflow-x-auto border border-[#d5e0de] bg-white">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="border-b border-[#dce6e4] bg-[#edf5f4] font-mono text-[10px] uppercase tracking-[0.14em] text-[#61777a]">
              <tr>
                <th className="px-5 py-3 font-bold">Member</th>
                <th className="px-5 py-3 font-bold">Phone</th>
                <th className="px-5 py-3 font-bold">Major</th>
                <th className="px-5 py-3 font-bold">Email status</th>
                <th className="px-5 py-3 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3eae9]">
              {members.map((member) => (
                <tr key={member.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#25383b]">{member.name}</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#2f7f85] hover:text-[#172327]"
                    >
                      <HiOutlineEnvelope className="size-3.5" />
                      {member.email}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`tel:+1${member.phone}`}
                      className="inline-flex items-center gap-1.5 text-[#526a6d] hover:text-[#2f7f85]"
                    >
                      <HiOutlinePhone className="size-4" />
                      {formatPhone(member.phone)}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[#526a6d]">{member.major}</td>
                  <td className="px-5 py-4">
                    <EmailStatus
                      sentAt={member.welcomeEmailSentAt}
                      error={member.lastEmailError}
                    />
                  </td>
                  <td className="px-5 py-4 text-[#65777a]">
                    {formatDateTime(member.joinedAt)}
                    {member.lastJoinedAt.getTime() !== member.joinedAt.getTime() && (
                      <p className="mt-1 text-xs text-[#819093]">
                        Updated {formatDateTime(member.lastJoinedAt)}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-[#bdcecb] bg-white px-6 py-14 text-center">
          <HiOutlineUserGroup className="mx-auto size-9 text-[#3e9ba2]" />
          <h2 className="mt-3 text-lg font-bold">No member signups yet</h2>
          <p className="mt-1 text-sm text-[#6a7d80]">
            Share the public join form to start building the directory.
          </p>
          <Link
            href="/#join"
            target="_blank"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c8d8d5] px-4 py-2 text-sm font-bold text-[#31474a] transition hover:border-[#3e9ba2] hover:text-[#2f7f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2]"
          >
            Open join form
            <HiOutlineArrowTopRightOnSquare className="size-4" />
          </Link>
        </div>
      )}

      {members.length === 250 && (
        <p className="text-xs text-[#718184]">
          Showing the 250 most recent members.
        </p>
      )}
    </div>
  );
}

function EmailStatus({
  error,
  sentAt,
}: {
  error: string | null;
  sentAt: Date | null;
}) {
  if (sentAt) {
    return (
      <div>
        <span className="rounded-full bg-[#dcf2ee] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#1f716f]">
          Welcome sent
        </span>
        {error && (
          <p className="mt-2 text-xs text-[#8d5c1e]">A later notification was delayed.</p>
        )}
      </div>
    );
  }

  return (
    <span className="rounded-full bg-[#fff0c7] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#855f13]">
      {error ? 'Delivery delayed' : 'Not attempted'}
    </span>
  );
}

function formatPhone(phone: string): string {
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  }).format(value);
}
