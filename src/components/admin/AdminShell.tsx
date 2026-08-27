'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  HiOutlineArrowLeftStartOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBars3,
  HiOutlineCalendarDays,
  HiOutlineCodeBracket,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from 'react-icons/hi2';

import { signOut } from '@/lib/auth/client';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/modules/admin/roles';

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    email: string;
    name: string;
    role: AdminRole;
  };
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: HiOutlineHome },
  { href: '/admin/events', label: 'Events', icon: HiOutlineCalendarDays },
  { href: '/admin/members', label: 'Members', icon: HiOutlineUserGroup },
] as const;

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div
      className="min-h-screen bg-[#edf3f2] text-[#172327]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(62, 155, 162, 0.12) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-[1680px] bg-[#f8fbfa]/95 shadow-[0_0_80px_rgba(23,35,39,0.08)]">
        <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 border-r border-white/8 bg-[#172327] text-white lg:flex lg:flex-col">
          <AdminNavigation
            pathname={pathname}
            role={user.role}
            user={user}
            onSignOut={handleSignOut}
          />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-[#172327]/55 backdrop-blur-xs"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative flex h-full w-[min(86vw,320px)] flex-col bg-[#172327] text-white shadow-2xl">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#83c9cb]"
                aria-label="Close navigation"
              >
                <HiOutlineXMark className="size-5" />
              </button>
              <AdminNavigation
                pathname={pathname}
                role={user.role}
                user={user}
                onNavigate={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
              />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[68px] items-center border-b border-[#d9e3e1] bg-[#f8fbfa]/90 px-4 backdrop-blur-md sm:px-7">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="mr-3 grid size-10 place-items-center rounded-full border border-[#cbd9d7] text-[#405154] lg:hidden"
              aria-label="Open navigation"
            >
              <HiOutlineBars3 className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#658184]">
                Club desk
              </p>
              <p className="truncate text-sm font-semibold text-[#172327]">
                {getPageLabel(pathname)}
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#cbd9d7] bg-white px-3.5 py-2 text-xs font-semibold text-[#31474a] transition hover:border-[#3e9ba2] hover:text-[#2f7f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] sm:text-sm"
            >
              View site
              <HiOutlineArrowTopRightOnSquare className="size-4" />
            </Link>
          </header>

          <main className="p-4 sm:p-7 lg:p-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

function AdminNavigation({
  onNavigate,
  onSignOut,
  pathname,
  role,
  user,
}: {
  onNavigate?: () => void;
  onSignOut: () => Promise<void>;
  pathname: string;
  role: AdminRole;
  user: { email: string; name: string };
}) {
  return (
    <>
      <div className="border-b border-white/8 px-5 py-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83c9cb]"
        >
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#3e9ba2] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]">
            <HiOutlineCodeBracket className="size-6" />
          </span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight">
              Newman Coding Club
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.19em] text-[#83c9cb]">
              {'{ club desk }'}
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Admin navigation">
        <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.19em] text-white/35">
          Workspace
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#83c9cb]',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/6 hover:text-white',
                )}
              >
                {active && (
                  <span className="absolute -left-3 h-5 w-0.5 rounded-r-full bg-[#83c9cb]" />
                )}
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {role === 'owner' && (
          <div className="mt-8">
            <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.19em] text-white/35">
              Administration
            </p>
            <Link
              href="/admin/access"
              onClick={onNavigate}
              aria-current={pathname.startsWith('/admin/access') ? 'page' : undefined}
              className={clsx(
                'relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#83c9cb]',
                pathname.startsWith('/admin/access')
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/6 hover:text-white',
              )}
            >
              {pathname.startsWith('/admin/access') && (
                <span className="absolute -left-3 h-5 w-0.5 rounded-r-full bg-[#83c9cb]" />
              )}
              <HiOutlineUserGroup className="size-[18px]" />
              Access
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="mb-3 min-w-0 px-2">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-white/45">{user.email}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#83c9cb]">
            {ADMIN_ROLE_LABELS[role]}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void onSignOut()}
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-white/55 transition hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#83c9cb]"
        >
          <HiOutlineArrowLeftStartOnRectangle className="size-[18px]" />
          Sign out
        </button>
      </div>
    </>
  );
}

function getPageLabel(pathname: string): string {
  if (pathname.startsWith('/admin/events')) return 'Events';
  if (pathname.startsWith('/admin/members')) return 'Members';
  if (pathname.startsWith('/admin/access')) return 'Access';
  if (pathname.startsWith('/admin/invitations')) return 'Invitation';
  return 'Overview';
}
