"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { TrashIcon, ArrowDownTrayIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

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

const createInitialGrid = (size: number): string[][] =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => defaultColor));

export default function PixelArtPage() {
  const [gridSize, setGridSize] = useState(gridPresets[1].id);
  const [grid, setGrid] = useState<string[][]>(() => createInitialGrid(gridSize));
  const [selectedColor, setSelectedColor] = useState<string>(palettes[0]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    setGrid(createInitialGrid(gridSize));
  }, [gridSize]);

  useEffect(() => {
    const handlePointerUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  const paintPixel = useCallback((rowIndex: number, colIndex: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[rowIndex][colIndex] = selectedColor;
      return next;
    });
  }, [selectedColor]);

  const handlePointerDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex);
  };

  const handlePointerEnter = (rowIndex: number, colIndex: number) => {
    if (!isDrawing) return;
    paintPixel(rowIndex, colIndex);
  };

  const handleClearGrid = () => {
    setGrid(createInitialGrid(gridSize));
  };

  const copyDesign = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(JSON.stringify({ gridSize, pixels: grid }));
  };

  const paintedPixels = grid.flat().filter((color) => color !== defaultColor).length;

  return (
    <section className="pb-16">
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
              { label: 'Grid size', value: `${gridSize}×${gridSize}` },
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
                      onClick={() => setGridSize(preset.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        preset.id === gridSize
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold">{preset.label}</p>
                    </button>
                  ))}
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
                    <ArrowDownTrayIcon className="h-4 w-4" /> Copy layout
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div
                className="grid border-2 border-slate-200 shadow-xl"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
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
                    {gridSize * gridSize}. Copy the layout to paste into shared docs or Next.js canvases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
