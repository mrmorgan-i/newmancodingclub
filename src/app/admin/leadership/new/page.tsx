import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import LeadershipForm from '@/components/admin/LeadershipForm';

export const metadata: Metadata = {
  title: 'Add leadership record',
};

export default function NewLeadershipMemberPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/leadership"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#587073] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
      >
        <HiOutlineArrowLeft className="size-4" />
        Back to leadership
      </Link>

      <AdminPageHeader
        title="Add leadership record"
        description="Add a student officer, faculty advisor, or spiritual companion to the club website."
      />

      <section className="rounded-lg border border-[#d8e2e0] bg-white p-5 sm:p-7">
        <LeadershipForm onSuccessReset />
      </section>
    </div>
  );
}
