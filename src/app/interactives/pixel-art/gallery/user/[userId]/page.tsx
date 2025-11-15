'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import PixelArtNav from '@/components/PixelArtNav';

type PixelArt = {
  id: string;
  title: string | null;
  description: string | null;
  rows: number;
  cols: number;
  grid: string[][];
  createdAt: string;
  creator: {
    id: string;
    name: string;
  } | null;
};

export default function UserGalleryPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [artworks, setArtworks] = useState<PixelArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = artworks[0]?.creator?.name || 'Unknown Artist';

  useEffect(() => {
    if (!userId) return;

    const fetchUserArt = async () => {
      try {
        const response = await fetch(`/api/pixel-art?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load user artwork');
        }
        const data = await response.json();
        setArtworks(data.art || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchUserArt();
  }, [userId]);

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

  if (loading) {
    return (
      <section className="pb-16">
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-slate-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-16">
        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
            <Link
              href="/interactives/pixel-art/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Gallery
            </Link>
          </div>
          <div className="rounded-3xl bg-white p-12 shadow-2xl shadow-slate-200/60 text-center">
            <p className="text-xl font-semibold text-slate-700">{error}</p>
            <Link
              href="/interactives/pixel-art/gallery"
              className="mt-6 inline-block rounded-2xl border border-primary bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16">
      <PixelArtNav />
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <Link
            href="/interactives/pixel-art/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Gallery
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-fuchsia-200">
            Artist Gallery
          </p>
          <div className="mt-2 flex items-center gap-3">
            <UserIcon className="h-10 w-10 text-white" />
            <h1 className="text-4xl font-bold manrope text-white">{userName}</h1>
          </div>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Browse all public pixel art created by {userName}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total artworks', value: artworks.length },
              {
                label: 'Latest',
                value: artworks[0] ? new Date(artworks[0].createdAt).toLocaleDateString() : 'N/A',
              },
              {
                label: 'Total pixels',
                value: artworks.reduce((sum, art) => sum + art.rows * art.cols, 0),
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
          {artworks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xl font-semibold text-slate-700">No public artwork yet</p>
              <p className="mt-2 text-slate-600">This user hasn&apos;t shared any public artwork.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/interactives/pixel-art/gallery/${art.id}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-center bg-white p-6">
                    {renderPixelArt(art)}
                  </div>
                  <div className="space-y-2 border-t border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900">
                      {art.title || 'Untitled Artwork'}
                    </h3>
                    {art.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{art.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                      <span>
                        {art.rows}×{art.cols} grid
                      </span>
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
