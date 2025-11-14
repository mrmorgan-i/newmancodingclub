'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Container from '@/components/Container';
import { aiFields, advancedTools, AccessType } from '@/data/aiTools';
import { siteDetails } from '@/data/siteDetails';

const badgeStyles: Record<AccessType, string> = {
  FREE: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
  FREEMIUM: 'bg-amber-100 text-amber-900 border border-amber-200',
  STUDENT_DISCOUNT: 'bg-sky-100 text-sky-900 border border-sky-200',
};

const badgeCopy: Record<AccessType, string> = {
  FREE: 'Free',
  FREEMIUM: 'Freemium',
  STUDENT_DISCOUNT: 'Student discount',
};

const pageUrl = `${siteDetails.siteUrl.replace(/\/$/, '')}/resources/ai-tools`;
const shareTitle = 'AI Tool Finder — Newman Coding Club';
const shareText = 'Curated AI tools for Newman students. Save or share this resource.';

export default function AIToolsPage() {
  const [selectedField, setSelectedField] = useState(aiFields[0]?.slug ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTool, setCopiedTool] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fieldData = useMemo(
    () => aiFields.find((field) => field.slug === selectedField) ?? aiFields[0],
    [selectedField],
  );

  const filteredTools = useMemo(() => {
    if (!fieldData) return [];
    if (!searchQuery.trim()) return fieldData.tools;

    const term = searchQuery.trim().toLowerCase();
    return fieldData.tools.filter((tool) =>
      [tool.name, tool.description, tool.useCase, tool.examplePrompt]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [fieldData, searchQuery]);

  const handleCopyPrompt = async (toolName: string, prompt: string) => {
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedTool(toolName);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopiedTool(null), 2000);
    } catch (err) {
      console.error('Unable to copy prompt', err);
    }
  };

  const handleShareGuide = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: pageUrl,
        });
        setShareFeedback('Thanks for sharing!');
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Unable to open share dialog', error);
        setShareFeedback('Unable to open the share dialog.');
      }
    } else if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setShareFeedback('Link copied to clipboard.');
      } catch (error: unknown) {
        console.error('Unable to copy link', error);
        setShareFeedback('Sharing not supported in this browser.');
      }
    }

    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = setTimeout(() => setShareFeedback(null), 2500);
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  const heroDescriptionClass = isDarkMode ? 'text-slate-200' : 'text-slate-600';
  const formFieldClasses = clsx(
    'w-full rounded-2xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
    isDarkMode
      ? 'border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-400 focus:border-primary'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-primary',
  );
  const chipInactive = isDarkMode
    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-primary/60'
    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/60';
  const emptyStateClasses = isDarkMode
    ? 'rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center text-slate-300'
    : 'rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600';
  const cardContainer = isDarkMode
    ? 'rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/30 transition hover:border-primary/70'
    : 'rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition hover:border-primary/70';
  const exampleBox = isDarkMode
    ? 'mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4'
    : 'mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4';
  const advancedSectionBg = isDarkMode ? 'bg-slate-900' : 'bg-slate-100';
  const advancedCard = isDarkMode
    ? 'rounded-2xl border border-slate-800 bg-slate-950/60 p-5'
    : 'rounded-2xl border border-slate-200 bg-white p-5';
  const mutedText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const labelText = isDarkMode ? 'text-slate-200' : 'text-slate-600';

  return (
    <div
      className={clsx(
        'min-h-screen transition-colors',
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900',
      )}
    >
      <section
        className={clsx(
          'relative isolate overflow-hidden transition-colors',
          isDarkMode
            ? 'bg-gradient-to-b from-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100',
        )}
      >
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div
            className={clsx(
              'absolute -top-20 right-10 h-56 w-56 rounded-full blur-3xl',
              isDarkMode ? 'bg-primary' : 'bg-sky-200',
            )}
          />
          <div
            className={clsx(
              'absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl',
              isDarkMode ? 'bg-sky-500' : 'bg-primary/30',
            )}
          />
        </div>
        <Container className="relative z-10 pt-36 pb-16 lg:pt-44 lg:pb-24">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-4">
            AI Tools Guide
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold manrope mb-6">
            AI Tool Finder
          </h1>
          <p className={clsx('text-lg lg:text-xl max-w-3xl', heroDescriptionClass)}>
            Discover accessible AI tools students can start using today. Pick a field to get curated
            recommendations, example prompts, and quick links. Click the tool name to open it in a new tab.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleShareGuide}
              className="rounded-full border border-primary/50 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              Share this guide
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={clsx(
                'rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/60',
                isDarkMode
                  ? 'border border-slate-700 text-slate-200 hover:bg-slate-900/50'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-100',
              )}
            >
              Use {isDarkMode ? 'light' : 'dark'} mode
            </button>
            {shareFeedback && (
              <span
                className={clsx('text-sm', isDarkMode ? 'text-slate-300' : 'text-slate-600')}
                role="status"
                aria-live="polite"
              >
                {shareFeedback}
              </span>
            )}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,3fr]">
            <div className="space-y-3">
              <label
                htmlFor="field-selector"
                className={clsx('text-sm font-semibold uppercase tracking-wide', labelText)}
              >
                Select your field
              </label>
              <select
                id="field-selector"
                className={formFieldClasses}
                value={fieldData?.slug ?? ''}
                onChange={(event) => setSelectedField(event.target.value)}
              >
                {aiFields.map((field) => (
                  <option key={field.slug} value={field.slug}>
                    {field.field}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="tool-search"
                className={clsx('text-sm font-semibold uppercase tracking-wide', labelText)}
              >
                Filter within this field
              </label>
              <input
                id="tool-search"
                type="search"
                placeholder="Search by tool, use case, or prompt"
                className={formFieldClasses}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {aiFields.map((field) => (
              <button
                key={field.slug}
                type="button"
                onClick={() => {
                  setSelectedField(field.slug);
                  setSearchQuery('');
                }}
                className={clsx(
                  'rounded-full border px-4 py-1 text-sm transition',
                  selectedField === field.slug
                    ? 'border-primary bg-primary text-white'
                    : chipInactive,
                )}
              >
                {field.field}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {fieldData?.field}
            </p>
            <h2
              className={clsx(
                'text-3xl font-bold manrope mt-2',
                isDarkMode ? 'text-white' : 'text-slate-900',
              )}
            >
              Tools for {fieldData?.field}
            </h2>
            <p className={clsx('mt-3 text-lg', mutedText)}>{fieldData?.blurb}</p>
          </div>

          {filteredTools.length === 0 ? (
            <div className={emptyStateClasses}>
              <p className="text-lg font-semibold manrope">No tools match that search.</p>
              <p className="mt-2 text-base">
                Clear the search box or pick a different field to explore more options.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredTools.map((tool) => (
                <article key={tool.name} className={cardContainer}>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        'text-2xl font-semibold hover:text-primary',
                        isDarkMode ? 'text-white' : 'text-slate-900',
                      )}
                    >
                      {tool.name}
                    </a>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyles[tool.access]}`}
                    >
                      {badgeCopy[tool.access]}
                    </span>
                  </div>
                  <p className={clsx('mt-3 text-base', mutedText)}>{tool.description}</p>
                  <p
                    className={clsx(
                      'mt-4 text-sm',
                      isDarkMode ? 'text-slate-400' : 'text-slate-500',
                    )}
                  >
                    <span
                      className={clsx(
                        'font-semibold',
                        isDarkMode ? 'text-slate-200' : 'text-slate-700',
                      )}
                    >
                      Use case:
                    </span>{' '}
                    {tool.useCase}
                  </p>

                  <div className={exampleBox}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={clsx(
                          'text-xs font-semibold uppercase tracking-wide',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500',
                        )}
                      >
                        Example prompt
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(tool.name, tool.examplePrompt)}
                        className="text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary/80"
                      >
                        {copiedTool === tool.name ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p
                      className={clsx(
                        'font-mono text-sm',
                        isDarkMode ? 'text-slate-200' : 'text-slate-700',
                      )}
                    >
                      {tool.examplePrompt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className={clsx(advancedSectionBg, 'py-16 transition-colors')}>
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Advanced tools
          </p>
          <h2
            className={clsx(
              'text-3xl font-bold manrope mt-2',
              isDarkMode ? 'text-white' : 'text-slate-900',
            )}
          >
            Paid / research-only picks
          </h2>
          <p className={clsx('mt-3 max-w-2xl text-lg', mutedText)}>
            These options require funding, lab credentials, or paid research seats but are worth
            exploring if you&apos;re building something ambitious.
          </p>

          <ul className="mt-8 grid gap-5 lg:grid-cols-2">
            {advancedTools.map((tool) => (
              <li key={tool.name} className={advancedCard}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        'text-xl font-semibold hover:text-primary',
                        isDarkMode ? 'text-white' : 'text-slate-900',
                      )}
                    >
                      {tool.name}
                    </a>
                    <p className={clsx('mt-2 text-base', mutedText)}>{tool.description}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                    Paid
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}
