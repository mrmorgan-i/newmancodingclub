import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  HiOutlineArchiveBox,
  HiOutlineChevronDown,
  HiOutlineIdentification,
  HiOutlinePlus,
  HiOutlineUser,
} from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import LeadershipForm, {
  type EditableLeadershipMember,
} from '@/components/admin/LeadershipForm';
import { formatDateOnly } from '@/lib/dateOnly';
import { archiveLeadershipMemberAction } from '@/modules/leadership/actions';
import { getAdminLeadership } from '@/modules/leadership/queries';

export const metadata: Metadata = {
  title: 'Leadership',
};

export default async function AdminLeadershipPage() {
  const members = await getAdminLeadership();
  const publishedCount = members.filter((member) => member.status === 'published').length;
  const draftCount = members.filter((member) => member.status === 'draft').length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="Leadership"
        description="Manage the officers, faculty advisors, and spiritual companion shown on the club website."
        actions={
          <Link
            href="/admin/leadership/new"
            className="inline-flex items-center gap-2 rounded-md bg-[#2f858b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#286f74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
          >
            <HiOutlinePlus className="size-4" />
            Add person
          </Link>
        }
      />

      <section aria-labelledby="leadership-list-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="leadership-list-heading" className="text-xl font-bold text-[#253639]">
            Leadership records
          </h2>
          <p className="text-sm text-[#6a7b7e]">
            {publishedCount} published · {draftCount} {draftCount === 1 ? 'draft' : 'drafts'}
          </p>
        </div>

        {members.length ? (
          <div className="space-y-3">
            {members.map((member) => (
              <LeadershipRecord key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#bdcecb] bg-white px-6 py-12 text-center">
            <HiOutlineIdentification className="mx-auto size-8 text-[#3e9ba2]" />
            <h3 className="mt-3 font-bold">No leadership records yet</h3>
            <p className="mt-1 text-sm text-[#6a7d80]">Add the first officer or advisor.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function LeadershipRecord({
  member,
}: {
  member: Awaited<ReturnType<typeof getAdminLeadership>>[number];
}) {
  return (
    <details className="group rounded-lg border border-[#d8e2e0] bg-white open:shadow-sm">
      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-lg p-5 marker:hidden sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center [&::-webkit-details-marker]:hidden">
        <div className="relative size-14 overflow-hidden rounded-md bg-[#eef3f2]">
          {member.imageUrl ? (
            <Image src={member.imageUrl} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-[#819194]">
              <HiOutlineUser className="size-7" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#25383b] sm:text-lg">{member.name}</h3>
            <StatusBadge status={member.status} />
            <span className="rounded-full bg-[#eef3f2] px-2.5 py-1 text-xs font-semibold text-[#617477]">
              {member.kind === 'officer' ? 'Student officer' : 'Advisor'}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#397d82]">{member.role}</p>
          <p className="mt-2 text-sm text-[#6a7b7e]">{formatTerm(member.termStart, member.termEnd)}</p>
        </div>

        <span className="col-start-2 inline-flex items-center justify-self-start gap-2 text-sm font-semibold text-[#287c82] sm:col-start-auto sm:justify-self-end">
          Edit
          <HiOutlineChevronDown className="size-4 transition group-open:rotate-180 motion-reduce:transition-none" />
        </span>
      </summary>

      <div className="border-t border-[#e0e8e6] bg-[#fbfcfc] p-5 sm:p-6">
        <LeadershipForm member={toEditableMember(member)} />
        {member.status !== 'archived' && (
          <form action={archiveLeadershipMemberAction} className="mt-7 border-t border-[#e0e8e6] pt-5">
            <input type="hidden" name="id" value={member.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-[#8d5149] hover:bg-[#fbefed] hover:text-[#6f332c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a84338]"
            >
              <HiOutlineArchiveBox className="size-4" />
              Archive record
            </button>
          </form>
        )}
      </div>
    </details>
  );
}

function StatusBadge({ status }: { status: EditableLeadershipMember['status'] }) {
  const classes = {
    published: 'bg-[#dcf2ee] text-[#1f716f]',
    draft: 'bg-[#fff0c7] text-[#855f13]',
    archived: 'bg-[#edf0ef] text-[#69787a]',
  }[status];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status[0]?.toUpperCase()}{status.slice(1)}
    </span>
  );
}

function toEditableMember(
  member: Awaited<ReturnType<typeof getAdminLeadership>>[number],
): EditableLeadershipMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    kind: member.kind,
    bio: member.bio,
    email: member.email,
    imageId: member.imageId,
    imageUrl: member.imageUrl,
    status: member.status,
    sortOrder: member.sortOrder,
    termStart: member.termStart,
    termEnd: member.termEnd,
  };
}

function formatTerm(start: string | null, end: string | null): string {
  if (!start && !end) return 'No term dates set';
  const format = (value: string) =>
    formatDateOnly(value, { month: 'short', day: 'numeric', year: 'numeric' });

  if (start && end) return `${format(start)}–${format(end)}`;
  if (start) return `Starts ${format(start)}`;
  return `Ends ${format(end!)}`;
}
