'use client';

import { useState } from 'react';

export default function CopyCommand({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-3">
      {label ? <p className="mb-1 text-sm font-medium text-slate-600">{label}</p> : null}
      <div className="flex items-stretch overflow-hidden rounded-lg bg-slate-900">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre px-4 py-3 font-mono text-sm text-slate-100">
          {text}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 border-l border-slate-700 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
