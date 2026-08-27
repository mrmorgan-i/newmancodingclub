'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';

import { initialActionResult } from '@/lib/actionResult';
import { acceptInvitationAction } from '@/modules/admin/invitationActions';

export default function AcceptAdminInviteForm({ token }: { token: string }) {
  const [state, action] = useActionState(
    acceptInvitationAction,
    initialActionResult,
  );

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="token" value={token} />
      {state.status !== 'idle' && (
        <div
          className={`mb-4 flex items-start gap-2 border px-4 py-3 text-sm ${
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

      {state.status === 'success' ? (
        <Link
          href="/admin"
          className="block w-full rounded-full bg-[#172327] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#263b3f]"
        >
          Open the club desk
        </Link>
      ) : (
        <AcceptButton />
      )}
    </form>
  );
}

function AcceptButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#3e9ba2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#327f85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9ba2] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Accepting…' : 'Accept invitation'}
    </button>
  );
}
