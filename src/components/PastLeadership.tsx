import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineClock, HiOutlineUser } from 'react-icons/hi2';

import {
  formatLeadershipTerm,
  groupPastLeadershipByYear,
} from '@/modules/leadership/history';
import { getPastLeadership } from '@/modules/leadership/queries';
import type { ILeadershipMember } from '@/types';

export default async function PastLeadership() {
  const groups = groupPastLeadershipByYear(await getPastLeadership());

  if (!groups.length) {
    return (
      <div className="rounded-xl border border-[#dce6e4] bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e7f3f2] text-primary">
          <HiOutlineClock className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">No past terms yet</h2>
        <p className="mx-auto mt-2 max-w-md text-base leading-7 text-foreground-accent">
          Past leadership will appear here as club terms conclude.
        </p>
        <Link
          href="/#leadership"
          className="mt-6 inline-flex rounded-full border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          View current leadership
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-14 lg:space-y-16">
      {groups.map((group) => (
        <section
          key={group.year}
          aria-labelledby={`leadership-year-${group.year}`}
          className="grid gap-5 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8"
        >
          <div className="md:border-r md:border-[#cfdcda] md:pr-8">
            <h2
              id={`leadership-year-${group.year}`}
              className="text-3xl font-bold tracking-tight text-[#2d777c] md:sticky md:top-28 md:text-right"
            >
              {group.year}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((member) => (
              <PastLeadershipCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PastLeadershipCard({ member }: { member: ILeadershipMember }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[#dce6e4] bg-white p-5 shadow-sm">
      <div className="relative size-24 overflow-hidden rounded-full border-4 border-primary/15 bg-primary/10">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-primary">
            <HiOutlineUser className="size-10" />
          </div>
        )}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-foreground">{member.name}</h3>
      <p className="mt-1 font-medium text-primary">{member.role}</p>
      {member.termEnd && (
        <p className="mt-3 text-sm font-semibold text-[#65787b]">
          {formatLeadershipTerm(member.termStart, member.termEnd)}
        </p>
      )}
      <p className="mt-4 text-sm leading-6 text-foreground-accent">{member.bio}</p>
    </article>
  );
}
