"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Container from '@/components/Container';

export default function InteractivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current path

  const showBackLink = pathname !== '/interactives';

  if (!showBackLink) {
    return <div className="bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="bg-slate-950 text-slate-100">
      <Container className="pt-28 pb-16">
        <div className="mb-8">
          <Link
            href="/interactives"
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary hover:text-primary"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to interactives hub
          </Link>
        </div>
        {children}
      </Container>
    </div>
  );
}
