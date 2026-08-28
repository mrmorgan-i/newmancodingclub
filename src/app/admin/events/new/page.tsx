import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import EventForm from '@/components/admin/EventForm';

export const metadata: Metadata = {
  title: 'Add event',
};

export default function NewAdminEventPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#587073] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
      >
        <HiOutlineArrowLeft className="size-4" />
        Back to events
      </Link>

      <AdminPageHeader
        title="Add event"
        description="Add a recurring meeting series or a one-time club event."
      />

      <section className="rounded-lg border border-[#d8e2e0] bg-white p-5 sm:p-7">
        <EventForm onSuccessReset />
      </section>
    </div>
  );
}
