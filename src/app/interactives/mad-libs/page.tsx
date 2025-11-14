"use client";

import React, { useState, useMemo } from 'react';

type PlaceholderType = 'noun' | 'verb' | 'adjective' | 'tech' | 'plural' | 'adverb';

interface MadLibPlaceholder {
  key: string;
  label: string;
  type: PlaceholderType;
}

interface MadLibTemplate {
  id: string;
  title: string;
  instruction: string;
  placeholders: MadLibPlaceholder[];
  generateStory: (inputs: Record<string, string>) => string;
}

const storyTemplates: MadLibTemplate[] = [
  {
    id: 'adventure',
    title: 'My First Coding Adventure',
    instruction: 'Fill in the blanks to recap the most chaotic debug session of your life.',
    placeholders: [
      { key: 'adjective1', label: 'Adjective', type: 'adjective' },
      { key: 'techTerm1', label: 'Tech term', type: 'tech' },
      { key: 'verb1', label: 'Verb ending in -ing', type: 'verb' },
      { key: 'plural1', label: 'Plural noun', type: 'plural' },
      { key: 'techTerm2', label: 'Another tech term', type: 'tech' },
      { key: 'adjective2', label: 'Adjective', type: 'adjective' },
      { key: 'noun1', label: 'Noun', type: 'noun' },
      { key: 'verb2', label: 'Verb (past tense)', type: 'verb' },
      { key: 'techTerm3', label: 'Programming language', type: 'tech' },
      { key: 'adjective3', label: 'Adjective', type: 'adjective' },
    ],
    generateStory: (inputs) => {
      const withArticle = (word = '') => {
        if (!word) return 'a';
        return /^[aeiou]/i.test(word.trim()) ? `an ${word}` : `a ${word}`;
      };

      return `Last night I had ${withArticle(inputs.adjective1)} dream about coding. I was wrestling with ${withArticle(inputs.techTerm1)} while ${inputs.verb1} alongside ${inputs.plural1}.
Suddenly ${withArticle(inputs.techTerm2)} burst into the room; it was so ${inputs.adjective2} that my ${inputs.noun1} almost ${inputs.verb2}. Thankfully my ${inputs.techTerm3} skills kicked in and I deployed ${withArticle(inputs.adjective3)} fix. Crisis averted!`;
    },
  },
  {
    id: 'hackathon',
    title: 'Hackathon Heist',
    instruction: 'Describe your dream hackathon team-up with dramatic flair.',
    placeholders: [
      { key: 'adjective1', label: 'Adjective', type: 'adjective' },
      { key: 'noun1', label: 'Noun', type: 'noun' },
      { key: 'techTerm1', label: 'Tech buzzword', type: 'tech' },
      { key: 'verb1', label: 'Verb', type: 'verb' },
      { key: 'plural1', label: 'Plural noun', type: 'plural' },
      { key: 'adverb1', label: 'Adverb', type: 'adverb' },
      { key: 'techTerm2', label: 'Framework or tool', type: 'tech' },
      { key: 'adjective2', label: 'Adjective', type: 'adjective' },
      { key: 'verb2', label: 'Verb ending in -ing', type: 'verb' },
    ],
    generateStory: (inputs) => {
      const withArticle = (word = '') => {
        if (!word) return 'a';
        return /^[aeiou]/i.test(word.trim()) ? `an ${word}` : `a ${word}`;
      };

      return `Our ${inputs.adjective1} hackathon team packed ${withArticle(inputs.noun1)}, a stack of ${inputs.techTerm1}, and enough caffeine to ${inputs.verb1} ${inputs.plural1}.
We ${inputs.adverb1} wired everything through ${inputs.techTerm2} and presented ${withArticle(inputs.adjective2)} demo while ${inputs.verb2} to the theme music. Judges cried. Victory secured.`;
    },
  },
];

const randomWords: Record<PlaceholderType, string[]> = {
  noun: ['keyboard', 'server', 'coffee', 'bug'],
  verb: ['refactoring', 'sprinted', 'patched', 'debugging'],
  adjective: ['chaotic', 'sparkly', 'mysterious', 'unstoppable'],
  tech: ['API gateway', 'neural net', 'TypeScript', 'Docker swarm'],
  plural: ['merge conflicts', 'stickers', 'deploys', 'tabs'],
  adverb: ['dramatically', 'quietly', 'wildly', 'heroically'],
};

const getRandomWord = (type: PlaceholderType) => {
  const pool = randomWords[type];
  return pool[Math.floor(Math.random() * pool.length)];
};

export default function MadLibsPage() {
  const [storyId, setStoryId] = useState(storyTemplates[0].id);
  const activeTemplate = useMemo(
    () => storyTemplates.find((template) => template.id === storyId) ?? storyTemplates[0],
    [storyId],
  );

  const initialInputs = useMemo(
    () =>
      activeTemplate.placeholders.reduce((acc, placeholder) => {
        acc[placeholder.key] = '';
        return acc;
      }, {} as Record<string, string>),
    [activeTemplate],
  );

  const [inputs, setInputs] = useState<Record<string, string>>(initialInputs);
  const [story, setStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filledCount = Object.values(inputs).filter((value) => value.trim() !== '').length;

  const handleChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const allFilled = activeTemplate.placeholders.every((placeholder) => inputs[placeholder.key]?.trim());
    if (!allFilled) {
      setError('Please fill in every prompt to unlock the story.');
      return;
    }
    setStory(activeTemplate.generateStory(inputs));
  };

  const handleReset = () => {
    setInputs(initialInputs);
    setStory(null);
    setError(null);
  };

  const autofill = () => {
    const randomInputs = activeTemplate.placeholders.reduce((acc, placeholder) => {
      acc[placeholder.key] = getRandomWord(placeholder.type);
      return acc;
    }, {} as Record<string, string>);
    setInputs(randomInputs);
    setError(null);
  };

  return (
    <section className="pb-16">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Creative warm-up</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">Coding Mad Libs</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Fill in prompts to craft the ultimate Newman Coding Club meme.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Story mode', value: activeTemplate.title },
              { label: 'Prompts filled', value: `${filledCount}/${activeTemplate.placeholders.length}` },
              { label: 'Autofill ideas', value: 'Random words' },
              { label: 'Mood', value: story ? 'Story ready' : 'Drafting' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-base font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/60">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="space-y-5 lg:w-1/3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Story template</p>
                <div className="mt-3 space-y-2">
                  {storyTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setStoryId(template.id);
                        setStory(null);
                        setInputs(
                          template.placeholders.reduce((acc, placeholder) => {
                            acc[placeholder.key] = '';
                            return acc;
                          }, {} as Record<string, string>),
                        );
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        template.id === storyId
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold">{template.title}</p>
                      <p className="text-sm text-slate-500">{template.instruction}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">Need inspiration?</p>
                <p className="mt-2">
                  Hit <span className="font-semibold">Auto-fill</span> for random words, then tweak them to match your latest coding drama.
                </p>
                <button
                  onClick={autofill}
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  Auto-fill with chaos
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {!story ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTemplate.placeholders.map((placeholder) => (
                    <div key={placeholder.key}>
                      <label className="mb-1 block text-sm font-semibold text-slate-600">
                        {placeholder.label} <span className="text-xs font-normal text-slate-400">({placeholder.type})</span>
                      </label>
                      <input
                        type="text"
                        value={inputs[placeholder.key] || ''}
                        onChange={(event) => handleChange(placeholder.key, event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder={`Provide a ${placeholder.type}`}
                      />
                    </div>
                  ))}
                  {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-accent"
                  >
                    Generate my story
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-2xl font-semibold text-slate-800">{activeTemplate.title}</h2>
                    <p className="mt-4 whitespace-pre-line text-lg text-slate-700">{story}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      Write another
                    </button>
                    <button
                      onClick={() => navigator?.clipboard?.writeText(story)}
                      className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
