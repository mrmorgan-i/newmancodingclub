import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

import Container from '@/components/Container';
import PastLeadership from '@/components/PastLeadership';

export const metadata: Metadata = {
  title: 'Past Leadership | Newman Coding Club',
  description:
    'Recognizing the students and advisors who have served Newman Coding Club.',
  alternates: {
    canonical: '/leadership/history',
  },
};

export const revalidate = 3600;

export default function LeadershipHistoryPage() {
  return (
    <div className="min-h-screen bg-[#f6f9f8] pt-20 md:pt-24">
      <header className="border-b border-[#dce6e4] bg-white">
        <Container className="max-w-6xl py-12 md:py-16">
          <Link
            href="/#leadership"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#527074] transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <HiOutlineArrowLeft className="size-4" />
            Current leadership
          </Link>
          <h1 className="mt-7 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Past Leadership
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground-accent">
            Recognizing the students and advisors who helped build Newman Coding Club.
          </p>
        </Container>
      </header>

      <Container className="max-w-6xl py-12 md:py-16">
        <PastLeadership />
      </Container>
    </div>
  );
}
