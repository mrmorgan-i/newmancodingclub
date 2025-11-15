'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowDownTrayIcon, ShareIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
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

export default function ArtworkPage() {
  const params = useParams();
  const artId = params?.id as string;
  const [artwork, setArtwork] = useState<PixelArt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artId) return;

    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/pixel-art?id=${artId}`);
        if (response.status === 404) {
          setError('Artwork not found or is private');
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to load artwork');
        }
        const data = await response.json();
        setArtwork(data.art);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artId]);

  const downloadAsPNG = () => {
    if (!artwork) return;

    const cellSize = 20;
    const canvas = document.createElement('canvas');
    canvas.width = artwork.cols * cellSize;
    canvas.height = artwork.rows * cellSize;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    artwork.grid.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        context.fillStyle = color || '#FFFFFF';
        context.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      });
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artwork.title || 'pixel-art'}-${artwork.rows}x${artwork.cols}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork?.title || 'Check out this pixel art!',
          text: artwork?.description || 'View this awesome pixel art from Newman Coding Club',
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const renderPixelArt = (art: PixelArt) => {
    const maxSize = 600;
    const cellSize = Math.min(maxSize / Math.max(art.rows, art.cols), 30);

    return (
      <div
        className="grid border-2 border-slate-200 shadow-lg mx-auto"
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
          <p className="mt-4 text-slate-600">Loading artwork...</p>
        </div>
      </section>
    );
  }

  if (error || !artwork) {
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
            <p className="text-xl font-semibold text-slate-700">{error || 'Artwork not found'}</p>
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
            Pixel Art
          </p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">
            {artwork.title || 'Untitled Artwork'}
          </h1>
          {artwork.creator && (
            <Link
              href={`/interactives/pixel-art/gallery/user/${artwork.creator.id}`}
              className="mt-3 inline-flex items-center gap-2 text-lg text-slate-300 transition hover:text-white"
            >
              <UserIcon className="h-5 w-5" />
              by {artwork.creator.name}
            </Link>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Grid size', value: `${artwork.rows}×${artwork.cols}` },
              { label: 'Created', value: new Date(artwork.createdAt).toLocaleDateString() },
              { label: 'Pixels', value: artwork.rows * artwork.cols },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/60">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                {artwork.description && (
                  <p className="text-lg text-slate-600">{artwork.description}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadAsPNG}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-2xl border border-primary bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                  <ShareIcon className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-8">
              {renderPixelArt(artwork)}
            </div>

            {artwork.creator && (
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">More from this artist</p>
                <Link
                  href={`/interactives/pixel-art/gallery/user/${artwork.creator.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <UserIcon className="h-5 w-5" />
                  View {artwork.creator.name}&apos;s gallery
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
