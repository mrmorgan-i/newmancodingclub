'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownTrayIcon, CursorArrowRaysIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSession } from '@/lib/auth/client';
import PixelArtNav from '@/components/PixelArtNav';

const defaultColor = '#FFFFFF';
const palettes = [
  '#111827',
  '#F43F5E',
  '#F97316',
  '#FACC15',
  '#22C55E',
  '#0EA5E9',
  '#6366F1',
  '#A855F7',
  '#EC4899',
  '#E5E7EB',
];

const gridPresets = [
  { id: 12, label: '12×12 (quick doodle)' },
  { id: 16, label: '16×16 (club favorite)' },
  { id: 20, label: '20×20 (detailed)' },
];

const DRAFT_STORAGE_KEY = 'pixel-art:draft';
const REDIRECT_KEY = 'auth:redirect';

type PixelArtDraft = {
  rows: number;
  cols: number;
  grid: string[][];
  title?: string;
  description?: string;
  isPublic?: boolean;
};

const createInitialGrid = (rows: number, cols?: number): string[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols ?? rows }, () => defaultColor));

export default function PixelArtPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;
  const isAuthenticated = Boolean(currentUser);

  const [rows, setRows] = useState(gridPresets[1].id);
  const [cols, setCols] = useState(gridPresets[1].id);
  const [grid, setGrid] = useState<string[][]>(() => createInitialGrid(rows, cols));
  const [selectedColor, setSelectedColor] = useState<string>(palettes[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [customRowsInput, setCustomRowsInput] = useState('');
  const [customColsInput, setCustomColsInput] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isPublicInput, setIsPublicInput] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const skipNextResetRef = useRef(false);
  const hasRestoredDraftRef = useRef(false);

  useEffect(() => {
    if (skipNextResetRef.current) {
      skipNextResetRef.current = false;
      return;
    }
    setGrid(createInitialGrid(rows, cols));
  }, [rows, cols]);

  useEffect(() => {
    const handlePointerUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  const paintPixel = useCallback(
    (rowIndex: number, colIndex: number) => {
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[rowIndex][colIndex] = selectedColor;
        return next;
      });
    },
    [selectedColor],
  );

  const handlePointerDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex);
  };

  const handlePointerEnter = (rowIndex: number, colIndex: number) => {
    if (!isDrawing) return;
    paintPixel(rowIndex, colIndex);
  };

  const handleClearGrid = () => {
    setGrid(createInitialGrid(rows, cols));
  };

  const persistDraft = useCallback(
    (overrides?: Partial<PixelArtDraft>) => {
      if (typeof window === 'undefined') return;
      const payload: PixelArtDraft = {
        rows,
        cols,
        grid,
        title: titleInput,
        description: descriptionInput,
        isPublic: isPublicInput,
        ...overrides,
      };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    },
    [rows, cols, grid, titleInput, descriptionInput, isPublicInput],
  );

  const restoreDraft = useCallback((draft: PixelArtDraft) => {
    skipNextResetRef.current = true;
    setRows(draft.rows);
    setCols(draft.cols);
    setGrid(draft.grid);
    setTitleInput(draft.title ?? '');
    setDescriptionInput(draft.description ?? '');
    setIsPublicInput(draft.isPublic ?? true);
    setIsSaveModalOpen(true);
  }, []);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (hasRestoredDraftRef.current) return;
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return;
    try {
      const draft = JSON.parse(stored) as PixelArtDraft;
      hasRestoredDraftRef.current = true;
      restoreDraft(draft);
    } catch (error) {
      console.error('Failed to restore draft:', error);
    }
  }, [isAuthenticated, restoreDraft]);

  const applyCustomSize = () => {
    const parsedRows = Number(customRowsInput);
    const parsedCols = Number(customColsInput || customRowsInput);

    if (!Number.isInteger(parsedRows) || !Number.isInteger(parsedCols)) {
      setCustomError('Enter whole numbers for rows and columns.');
      return;
    }

    if (parsedRows < 6 || parsedRows > 40 || parsedCols < 6 || parsedCols > 40) {
      setCustomError('Pick values between 6 and 40.');
      return;
    }

    setCustomError(null);
    skipNextResetRef.current = false;
    setRows(parsedRows);
    setCols(parsedCols);
  };

  const copyDesign = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(JSON.stringify({ rows, cols, pixels: grid }));
  };

  const paintedPixels = useMemo(
    () => grid.flat().filter((color) => color !== defaultColor).length,
    [grid],
  );

  const downloadAsPNG = () => {
    const cellSize = 20;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        context.fillStyle = color || defaultColor;
        context.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      });
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pixel-art-${rows}x${cols}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleSaveClick = () => {
    persistDraft();
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(REDIRECT_KEY, '/interactives/pixel-art');
      }
      router.push('/auth/signin?redirectTo=/interactives/pixel-art');
      return;
    }
    setSaveError(null);
    setSaveStatus('idle');
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setSaveStatus('saving');
    setSaveError(null);
    persistDraft({
      title: titleInput,
      description: descriptionInput,
      isPublic: isPublicInput,
    });

    try {
      const response = await fetch('/api/pixel-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput,
          description: descriptionInput,
          rows,
          cols,
          grid,
          isPublic: isPublicInput,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Unable to save artwork.');
      }

      setSaveStatus('success');
      clearDraft();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(REDIRECT_KEY);
      }
      setTimeout(() => {
        setIsSaveModalOpen(false);
        setSaveStatus('idle');
      }, 1200);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save artwork.');
    }
  };

  const closeModal = () => {
    setIsSaveModalOpen(false);
    setSaveStatus('idle');
  };

  return (
    <section className="pb-16">
      <PixelArtNav />
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-fuchsia-200">Creative corner</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">Pixel Art Lab</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Paint with your mouse or finger, adjust the grid,
            and copy the layout when you&apos;re done.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Grid size', value: `${rows}×${cols}` },
              { label: 'Palette colors', value: palettes.length },
              { label: 'Pixels filled', value: paintedPixels },
              { label: 'Output', value: 'JSON clipboard' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/60">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="space-y-5 lg:w-1/3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Canvas size</p>
                <div className="mt-3 space-y-2">
                  {gridPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setRows(preset.id);
                        setCols(preset.id);
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        preset.id === rows && preset.id === cols
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold">{preset.label}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-700">Custom size</p>
                  <p>Pick any rectangular canvas from 6 to 40 cells.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={6}
                      max={40}
                      value={customRowsInput}
                      onChange={(event) => setCustomRowsInput(event.target.value)}
                      placeholder="Rows"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="number"
                      min={6}
                      max={40}
                      value={customColsInput}
                      onChange={(event) => setCustomColsInput(event.target.value)}
                      placeholder="Cols"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={applyCustomSize}
                      className="col-span-2 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      Apply custom size
                    </button>
                  </div>
                  {customError && <p className="text-xs text-rose-500">{customError}</p>}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Palette</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {palettes.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 rounded-lg border-2 transition ${
                        selectedColor === color ? 'border-primary scale-110' : 'border-slate-200 hover:border-primary/60'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                  <button
                    onClick={() => setSelectedColor(defaultColor)}
                    className={`flex h-10 items-center justify-center rounded-lg border-2 px-2 text-xs font-semibold transition ${
                      selectedColor === defaultColor ? 'border-primary text-primary' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    Eraser
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">Pro tip</p>
                <p className="mt-2">
                  Hold and drag to paint continuous strokes. Works on trackpads and touch screens thanks to the new pointer lock.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleClearGrid}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <TrashIcon className="h-4 w-4" /> Clear grid
                  </span>
                </button>
                <button
                  onClick={copyDesign}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <DocumentDuplicateIcon className="h-4 w-4" /> Copy layout
                  </span>
                </button>
                <button
                  onClick={downloadAsPNG}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4" /> Download PNG
                  </span>
                </button>
                <button
                  onClick={handleSaveClick}
                  className="flex-1 rounded-2xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Save to gallery
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div
                className="grid border-2 border-slate-200 shadow-xl"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  touchAction: 'none',
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((pixelColor, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="aspect-square border border-slate-100"
                      style={{ backgroundColor: pixelColor }}
                      onMouseDown={() => handlePointerDown(rowIndex, colIndex)}
                      onMouseEnter={() => handlePointerEnter(rowIndex, colIndex)}
                      onTouchStart={() => handlePointerDown(rowIndex, colIndex)}
                      onTouchMove={(event) => {
                        const target = document.elementFromPoint(
                          event.touches[0].clientX,
                          event.touches[0].clientY,
                        ) as HTMLElement | null;
                        if (!target) return;
                        const coords = target.dataset.pixel?.split('|');
                        if (!coords) return;
                        handlePointerEnter(Number(coords[0]), Number(coords[1]));
                      }}
                      data-pixel={`${rowIndex}|${colIndex}`}
                    />
                  )),
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-3">
                  <CursorArrowRaysIcon className="h-5 w-5 text-slate-400" />
                  <p>
                    Painted pixels:{' '}
                    <span className="font-semibold text-slate-800">{paintedPixels}</span> /{' '}
                    {rows * cols}. Copy the layout to paste into shared docs or Next.js canvases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Save to gallery</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 transition hover:text-slate-700"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Title <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                  placeholder="e.g. Campus skyline at night"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={descriptionInput}
                  onChange={(event) => setDescriptionInput(event.target.value)}
                  placeholder="What inspired this piece?"
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={isPublicInput}
                  onChange={(event) => setIsPublicInput(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                Make this artwork visible in the public gallery.
              </label>
              {saveError && <p className="text-sm text-rose-500">{saveError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saveStatus === 'saving'}
                  className="flex-1 rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saveStatus === 'saving'
                    ? 'Saving...'
                    : saveStatus === 'success'
                      ? 'Saved!'
                      : 'Save artwork'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
