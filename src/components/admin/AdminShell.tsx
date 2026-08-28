'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineArrowLeftStartOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBars3,
  HiOutlineCalendarDays,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineCodeBracket,
  HiOutlineHome,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
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
  { href: '/admin/leadership', label: 'Leadership', icon: HiOutlineIdentification },
  { href: '/admin/members', label: 'Members', icon: HiOutlineUserGroup },
] as const;

const SIDEBAR_STORAGE_KEY = 'ncc-admin-sidebar-collapsed';

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSidebarCollapsed(
      window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true',
    );
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    mobileCloseButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-dvh bg-[#f6f8f8] text-[#1f2d30]">
      <aside
        className={clsx(
          'sticky top-0 hidden h-dvh shrink-0 border-r border-[#dce4e3] bg-white transition-[width] duration-200 motion-reduce:transition-none lg:flex lg:flex-col',
          sidebarCollapsed ? 'w-20' : 'w-60',
        )}
      >
        <AdminNavigation
          collapsed={sidebarCollapsed}
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
            className="absolute inset-0 bg-[#172327]/45"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative flex h-full w-[min(84vw,288px)] flex-col bg-white shadow-xl"
            aria-label="Admin navigation"
            aria-modal="true"
            role="dialog"
          >
            <button
              ref={mobileCloseButtonRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-md text-[#526467] hover:bg-[#eef3f2] hover:text-[#1f2d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
              aria-label="Close navigation"
            >
              <HiOutlineXMark className="size-5" />
            </button>
            <AdminNavigation
              collapsed={false}
              pathname={pathname}
              role={user.role}
              user={user}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1" inert={mobileOpen ? true : undefined}>
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#dce4e3] bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="mr-3 grid size-10 place-items-center rounded-md text-[#405356] hover:bg-[#eef3f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95] lg:hidden"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <HiOutlineBars3 className="size-6" />
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="mr-3 hidden size-9 place-items-center rounded-md text-[#607174] hover:bg-[#eef3f2] hover:text-[#1f2d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95] lg:grid"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? (
              <HiOutlineChevronDoubleRight className="size-4" />
            ) : (
              <HiOutlineChevronDoubleLeft className="size-4" />
            )}
          </button>

          <p className="truncate text-sm font-semibold text-[#26373a]">
            {getPageLabel(pathname)}
          </p>

          <Link
            href="/"
            target="_blank"
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-[#cfdad8] bg-white px-3 py-2 text-sm font-semibold text-[#34484b] hover:border-[#7ab8bb] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
          >
            <span className="hidden sm:inline">View site</span>
            <HiOutlineArrowTopRightOnSquare className="size-4" />
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function AdminNavigation({
  collapsed,
  onNavigate,
  onSignOut,
  pathname,
  role,
  user,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onSignOut: () => Promise<void>;
  pathname: string;
  role: AdminRole;
  user: { email: string; name: string };
}) {
  return (
    <>
      <div
        className={clsx(
          'flex h-16 items-center border-b border-[#e2e8e7]',
          collapsed ? 'justify-center px-3' : 'px-4',
        )}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2f8f95]"
          aria-label={collapsed ? 'Newman Coding Club admin' : undefined}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#3e9ba2] text-white">
            <HiOutlineCodeBracket className="size-6" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#1f2d30]">
                Newman Coding Club
              </span>
              <span className="block text-xs text-[#708083]">Admin</span>
            </span>
          )}
        </Link>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Admin navigation"
      >
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavigationLink
              key={item.href}
              collapsed={collapsed}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={
                item.href === '/admin'
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {role === 'owner' && (
          <div className="mt-4 border-t border-[#e2e8e7] pt-4">
            <NavigationLink
              collapsed={collapsed}
              href="/admin/access"
              icon={HiOutlineShieldCheck}
              label="Admin access"
              active={pathname.startsWith('/admin/access')}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </nav>

      <div className={clsx('border-t border-[#e2e8e7]', collapsed ? 'p-3' : 'p-4')}>
        {!collapsed && (
          <div className="mb-3 min-w-0 px-2">
            <p className="truncate text-sm font-semibold text-[#26373a]">{user.name}</p>
            <p className="truncate text-xs text-[#748487]">{user.email}</p>
            <p className="mt-1 text-xs font-semibold text-[#2f7f85]">
              {ADMIN_ROLE_LABELS[role]}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => void onSignOut()}
          className={clsx(
            'flex w-full items-center rounded-md text-sm text-[#607174] hover:bg-[#eef3f2] hover:text-[#1f2d30] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2f8f95]',
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
          )}
          aria-label={collapsed ? 'Sign out' : undefined}
          title={collapsed ? 'Sign out' : undefined}
        >
          <HiOutlineArrowLeftStartOnRectangle className="size-[18px] shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </>
  );
}

function NavigationLink({
  active,
  collapsed,
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  active: boolean;
  collapsed: boolean;
  href: string;
  icon: typeof HiOutlineHome;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={clsx(
        'flex items-center rounded-md py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2f8f95]',
        collapsed ? 'justify-center px-2' : 'gap-3 px-3',
        active
          ? 'bg-[#e7f3f2] text-[#236f74]'
          : 'text-[#5f7073] hover:bg-[#f0f4f3] hover:text-[#26373a]',
      )}
    >
      <Icon className="size-[19px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function getPageLabel(pathname: string): string {
  if (pathname.startsWith('/admin/events/new')) return 'Add event';
  if (pathname.startsWith('/admin/events')) return 'Events';
  if (pathname.startsWith('/admin/leadership/new')) return 'Add leadership record';
  if (pathname.startsWith('/admin/leadership')) return 'Leadership';
  if (pathname.startsWith('/admin/members')) return 'Members';
  if (pathname.startsWith('/admin/access')) return 'Admin access';
  if (pathname.startsWith('/admin/invitations')) return 'Invitation';
  return 'Overview';
}
