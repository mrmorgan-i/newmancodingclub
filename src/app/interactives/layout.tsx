"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function InteractivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current path

  const showBackLink = pathname !== '/interactives';

  return (
    <div className="pt-16 md:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBackLink && (
          <div className="mb-6 sm:mb-2">
            <Link href="/interactives" legacyBehavior>
              <a className="inline-flex items-center text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors duration-150 ease-in-out group">
                <ArrowLeftIcon className="w-5 h-4 mr-2 transition-transform duration-150 ease-in-out group-hover:-translate-x-1" />
                Back to All Interactives
              </a>
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
