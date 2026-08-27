'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';

import { initialActionResult } from '@/lib/actionResult';
import { createInvitationAction } from '@/modules/admin/invitationActions';

export default function InviteAdminForm() {
  const [state, action] = useActionState(
    createInvitationAction,
    initialActionResult,
  );

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="text-sm font-bold text-[#31474a]">Email address</span>
        <input
          name="email"
          type="email"
          required
          placeholder="secretary@newmanu.edu"
          className="mt-2 w-full border border-[#c8d7d5] bg-white px-3.5 py-2.5 text-sm text-[#172327] outline-none transition placeholder:text-[#9aa8aa] focus:border-[#3e9ba2] focus:ring-2 focus:ring-[#3e9ba2]/15"
        />
        {state.fieldErrors?.email?.map((message) => (
          <span key={message} className="mt-1.5 block text-xs font-semibold text-[#a84338]">
            {message}
          </span>
        ))}
      </label>

      <fieldset>
        <legend className="text-sm font-bold text-[#31474a]">Access level</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="cursor-pointer border border-[#c8d7d5] bg-white p-4 has-checked:border-[#3e9ba2] has-checked:bg-[#edf8f6]">
            <input type="radio" name="role" value="editor" defaultChecked className="sr-only" />
            <span className="block text-sm font-bold text-[#25383b]">Editor</span>
            <span className="mt-1 block text-xs leading-5 text-[#6a7d80]">
              Can manage club content and schedules.
            </span>
          </label>
          <label className="cursor-pointer border border-[#c8d7d5] bg-white p-4 has-checked:border-[#3e9ba2] has-checked:bg-[#edf8f6]">
            <input type="radio" name="role" value="owner" className="sr-only" />
            <span className="block text-sm font-bold text-[#25383b]">Owner</span>
            <span className="mt-1 block text-xs leading-5 text-[#6a7d80]">
              Can also invite and manage administrators.
            </span>
          </label>
        </div>
      </fieldset>

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
          {state.message}
        </div>
      )}

      <div className="flex justify-end">
        <InviteButton />
      </div>
    </form>
  );
}

function InviteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[#3e9ba2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#327f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send invitation'}
    </button>
  );
}
