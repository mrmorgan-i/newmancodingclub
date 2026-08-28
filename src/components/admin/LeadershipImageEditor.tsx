'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import {
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineArrowUturnLeft,
  HiOutlineArrowUturnRight,
  HiOutlineXMark,
} from 'react-icons/hi2';

import { cropHeadshot } from '@/components/admin/imageCrop';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function LeadershipImageEditor({
  imageSource,
  onCancel,
  onConfirm,
}: {
  imageSource: string;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleCropComplete = useCallback((_crop: Area, pixels: Area) => {
    setCropPixels(pixels);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !processing) {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key !== 'Tab') return;
    const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])',
    );
    if (!controls?.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const rotate = (amount: number) => {
    setRotation((current) => normalizeRotation(current + amount));
  };

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const apply = async () => {
    if (!cropPixels || processing) return;
    setProcessing(true);
    setProcessingError(null);
    try {
      await onConfirm(await cropHeadshot(imageSource, cropPixels, rotation));
    } catch (error) {
      setProcessingError(
        error instanceof Error ? error.message : 'The photo could not be prepared. Try again.',
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#122629]/70 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !processing) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="headshot-editor-title"
        aria-describedby="headshot-editor-description"
        onKeyDown={handleKeyDown}
        className="flex max-h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[min(860px,calc(100dvh-40px))] sm:max-w-3xl sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-5 border-b border-[#dce6e4] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 id="headshot-editor-title" className="text-lg font-bold text-[#203438] sm:text-xl">
              Frame the headshot
            </h2>
            <p
              id="headshot-editor-description"
              className="mt-1 text-sm leading-5 text-[#687c7f]"
            >
              Drag the photo inside the circle. That framing is what visitors will see.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onCancel}
            disabled={processing}
            aria-label="Close photo editor"
            className="grid size-9 shrink-0 place-items-center rounded-full text-[#5d7073] hover:bg-[#eef3f2] hover:text-[#25393c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95] disabled:opacity-50"
          >
            <HiOutlineXMark className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative h-[min(52dvh,470px)] min-h-72 bg-[#182426] sm:min-h-96">
            <Cropper
              image={imageSource}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              restrictPosition
              keyboardStep={4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={(next) => setRotation(normalizeRotation(next))}
              onCropComplete={handleCropComplete}
              classes={{ cropAreaClassName: 'ncc-headshot-crop-area' }}
              mediaProps={{ alt: '' }}
              cropperProps={{ 'aria-label': 'Headshot crop area' }}
            />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Drag to reposition
            </div>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <RangeControl
              label="Zoom"
              valueLabel={`${Math.round(zoom * 100)}%`}
              value={zoom}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              onChange={setZoom}
              leading={<HiOutlineMinus className="size-4" />}
              trailing={<HiOutlinePlus className="size-4" />}
            />

            <RangeControl
              label="Rotation"
              valueLabel={`${Math.round(rotation)}°`}
              value={rotation}
              min={-180}
              max={180}
              step={1}
              onChange={setRotation}
              leading={<span className="text-xs font-semibold">−180°</span>}
              trailing={<span className="text-xs font-semibold">180°</span>}
            />

            <div className="flex flex-wrap items-center gap-2">
              <EditorButton onClick={() => rotate(-90)}>
                <HiOutlineArrowUturnLeft className="size-4" />
                <span>
                  <span className="max-[340px]:hidden">Rotate </span>left
                </span>
              </EditorButton>
              <EditorButton onClick={() => rotate(90)}>
                <HiOutlineArrowUturnRight className="size-4" />
                <span>
                  <span className="max-[340px]:hidden">Rotate </span>right
                </span>
              </EditorButton>
              <button
                type="button"
                onClick={reset}
                className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#607477] hover:bg-[#eef3f2] hover:text-[#2b464a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
              >
                <HiOutlineArrowPath className="size-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-[#dce6e4] bg-[#fbfcfc] px-5 py-4 sm:px-6">
          {processingError && (
            <p className="mr-auto text-sm font-semibold text-[#a84338]" role="alert">
              {processingError}
            </p>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-md border border-[#c8d7d5] bg-white px-4 py-2.5 text-sm font-semibold text-[#40575a] hover:border-[#91b9b7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void apply()}
            disabled={!cropPixels || processing}
            className="inline-flex min-w-32 items-center justify-center gap-2 rounded-md bg-[#2f858b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#286f74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] disabled:cursor-wait disabled:opacity-60"
          >
            {processing ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/45 border-t-white" />
            ) : (
              <HiOutlineCheck className="size-4" />
            )}
            {processing ? 'Preparing…' : 'Use photo'}
          </button>
        </footer>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  leading,
  max,
  min,
  onChange,
  step,
  trailing,
  value,
  valueLabel,
}: {
  label: string;
  leading: React.ReactNode;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  trailing: React.ReactNode;
  value: number;
  valueLabel: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <label htmlFor={`headshot-${label.toLowerCase()}`} className="font-semibold text-[#344b4e]">
          {label}
        </label>
        <output className="tabular-nums text-[#65787b]">{valueLabel}</output>
      </div>
      <div className="flex items-center gap-3 text-[#6e8184]">
        <span className="grid min-w-5 place-items-center" aria-hidden="true">
          {leading}
        </span>
        <input
          id={`headshot-${label.toLowerCase()}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dce7e5] accent-[#2f858b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f8f95]"
        />
        <span className="grid min-w-5 place-items-center" aria-hidden="true">
          {trailing}
        </span>
      </div>
    </div>
  );
}

function EditorButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-[#c8d7d5] bg-white px-3 py-2 text-sm font-semibold text-[#40575a] hover:border-[#91b9b7] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95]"
    >
      {children}
    </button>
  );
}

function normalizeRotation(rotation: number): number {
  const normalized = ((rotation + 180) % 360 + 360) % 360 - 180;
  return normalized === -180 ? 180 : normalized;
}
