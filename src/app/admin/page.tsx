import Link from 'next/link';
import {
  HiOutlineArrowRight,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePlus,
  HiOutlineUserPlus,
} from 'react-icons/hi2';

import { dateOnlyInTimeZone, formatDateOnly } from '@/lib/dateOnly';
import { getAdminContext } from '@/modules/admin/guards';
import { getAdminOverview } from '@/modules/admin/queries';

export default async function AdminOverviewPage() {
  const [overview, context] = await Promise.all([
    getAdminOverview(),
    getAdminContext(),
  ]);
  const pulse = getSemesterPulse(overview.activeSeries);
  const isOwner = context?.membership.role === 'owner';

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden border border-[#d6e1df] bg-white shadow-[0_20px_60px_rgba(37,61,65,0.08)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-6 sm:p-9">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2f7f85]">
              Semester operations
            </p>
            <h1 className="manrope mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#172327] sm:text-5xl">
              Keep the club current, one clear update at a time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5d7073]">
              Events are live from the database. The next content desks are mapped
              below so we can move the rest without turning the site into a page
              builder.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/admin/events#new-event"
                className="inline-flex items-center gap-2 rounded-full bg-[#172327] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#263b3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2]"
              >
                <HiOutlinePlus className="size-4" />
                Add an event
              </Link>
              {isOwner && (
                <Link
                  href="/admin/access#invite"
                  className="inline-flex items-center gap-2 rounded-full border border-[#c8d8d5] px-5 py-2.5 text-sm font-bold text-[#31474a] transition hover:border-[#3e9ba2] hover:text-[#2f7f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2]"
                >
                  <HiOutlineUserPlus className="size-4" />
                  Invite an admin
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-[#d6e1df] bg-[#edf5f4] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#60777a]">
              Publishing state
            </p>
            <dl className="mt-5 divide-y divide-[#ccdcda]">
              <Metric label="Published events" value={overview.counts.publishedEvents} />
              <Metric label="Draft events" value={overview.counts.draftEvents} />
              <Metric label="Club members" value={overview.counts.clubMembers} />
              <Metric label="Admin team" value={overview.counts.adminMembers} />
              {isOwner && (
                <Metric
                  label="Invitations waiting"
                  value={overview.counts.pendingInvitations}
                />
              )}
            </dl>
          </div>
        </div>

        <SemesterPulse pulse={pulse} />
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718689]">
                Content runway
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">What moves next</h2>
            </div>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2f7f85] hover:text-[#172327]"
            >
              Manage events
              <HiOutlineArrowRight className="size-4" />
            </Link>
          </div>

          <div className="border border-[#d6e1df] bg-white">
            <ContentDesk
              name="Events & semester schedule"
              description="Recurring meetings, one-off events, drafts, links, locations, and tags."
              state="Live now"
              stateTone="live"
            />
            <ContentDesk
              name="Leadership & advisors"
              description="Officer terms, roles, bios, contact details, ordering, and headshots."
              state="Next"
            />
            <ContentDesk
              name="FAQs & site copy"
              description="Frequently changed answers, hero message, calls to action, and club stats."
              state="Mapped"
            />
            <ContentDesk
              name="Resources & projects"
              description="AI tool directory, member projects, links, visibility, and ordering."
              state="Mapped"
            />
          </div>
        </section>

        <section>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718689]">
            Recent activity
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Change log</h2>
          <div className="mt-4 border border-[#d6e1df] bg-white p-5">
            {overview.activity.length ? (
              <ol className="space-y-5">
                {overview.activity.map((entry) => (
                  <li key={entry.id} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 size-2 rounded-full bg-[#3e9ba2] ring-4 ring-[#e4f0ef]" />
                    <p className="text-sm font-semibold leading-5 text-[#25383b]">
                      {entry.summary}
                    </p>
                    <p className="mt-1 text-xs text-[#718184]">
                      {entry.actorName ?? 'System'} · {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-6 text-[#66797c]">
                Changes made in the club desk will appear here with their author.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-sm text-[#607477]">{label}</dt>
      <dd className="font-mono text-xl font-bold text-[#172327]">{value}</dd>
    </div>
  );
}

function SemesterPulse({ pulse }: { pulse: ReturnType<typeof getSemesterPulse> }) {
  return (
    <div className="border-t border-[#d6e1df] bg-[#172327] px-6 py-6 text-white sm:px-9">
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)_240px] lg:items-center">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#83c9cb]">
            Semester pulse
          </p>
          <p className="mt-1 text-lg font-bold">{pulse.title}</p>
        </div>

        <div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/12">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#83c9cb]"
              style={{ width: `${pulse.progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
            <span>{pulse.startLabel}</span>
            <span>{pulse.endLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:border-l lg:border-white/10 lg:pl-6">
          <PulseDetail icon={HiOutlineCalendarDays} label="Meetings" value={pulse.meetings} />
          <PulseDetail icon={HiOutlineClock} label="Time" value={pulse.time} />
          <PulseDetail icon={HiOutlineMapPin} label="Place" value={pulse.location} />
        </div>
      </div>
    </div>
  );
}

function PulseDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HiOutlineClock;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <Icon className="size-4 text-[#83c9cb]" />
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-white/40">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs font-semibold text-white/85">{value}</p>
    </div>
  );
}

function ContentDesk({
  description,
  name,
  state,
  stateTone = 'neutral',
}: {
  description: string;
  name: string;
  state: string;
  stateTone?: 'live' | 'neutral';
}) {
  return (
    <div className="grid gap-3 border-b border-[#e0e8e6] p-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div>
        <h3 className="font-bold text-[#25383b]">{name}</h3>
        <p className="mt-1 text-sm leading-6 text-[#6a7c7f]">{description}</p>
      </div>
      <span
        className={`w-fit rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.13em] ${
          stateTone === 'live'
            ? 'bg-[#dff1ef] text-[#236f72]'
            : 'bg-[#eef2f1] text-[#6b7c7f]'
        }`}
      >
        {state}
      </span>
    </div>
  );
}

function getSemesterPulse(
  series: Awaited<ReturnType<typeof getAdminOverview>>['activeSeries'],
) {
  if (!series?.startDate || !series.endDate) {
    return {
      title: 'No published weekly series',
      startLabel: 'Start not set',
      endLabel: 'End not set',
      progress: 0,
      meetings: '—',
      time: '—',
      location: '—',
    };
  }

  const today = dateOnlyInTimeZone(new Date(), 'America/Chicago');
  const start = Date.parse(`${series.startDate}T00:00:00Z`);
  const end = Date.parse(`${series.endDate}T00:00:00Z`);
  const current = Date.parse(`${today}T00:00:00Z`);
  const duration = Math.max(end - start, 1);
  const progress = Math.min(100, Math.max(0, ((current - start) / duration) * 100));
  const meetings = Math.floor((end - start) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return {
    title: series.title,
    startLabel: formatDateOnly(series.startDate, { month: 'short', day: 'numeric' }),
    endLabel: formatDateOnly(series.endDate, { month: 'short', day: 'numeric' }),
    progress,
    meetings: String(meetings),
    time: `${formatClock(series.startTime)}–${formatClock(series.endTime)}`,
    location: series.location,
  };
}

function formatClock(value: string): string {
  const [hourValue, minute] = value.split(':');
  const hour = Number(hourValue);
  const period = hour >= 12 ? 'p' : 'a';
  return `${hour % 12 || 12}:${minute}${period}`;
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  }).format(value);
}
