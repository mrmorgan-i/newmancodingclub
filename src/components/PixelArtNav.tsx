'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PlusIcon,
  PhotoIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSession, signOut } from '@/lib/auth/client';
import { toast } from 'sonner';

export default function PixelArtNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    {
      label: 'Create',
      href: '/interactives/pixel-art',
      icon: PlusIcon,
      show: true,
    },
    {
      label: 'Gallery',
      href: '/interactives/pixel-art/gallery',
      icon: PhotoIcon,
      show: true,
    },
    {
      label: 'My Art',
      href: '/interactives/pixel-art/my-art',
      icon: UserCircleIcon,
      show: true,
      requiresAuth: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/interactives/pixel-art') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition hover:bg-primary/90 hover:scale-110"
        aria-label="Navigation menu"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">
          {navItems
            .filter((item) => item.show && (!item.requiresAuth || session?.user))
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-full px-4 py-3 shadow-lg transition hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold pr-2">{item.label}</span>
                </Link>
              );
            })}

          {session?.user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-slate-700 shadow-lg transition hover:scale-105 hover:bg-rose-50 hover:text-rose-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="font-semibold pr-2">Sign Out</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
