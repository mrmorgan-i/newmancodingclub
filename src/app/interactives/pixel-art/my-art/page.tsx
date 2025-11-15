'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useSession } from '@/lib/auth/client';
import { toast } from 'sonner';
import PixelArtNav from '@/components/PixelArtNav';

type PixelArt = {
  id: string;
  title: string | null;
  description: string | null;
  rows: number;
  cols: number;
  grid: string[][];
  isPublic: boolean;
  createdAt: string;
};

export default function MyArtPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [artworks, setArtworks] = useState<PixelArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [artToDelete, setArtToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isPending) return;

    // Only redirect if we're sure there's no session
    if (!session?.user) {
      router.push('/auth/signin?redirectTo=/interactives/pixel-art/my-art');
      return;
    }

    fetchArtworks();
  }, [session, isPending, router]);

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/pixel-art/my-art');
      if (response.status === 401) {
        router.push('/auth/signin?redirectTo=/interactives/pixel-art/my-art');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load your artwork');
      }
      const data = await response.json();
      setArtworks(data.art || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your artwork');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setArtToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setArtToDelete(null);
  };

  const confirmDelete = async () => {
    if (!artToDelete) return;

    setDeletingId(artToDelete);
    setDeleteModalOpen(false);

    try {
      const response = await fetch(`/api/pixel-art/my-art?id=${artToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete artwork');
      }

      setArtworks((prev) => prev.filter((art) => art.id !== artToDelete));
      toast.success('Artwork deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete artwork');
    } finally {
      setDeletingId(null);
      setArtToDelete(null);
    }
  };

  const renderPixelArt = (art: PixelArt) => {
    const cellSize = Math.min(300 / Math.max(art.rows, art.cols), 15);

    return (
      <div
        className="grid border-2 border-slate-200 shadow-sm"
        style={{
          gridTemplateColumns: `repeat(${art.cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${art.rows}, ${cellSize}px)`,
        }}
      >
        {art.grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="border border-slate-100"
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </div>
    );
  };

  // Show loading while checking auth
  if (isPending) {
    return (
      <section className="pb-16">
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <section className="pb-16">
      <PixelArtNav />
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <Link
            href="/interactives/pixel-art"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Pixel Art Lab
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-fuchsia-200">
            Your creations
          </p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">My Artwork</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Manage your pixel art collection. Delete pieces you no longer want or view what&apos;s public.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total artworks', value: loading ? '...' : artworks.length },
              {
                label: 'Public',
                value: loading ? '...' : artworks.filter((a) => a.isPublic).length,
              },
              {
                label: 'Private',
                value: loading ? '...' : artworks.filter((a) => !a.isPublic).length,
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/60">
          {loading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-slate-600">Loading your artwork...</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
              <p className="text-rose-600">{error}</p>
            </div>
          )}

          {!loading && !error && artworks.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xl font-semibold text-slate-700">No artwork yet</p>
              <p className="mt-2 text-slate-600">Create your first pixel art masterpiece!</p>
              <Link
                href="/interactives/pixel-art"
                className="mt-6 inline-block rounded-2xl border border-primary bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
              >
                Create Pixel Art
              </Link>
            </div>
          )}

          {!loading && !error && artworks.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-center bg-white p-6">
                    {renderPixelArt(art)}
                  </div>
                  <div className="space-y-3 border-t border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="flex-1 font-semibold text-slate-900">
                        {art.title || 'Untitled Artwork'}
                      </h3>
                      <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {art.isPublic ? (
                          <>
                            <EyeIcon className="h-3 w-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="h-3 w-3" />
                            Private
                          </>
                        )}
                      </div>
                    </div>
                    {art.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{art.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                      <span>{art.rows}×{art.cols} grid</span>
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => openDeleteModal(art.id)}
                      disabled={deletingId === art.id}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      {deletingId === art.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete Artwork?</h3>
            <p className="mt-3 text-slate-600">
              Are you sure you want to delete this artwork? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl border border-rose-500 bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
