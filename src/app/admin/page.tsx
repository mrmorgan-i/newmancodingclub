import Link from 'next/link';
import {
  HiOutlineArrowRight,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { formatDateOnly } from '@/lib/dateOnly';
import { formatRecurrenceLabel, normalizeWeekdays } from '@/lib/recurrence';
import { getAdminContext } from '@/modules/admin/guards';
import { getAdminOverview } from '@/modules/admin/queries';

export default async function AdminOverviewPage() {
  const [overview, context] = await Promise.all([
    getAdminOverview(),
    getAdminContext(),
  ]);
  const isOwner = context?.membership.role === 'owner';

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Manage the club schedule, leadership, members, and admin access."
        actions={
          <>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 rounded-md bg-[#2f858b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#286f74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
            >
              <HiOutlinePlus className="size-4" />
              Add event
            </Link>
            {isOwner && (
              <Link
                href="/admin/access#invite"
                className="inline-flex items-center gap-2 rounded-md border border-[#cbd8d6] bg-white px-4 py-2.5 text-sm font-semibold text-[#34484b] hover:border-[#7ab8bb] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
              >
                <HiOutlineShieldCheck className="size-4" />
                Invite admin
              </Link>
            )}
          </>
        }
      />

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Club summary
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Published events"
            value={overview.counts.publishedEvents}
            icon={HiOutlineCalendarDays}
          />
          <SummaryCard
            label="Draft events"
            value={overview.counts.draftEvents}
            icon={HiOutlineCalendarDays}
          />
          <SummaryCard
            label="Members"
            value={overview.counts.clubMembers}
            icon={HiOutlineUserGroup}
          />
          <SummaryCard
            label="Administrators"
            value={overview.counts.adminMembers}
            icon={HiOutlineShieldCheck}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <CurrentSchedule series={overview.activeSeries} />

        <section className="rounded-lg border border-[#d8e2e0] bg-white">
          <div className="border-b border-[#e2e9e8] px-5 py-4">
            <h2 className="text-lg font-bold text-[#253639]">Quick links</h2>
          </div>
          <div className="divide-y divide-[#e8eeed]">
            <QuickLink href="/admin/events" label="Manage events" />
            <QuickLink href="/admin/leadership" label="Manage leadership" />
            <QuickLink href="/admin/members" label="View members" />
            {isOwner && (
              <QuickLink href="/admin/access" label="Manage admin access" />
            )}
          </div>
          {isOwner && overview.counts.pendingInvitations > 0 && (
            <p className="border-t border-[#e8eeed] px-5 py-3 text-sm text-[#627477]">
              {overview.counts.pendingInvitations}{' '}
              {overview.counts.pendingInvitations === 1 ? 'invitation is' : 'invitations are'} pending.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HiOutlineCalendarDays;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#d8e2e0] bg-white p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#e4f2f1] text-[#28777c]">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-[#1f2d30]">{value}</p>
        <p className="mt-1 text-sm text-[#66777a]">{label}</p>
      </div>
    </div>
  );
}

function CurrentSchedule({
  series,
}: {
  series: Awaited<ReturnType<typeof getAdminOverview>>['activeSeries'];
}) {
  return (
    <section className="rounded-lg border border-[#d8e2e0] bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-[#e2e9e8] px-5 py-4">
        <h2 className="text-lg font-bold text-[#253639]">Current schedule</h2>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#287c82] hover:text-[#1f2d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
        >
          Edit
          <HiOutlineArrowRight className="size-4" />
        </Link>
      </div>

      {series?.startDate && series.endDate ? (
        <div className="p-5 sm:p-6">
          <h3 className="text-xl font-bold text-[#1f2d30]">{series.title}</h3>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <ScheduleDetail
              icon={HiOutlineCalendarDays}
              label="Dates"
              value={`${formatDateOnly(series.startDate, {
                month: 'short',
                day: 'numeric',
              })}–${formatDateOnly(series.endDate, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`}
            />
            <ScheduleDetail
              icon={HiOutlineCalendarDays}
              label="Meets"
              value={formatRecurrenceLabel(
                series.repeatInterval,
                normalizeWeekdays(series.daysOfWeek),
              )}
            />
            <ScheduleDetail
              icon={HiOutlineClock}
              label="Time"
              value={`${formatClock(series.startTime)}–${formatClock(series.endTime)}`}
            />
            <ScheduleDetail
              icon={HiOutlineMapPin}
              label="Location"
              value={series.location}
            />
          </dl>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-sm text-[#627477]">No recurring schedule is published.</p>
          <Link
            href="/admin/events/new"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#287c82] hover:text-[#1f2d30]"
          >
            Add a schedule
            <HiOutlineArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

function ScheduleDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HiOutlineCalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-[#3e9ba2]" />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-[#7a898b]">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold text-[#34484b]">{value}</dd>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[#34484b] hover:bg-[#f5f8f7] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#2f8f95]"
    >
      {label}
      <HiOutlineArrowRight className="size-4 shrink-0" />
    </Link>
  );
}

function formatClock(value: string): string {
  const [hourValue, minute] = value.split(':');
  const hour = Number(hourValue);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
}
