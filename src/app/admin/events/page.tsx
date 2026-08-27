import type { Metadata } from 'next';
import {
  HiOutlineArchiveBox,
  HiOutlineCalendarDays,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineMapPin,
} from 'react-icons/hi2';

import EventForm, { type EditableEvent } from '@/components/admin/EventForm';
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
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="grid gap-5 border-b border-[#d6e1df] pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2f7f85]">
            Publishing / Events
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#172327]">
            Semester schedule
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#607477]">
            Manage weekly meeting runs and one-time events. Published changes clear
            the public event cache immediately.
          </p>
        </div>
        <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.12em] text-[#6d8083]">
          <span><strong className="mr-1 text-lg text-[#172327]">{publishedCount}</strong> live</span>
          <span><strong className="mr-1 text-lg text-[#172327]">{draftCount}</strong> drafts</span>
        </div>
      </header>

      <section id="new-event" className="scroll-mt-24 border border-[#d5e0de] bg-white">
        <div className="border-b border-[#dce6e4] bg-[#edf5f4] px-5 py-4 sm:px-7">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#527174]">
            New record
          </p>
          <h2 className="mt-1 text-xl font-bold">Add an event</h2>
        </div>
        <div className="p-5 sm:p-7">
          <EventForm onSuccessReset />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718689]">
            Schedule records
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">All events</h2>
        </div>

        {events.length ? (
          <div className="space-y-3">
            {events.map((event) => (
              <EventRecord key={event.id} event={toEditableEvent(event)} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#bdcecb] bg-white px-6 py-12 text-center">
            <HiOutlineCalendarDays className="mx-auto size-8 text-[#3e9ba2]" />
            <h3 className="mt-3 font-bold">No events yet</h3>
            <p className="mt-1 text-sm text-[#6a7d80]">Create the first schedule record above.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function EventRecord({ event }: { event: EditableEvent }) {
  return (
    <details className="group border border-[#d5e0de] bg-white open:shadow-[0_16px_40px_rgba(37,61,65,0.08)]">
      <summary className="grid cursor-pointer list-none gap-4 p-5 marker:hidden sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="truncate text-lg font-bold text-[#25383b]">{event.title}</h3>
            <StatusBadge status={event.status} />
            <span className="rounded-full bg-[#eef4f3] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#61777a]">
              {event.kind === 'weekly' ? 'Weekly' : 'One-time'}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6a7c7f]">
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineCalendarDays className="size-4 text-[#3e9ba2]" />
              {formatSchedule(event)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineClock className="size-4 text-[#3e9ba2]" />
              {formatClock(event.startTime)}–{formatClock(event.endTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HiOutlineMapPin className="size-4 text-[#3e9ba2]" />
              {event.location}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center justify-self-start gap-2 text-sm font-bold text-[#2f7f85] sm:justify-self-end">
          Edit details
          <HiOutlineChevronDown className="size-4 transition group-open:rotate-180" />
        </span>
      </summary>

      <div className="border-t border-[#dce6e4] bg-[#fbfdfc] p-5 sm:p-7">
        <EventForm event={event} />
        {event.status !== 'archived' && (
          <form action={archiveEventAction} className="mt-7 border-t border-[#e0e8e6] pt-5">
            <input type="hidden" name="id" value={event.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#8d5149] transition hover:text-[#6f332c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a84338]"
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
    <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${classes}`}>
      {status}
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
    dayOfWeek: event.dayOfWeek,
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
    const weekday = WEEKDAYS[event.dayOfWeek ?? 0];
    return `${weekday}s, ${formatDate(event.startDate)}–${formatDate(event.endDate)}`;
  }
  return event.date ? formatDate(event.date) : 'TBD';
}

function formatDate(value: string | null): string {
  if (!value) return 'TBD';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatClock(value: string): string {
  const [hourValue, minutes] = value.split(':');
  const hour = Number(hourValue);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
