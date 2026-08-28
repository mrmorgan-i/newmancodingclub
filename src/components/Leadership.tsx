import Image from 'next/image';
import { HiOutlineEnvelope, HiOutlineUser } from 'react-icons/hi2';

import { getPublishedLeadership } from '@/modules/leadership/queries';
import type { ILeadershipMember } from '@/types';

export default async function Leadership() {
  const leadership = await getPublishedLeadership();
  const officers = leadership.filter((member) => member.kind === 'officer');
  const advisors = leadership.filter((member) => member.kind === 'advisor');

  if (!leadership.length) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-foreground-accent">
        Leadership information will be available soon.
      </p>
    );
  }

  return (
    <div className="space-y-14">
      {officers.length > 0 && (
        <LeadershipGroup title="Student Officers" members={officers} />
      )}
      {advisors.length > 0 && (
        <LeadershipGroup title="Faculty Advisors" members={advisors} />
      )}
    </div>
  );
}

function LeadershipGroup({
  members,
  title,
}: {
  members: ILeadershipMember[];
  title: string;
}) {
  const headingId = `leadership-${title.toLowerCase().replaceAll(' ', '-')}`;

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-7 text-center text-2xl font-semibold">
        {title}
      </h3>
      <div
        className={`grid gap-6 sm:grid-cols-2 ${
          members.length === 2 ? 'mx-auto max-w-4xl' : 'lg:grid-cols-3'
        }`}
      >
        {members.map((member) => (
          <article
            key={member.id}
            className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <div className="relative mx-auto mb-4 size-32 overflow-hidden rounded-full border-4 border-primary/15 bg-primary/10">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={`${member.name}, ${member.role}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-primary">
                  <HiOutlineUser className="size-14" />
                </div>
              )}
            </div>
            <h4 className="text-xl font-semibold text-foreground">{member.name}</h4>
            <p className="mt-1 font-medium text-primary">{member.role}</p>
            <p className="mt-3 text-sm leading-6 text-foreground-accent">{member.bio}</p>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <HiOutlineEnvelope className="size-4" />
                Contact
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
