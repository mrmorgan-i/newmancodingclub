'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HiOutlineArrowUpTray,
  HiOutlineClipboard,
  HiOutlinePencilSquare,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineUser,
} from 'react-icons/hi2';

import LeadershipImageEditor from '@/components/admin/LeadershipImageEditor';
import { uploadLeadershipHeadshot } from '@/lib/uploadthing';

export interface HeadshotValue {
  id: string;
  publicUrl: string;
}

interface EditorSource {
  url: string;
  shouldRevoke: boolean;
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export default function LeadershipHeadshotField({
  error,
  onChange,
  onUploadingChange,
  value,
}: {
  error?: string;
  onChange: (value: HeadshotValue | null) => void;
  onUploadingChange: (uploading: boolean) => void;
  value: HeadshotValue | null;
}) {
  const [editorSource, setEditorSource] = useState<EditorSource | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const closeEditor = useCallback(() => {
    setEditorSource((current) => {
      if (current?.shouldRevoke) URL.revokeObjectURL(current.url);
      return null;
    });
  }, []);

  useEffect(() => closeEditor, [closeEditor]);

  const openFile = useCallback((file: File) => {
    const validationError = validateImage(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setEditorSource((current) => {
      if (current?.shouldRevoke) URL.revokeObjectURL(current.url);
      return { url: URL.createObjectURL(file), shouldRevoke: true };
    });
  }, []);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!fieldRef.current?.contains(document.activeElement)) return;
      const file = imageFromTransfer(event.clipboardData);
      if (!file) return;
      event.preventDefault();
      openFile(file);
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [openFile]);

  const editExisting = async () => {
    if (!value || loadingExisting || uploading) return;
    setLoadingExisting(true);
    setUploadError(null);
    try {
      const response = await fetch(value.publicUrl);
      if (!response.ok) throw new Error('Image fetch failed.');
      const blob = await response.blob();
      const validationError = validateImage(
        new File([blob], 'current-headshot.jpg', { type: blob.type || 'image/jpeg' }),
      );
      if (validationError) throw new Error(validationError);
      setEditorSource({ url: URL.createObjectURL(blob), shouldRevoke: true });
    } catch {
      setUploadError('The current photo could not be opened. Upload a replacement instead.');
    } finally {
      setLoadingExisting(false);
    }
  };

  const pasteFromClipboard = async () => {
    setUploadError(null);
    if (!navigator.clipboard?.read) {
      setUploadError('Clipboard images are not supported here. Drop or choose a photo instead.');
      return;
    }

    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => SUPPORTED_IMAGE_TYPES.includes(type));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        openFile(new File([blob], 'pasted-headshot', { type: blob.type }));
        return;
      }
      setUploadError('There is no JPG, PNG, or WebP image on the clipboard.');
    } catch {
      setUploadError('Clipboard access was blocked. Drop or choose a photo instead.');
    }
  };

  const uploadEditedPhoto = async (file: File) => {
    setUploading(true);
    onUploadingChange(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const uploaded = await uploadLeadershipHeadshot({
        file,
        onProgress: setUploadProgress,
      });
      onChange(uploaded);
      setUploadProgress(100);
      closeEditor();
    } catch {
      const message = 'The edited photo could not be uploaded. Try again.';
      setUploadError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  const chooseFile = () => {
    if (!uploading && !loadingExisting) fileInputRef.current?.click();
  };

  return (
    <div ref={fieldRef} className="w-full max-w-xs">
      <span className="text-sm font-semibold text-[#31474a]">Headshot</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        disabled={uploading}
        aria-label="Choose a headshot image file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) openFile(file);
        }}
      />

      <button
        type="button"
        onClick={chooseFile}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = imageFromTransfer(event.dataTransfer);
          if (file) openFile(file);
          else setUploadError('Drop a JPG, PNG, or WebP image here.');
        }}
        disabled={uploading || loadingExisting}
        aria-label={value ? 'Choose a replacement headshot' : 'Choose a headshot'}
        className={`group relative mt-2 block aspect-square w-full overflow-hidden rounded-xl border-2 bg-[#eef3f2] text-left transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#2f8f95] disabled:cursor-wait disabled:opacity-70 ${
          dragging
            ? 'border-[#2f858b] bg-[#e2f2f0] shadow-[0_0_0_5px_rgba(62,155,162,0.12)]'
            : 'border-dashed border-[#b8cdca] hover:border-[#65a9aa] hover:bg-[#e8f1ef]'
        }`}
      >
        {value ? (
          <>
            <Image
              src={value.publicUrl}
              alt="Current leadership headshot"
              fill
              sizes="320px"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/65 via-black/5 to-transparent pb-4 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Choose a new photo
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-white text-[#3d8b91] shadow-sm">
              {dragging ? <HiOutlinePhoto className="size-6" /> : <HiOutlineUser className="size-6" />}
            </span>
            <span className="mt-4 text-sm font-bold text-[#344d50]">
              {dragging ? 'Drop to edit' : 'Drop or choose a photo'}
            </span>
            <span className="mt-1 text-xs leading-5 text-[#748689]">You’ll crop it before upload</span>
          </span>
        )}

        {uploading && (
          <span className="absolute inset-0 flex flex-col items-center justify-center bg-[#102326]/80 px-6 text-center text-white backdrop-blur-sm">
            <span className="size-7 animate-spin rounded-full border-[3px] border-white/35 border-t-white" />
            <span className="mt-3 text-sm font-semibold">Uploading {Math.round(uploadProgress)}%</span>
            <span className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <span
                className="block h-full rounded-full bg-white transition-[width]"
                style={{ width: `${uploadProgress}%` }}
              />
            </span>
          </span>
        )}
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        {value && (
          <button
            type="button"
            onClick={() => void editExisting()}
            disabled={uploading || loadingExisting}
            className={controlClass}
          >
            {loadingExisting ? (
              <span className="size-4 animate-spin rounded-full border-2 border-[#617477]/30 border-t-[#397d82]" />
            ) : (
              <HiOutlinePencilSquare className="size-4" />
            )}
            {loadingExisting ? 'Opening…' : 'Edit crop'}
          </button>
        )}
        <button
          type="button"
          onClick={chooseFile}
          disabled={uploading || loadingExisting}
          className={controlClass}
        >
          <HiOutlineArrowUpTray className="size-4" />
          {value ? 'Replace' : 'Choose'}
        </button>
        <button
          type="button"
          onClick={() => void pasteFromClipboard()}
          disabled={uploading || loadingExisting}
          className={controlClass}
        >
          <HiOutlineClipboard className="size-4" />
          Paste
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={uploading}
            aria-label="Remove headshot"
            className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-[#80514b] hover:bg-[#fbefed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a84338] disabled:opacity-50"
          >
            <HiOutlineTrash className="size-4" />
            Remove
          </button>
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-[#748689]">
        JPG, PNG, or WebP · up to 8 MB · saved as a square
      </p>
      {(uploadError || error) && (
        <p className="mt-2 text-xs font-semibold leading-5 text-[#a84338]" aria-live="polite">
          {uploadError ?? error}
        </p>
      )}

      {editorSource && (
        <LeadershipImageEditor
          imageSource={editorSource.url}
          onCancel={closeEditor}
          onConfirm={uploadEditedPhoto}
        />
      )}
    </div>
  );
}

function validateImage(file: File): string | null {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG, or WebP image.';
  if (file.size > MAX_IMAGE_BYTES) return 'Choose an image smaller than 8 MB.';
  return null;
}

function imageFromTransfer(data: DataTransfer | null): File | null {
  if (!data) return null;
  for (const item of data.items) {
    if (item.kind === 'file' && SUPPORTED_IMAGE_TYPES.includes(item.type)) {
      const file = item.getAsFile();
      if (file) return file;
    }
  }
  return Array.from(data.files).find((file) => SUPPORTED_IMAGE_TYPES.includes(file.type)) ?? null;
}

const controlClass =
  'inline-flex items-center gap-2 rounded-md border border-[#c8d7d5] bg-white px-2.5 py-2 text-sm font-semibold text-[#40575a] hover:border-[#7ab8bb] hover:text-[#26777d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f8f95] disabled:cursor-wait disabled:opacity-50';
