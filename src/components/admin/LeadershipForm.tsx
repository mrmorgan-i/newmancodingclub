'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';

import LeadershipHeadshotField, {
  type HeadshotValue,
} from '@/components/admin/LeadershipHeadshotField';
import { initialActionResult } from '@/lib/actionResult';
import { saveLeadershipMemberAction } from '@/modules/leadership/actions';

export interface EditableLeadershipMember {
  id: number;
  name: string;
  role: string;
  kind: 'officer' | 'advisor';
  bio: string;
  email: string | null;
  imageId: string | null;
  imageUrl: string | null;
  status: 'draft' | 'published' | 'archived';
  sortOrder: number;
  termStart: string | null;
  termEnd: string | null;
}

export default function LeadershipForm({
  member,
  onSuccessReset = false,
}: {
  member?: EditableLeadershipMember;
  onSuccessReset?: boolean;
}) {
  const [state, action] = useActionState(saveLeadershipMemberAction, initialActionResult);
  const [headshot, setHeadshot] = useState<HeadshotValue | null>(
    member?.imageId && member.imageUrl
      ? { id: member.imageId, publicUrl: member.imageUrl }
      : null,
  );
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success' && onSuccessReset) {
      formRef.current?.reset();
      setHeadshot(null);
    }
  }, [onSuccessReset, state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-6">
      {member && <input type="hidden" name="id" value={member.id} />}
      <input type="hidden" name="imageId" value={headshot?.id ?? ''} />

      <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
        <LeadershipHeadshotField
          value={headshot}
          error={state.fieldErrors?.imageId?.[0]}
          onChange={setHeadshot}
          onUploadingChange={setUploading}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" error={state.fieldErrors?.name}>
            <input
              name="name"
              type="text"
              defaultValue={member?.name}
              className={inputClass}
              placeholder="Jordan Smith"
              required
            />
          </Field>

          <Field label="Role" error={state.fieldErrors?.role}>
            <input
              name="role"
              type="text"
              defaultValue={member?.role}
              className={inputClass}
              placeholder="President"
              required
            />
          </Field>

          <Field label="Leadership group" error={state.fieldErrors?.kind}>
            <select name="kind" defaultValue={member?.kind ?? 'officer'} className={inputClass}>
              <option value="officer">Student officer</option>
              <option value="advisor">Advisor (including spiritual companion)</option>
            </select>
          </Field>

          <Field label="Visibility" error={state.fieldErrors?.status}>
            <select
              name="status"
              defaultValue={member?.status === 'published' ? 'published' : 'draft'}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>

          <Field className="sm:col-span-2" label="Bio" error={state.fieldErrors?.bio}>
            <textarea
              name="bio"
              defaultValue={member?.bio}
              className={`${inputClass} min-h-28 resize-y`}
              placeholder="A short introduction for the public website."
              required
            />
          </Field>

          <Field
            className="sm:col-span-2"
            label="Contact email"
            hint="Optional"
            error={state.fieldErrors?.email}
          >
            <input
              name="email"
              type="email"
              defaultValue={member?.email ?? ''}
              className={inputClass}
              placeholder="name@newmanu.edu"
            />
          </Field>

          <Field label="Term starts" hint="Optional" error={state.fieldErrors?.termStart}>
            <input
              name="termStart"
              type="date"
              defaultValue={member?.termStart ?? ''}
              className={inputClass}
            />
          </Field>

          <Field label="Term ends" hint="Optional" error={state.fieldErrors?.termEnd}>
            <input
              name="termEnd"
              type="date"
              defaultValue={member?.termEnd ?? ''}
              className={inputClass}
            />
          </Field>

          <p className="-mt-1 text-xs leading-5 text-[#6f8184] sm:col-span-2">
            Published records appear during their term, then move to Past Leadership after the
            end date. Leave both dates blank for ongoing roles.
          </p>

          <Field
            label="Display order"
            hint="Lower numbers appear first"
            error={state.fieldErrors?.sortOrder}
          >
            <input
              name="sortOrder"
              type="number"
              min="0"
              max="9999"
              defaultValue={member?.sortOrder ?? 0}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {state.status !== 'idle' && (
        <div
          className={`flex items-start gap-2 rounded-md border px-4 py-3 text-sm ${
            state.status === 'success'
              ? 'border-[#b9dcd7] bg-[#edf8f6] text-[#246f70]'
              : 'border-[#efc7c1] bg-[#fff4f2] text-[#9a4036]'
          }`}
          aria-live="polite"
        >
          {state.status === 'success' ? (
            <HiOutlineCheckCircle className="mt-0.5 size-5 shrink-0" />
          ) : (
            <HiOutlineExclamationCircle className="mt-0.5 size-5 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton
          disabled={uploading}
          label={member ? 'Save changes' : 'Create leadership record'}
        />
      </div>
    </form>
  );
}

function Field({
  children,
  className,
  error,
  hint,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string[];
  hint?: string;
  label: string;
}) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      {hint && <span className="ml-2 text-xs font-normal text-[#7a8a8d]">{hint}</span>}
      <span className="mt-2 block">{children}</span>
      {error?.map((message) => (
        <span key={message} className="mt-1.5 block text-xs font-semibold text-[#a84338]">
          {message}
        </span>
      ))}
    </label>
  );
}

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded-md bg-[#2f858b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#286f74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

const inputClass =
  'w-full rounded-md border border-[#c8d7d5] bg-white px-3.5 py-2.5 text-sm text-[#172327] outline-none placeholder:text-[#9aa8aa] focus:border-[#3e9ba2] focus:ring-2 focus:ring-[#3e9ba2]/15';
const labelClass = 'text-sm font-semibold text-[#31474a]';
