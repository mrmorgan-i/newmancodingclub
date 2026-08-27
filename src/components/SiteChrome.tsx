'use client';

import { usePathname } from 'next/navigation';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/accept-admin-invite'
  ) {
    return children;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
