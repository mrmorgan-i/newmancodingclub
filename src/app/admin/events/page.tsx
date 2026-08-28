import type { Metadata } from 'next';
import Link from 'next/link';
import {
  HiOutlineArchiveBox,
  HiOutlineCalendarDays,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePlus,
} from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import EventForm, { type EditableEvent } from '@/components/admin/EventForm';
import { formatWeekdayList, normalizeWeekdays } from '@/lib/recurrence';
import { archiveEventAction } from '@/modules/events/actions';
import { getAdminEvents } from '@/modules/events/queries';

export const metadata: Metadata = {
  title: 'Events',
};

export default async function AdminEventsPage() {
  const events = await getAdminEvents();
  const publishedCount = events.filter((event) => event.status === 'published').length;
  const draftCount = events.filter((event) => event.status === 'draft').length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        title="Events"
        description="Create and update recurring series and one-time club events."
        actions={
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-md bg-[#2f858b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#286f74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
          >
            <HiOutlinePlus className="size-4" />
            Add event
          </Link>
        }
      />

      <section aria-labelledby="event-list-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="event-list-heading" className="text-xl font-bold text-[#253639]">
            All events
          </h2>
          <p className="text-sm text-[#6a7b7e]">
            {publishedCount} published · {draftCount} {draftCount === 1 ? 'draft' : 'drafts'}
          </p>
        </div>

        {events.length ? (
          <div className="space-y-3">
            {events.map((event) => (
              <EventRecord key={event.id} event={toEditableEvent(event)} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#bdcecb] bg-white px-6 py-12 text-center">
            <HiOutlineCalendarDays className="mx-auto size-8 text-[#3e9ba2]" />
            <h3 className="mt-3 font-bold">No events yet</h3>
            <p className="mt-1 text-sm text-[#6a7d80]">Add the first event to get started.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function EventRecord({ event }: { event: EditableEvent }) {
  return (
    <details className="group rounded-lg border border-[#d8e2e0] bg-white open:shadow-sm">
      <summary className="grid cursor-pointer list-none gap-4 rounded-lg p-5 marker:hidden sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#25383b] sm:text-lg">{event.title}</h3>
            <StatusBadge status={event.status} />
            <span className="rounded-full bg-[#eef3f2] px-2.5 py-1 text-xs font-semibold text-[#617477]">
              {event.kind === 'weekly' ? 'Series' : 'One-time'}
            </span>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[#65777a] md:grid-cols-3">
            <span className="inline-flex min-w-0 items-start gap-1.5">
              <HiOutlineCalendarDays className="mt-0.5 size-4 shrink-0 text-[#3e9ba2]" />
              {formatSchedule(event)}
            </span>
            <span className="inline-flex items-start gap-1.5">
              <HiOutlineClock className="mt-0.5 size-4 shrink-0 text-[#3e9ba2]" />
              {formatClock(event.startTime)}–{formatClock(event.endTime)}
            </span>
            <span className="inline-flex min-w-0 items-start gap-1.5">
              <HiOutlineMapPin className="mt-0.5 size-4 shrink-0 text-[#3e9ba2]" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>
        <span className="inline-flex items-center justify-self-start gap-2 text-sm font-semibold text-[#287c82] sm:justify-self-end">
          Edit
          <HiOutlineChevronDown className="size-4 transition group-open:rotate-180 motion-reduce:transition-none" />
        </span>
      </summary>

      <div className="border-t border-[#e0e8e6] bg-[#fbfcfc] p-5 sm:p-6">
        <EventForm event={event} />
        {event.status !== 'archived' && (
          <form action={archiveEventAction} className="mt-7 border-t border-[#e0e8e6] pt-5">
            <input type="hidden" name="id" value={event.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-[#8d5149] hover:bg-[#fbefed] hover:text-[#6f332c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a84338]"
            >
              <HiOutlineArchiveBox className="size-4" />
              Archive event
            </button>
          </form>
        )}
      </div>
    </details>
  );
}

function StatusBadge({ status }: { status: EditableEvent['status'] }) {
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

function toEditableEvent(
  event: Awaited<ReturnType<typeof getAdminEvents>>[number],
): EditableEvent {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    kind: event.kind,
    status: event.status,
    date: event.date,
    startDate: event.startDate,
    endDate: event.endDate,
    repeatInterval: event.repeatInterval,
    daysOfWeek: event.daysOfWeek,
    startTime: event.startTime,
    endTime: event.endTime,
    timeZone: event.timeZone,
    location: event.location,
    registrationUrl: event.registrationUrl,
    tags: event.tags,
    isFeatured: event.isFeatured,
    sortOrder: event.sortOrder,
  };
}

function formatSchedule(event: EditableEvent): string {
  if (event.kind === 'weekly') {
    const cadence =
      event.repeatInterval === 1 ? 'Weekly' : `Every ${event.repeatInterval} weeks`;
    const weekdays = formatWeekdayList(normalizeWeekdays(event.daysOfWeek));
    return `${cadence} · ${weekdays} · ${formatDate(event.startDate, false)}–${formatDate(event.endDate)}`;
  }
  return event.date ? formatDate(event.date) : 'Date not set';
}

function formatDate(value: string | null, includeYear = true): string {
  if (!value) return 'Date not set';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatClock(value: string): string {
  const [hourValue, minutes] = value.split(':');
  const hour = Number(hourValue);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}
