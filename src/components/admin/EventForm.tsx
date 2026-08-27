'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';

import { initialActionResult } from '@/lib/actionResult';
import { saveEventAction } from '@/modules/events/actions';

export interface EditableEvent {
  id: number;
  title: string;
  description: string;
  kind: 'single' | 'weekly';
  status: 'draft' | 'published' | 'archived';
  date: string | null;
  startDate: string | null;
  endDate: string | null;
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
  timeZone: string;
  location: string;
  registrationUrl: string | null;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
}

export default function EventForm({
  event,
  onSuccessReset = false,
}: {
  event?: EditableEvent;
  onSuccessReset?: boolean;
}) {
  const [state, action] = useActionState(saveEventAction, initialActionResult);
  const [kind, setKind] = useState<'single' | 'weekly'>(event?.kind ?? 'single');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success' && onSuccessReset) {
      formRef.current?.reset();
      setKind('single');
    }
  }, [onSuccessReset, state.status]);

  return (
    <form ref={formRef} action={action} className="space-y-6">
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Event title" error={state.fieldErrors?.title}>
          <input
            name="title"
            type="text"
            defaultValue={event?.title}
            className={inputClass}
            placeholder="Casual Coding"
            required
          />
        </Field>

        <Field
          className="sm:col-span-2"
          label="Description"
          error={state.fieldErrors?.description}
        >
          <textarea
            name="description"
            defaultValue={event?.description}
            className={`${inputClass} min-h-28 resize-y`}
            placeholder="What should students expect?"
            required
          />
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>Schedule type</legend>
          <div className="mt-2 grid grid-cols-2 border border-[#cbd9d7] bg-[#f4f8f7] p-1">
            {(['single', 'weekly'] as const).map((value) => (
              <label
                key={value}
                className={`cursor-pointer px-4 py-2.5 text-center text-sm font-bold transition ${
                  kind === value
                    ? 'bg-[#172327] text-white shadow-sm'
                    : 'text-[#607477] hover:text-[#172327]'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="kind"
                  value={value}
                  checked={kind === value}
                  onChange={() => setKind(value)}
                />
                {value === 'single' ? 'One-time event' : 'Weekly series'}
              </label>
            ))}
          </div>
        </fieldset>

        {kind === 'single' ? (
          <Field label="Date" hint="Leave blank to show TBD." error={state.fieldErrors?.date}>
            <input name="date" type="date" defaultValue={event?.date ?? ''} className={inputClass} />
          </Field>
        ) : (
          <>
            <Field label="First meeting" error={state.fieldErrors?.startDate}>
              <input
                name="startDate"
                type="date"
                defaultValue={event?.startDate ?? ''}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Final meeting" error={state.fieldErrors?.endDate}>
              <input
                name="endDate"
                type="date"
                defaultValue={event?.endDate ?? ''}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Meeting day" error={state.fieldErrors?.dayOfWeek}>
              <select
                name="dayOfWeek"
                defaultValue={event?.dayOfWeek ?? 4}
                className={inputClass}
              >
                {WEEKDAYS.map((day, index) => (
                  <option key={day} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        <Field label="Starts" error={state.fieldErrors?.startTime}>
          <input
            name="startTime"
            type="time"
            defaultValue={trimTime(event?.startTime) || '19:00'}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Ends" error={state.fieldErrors?.endTime}>
          <input
            name="endTime"
            type="time"
            defaultValue={trimTime(event?.endTime) || '20:00'}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Location" error={state.fieldErrors?.location}>
          <input
            name="location"
            type="text"
            defaultValue={event?.location}
            className={inputClass}
            placeholder="Library Learning Commons"
            required
          />
        </Field>
        <Field label="Visibility" error={state.fieldErrors?.status}>
          <select
            name="status"
            defaultValue={event?.status === 'published' ? 'published' : 'draft'}
            className={inputClass}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>

        <Field
          className="sm:col-span-2"
          label="Registration link"
          hint="Optional. Include https://"
          error={state.fieldErrors?.registrationUrl}
        >
          <input
            name="registrationUrl"
            type="url"
            defaultValue={event?.registrationUrl ?? ''}
            className={inputClass}
            placeholder="https://forms.office.com/..."
          />
        </Field>

        <Field
          className="sm:col-span-2"
          label="Tags"
          hint="Comma-separated, up to 12."
          error={state.fieldErrors?.tags}
        >
          <input
            name="tags"
            type="text"
            defaultValue={event?.tags.join(', ')}
            className={inputClass}
            placeholder="Coding, Social, Projects"
          />
        </Field>

        <Field
          label="Display order"
          hint="Lower numbers win when dates match."
          error={state.fieldErrors?.sortOrder}
        >
          <input
            name="sortOrder"
            type="number"
            min="0"
            max="9999"
            defaultValue={event?.sortOrder ?? 0}
            className={inputClass}
          />
        </Field>

        <label className="flex items-start gap-3 border border-[#c8d7d5] bg-[#f4f8f7] p-4 sm:self-end">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={event?.isFeatured}
            className="mt-0.5 size-4 accent-[#3e9ba2]"
          />
          <span>
            <span className="block text-sm font-bold text-[#31474a]">Featured event</span>
            <span className="mt-0.5 block text-xs leading-5 text-[#748689]">
              Gives this event the emphasized public card treatment.
            </span>
          </span>
        </label>

        <input type="hidden" name="timeZone" value={event?.timeZone ?? 'America/Chicago'} />
      </div>

      {state.status !== 'idle' && (
        <div
          className={`flex items-start gap-2 border px-4 py-3 text-sm ${
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
        <SubmitButton label={event ? 'Save changes' : 'Create event'} />
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[#3e9ba2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#327f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

const inputClass =
  'w-full border border-[#c8d7d5] bg-white px-3.5 py-2.5 text-sm text-[#172327] outline-none transition placeholder:text-[#9aa8aa] focus:border-[#3e9ba2] focus:ring-2 focus:ring-[#3e9ba2]/15';
const labelClass = 'text-sm font-bold text-[#31474a]';
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

function trimTime(value?: string): string {
  return value?.slice(0, 5) ?? '';
}
