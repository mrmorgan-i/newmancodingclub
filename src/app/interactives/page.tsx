import React from 'react';
import Link from 'next/link';
import {
  MusicalNoteIcon,
  PuzzlePieceIcon,
  PaintBrushIcon,
  CodeBracketSquareIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Container from '@/components/Container';

// Define the structure for an interactive activity
interface InteractiveActivity {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  tags: string[];
  difficulty: 'Beginner' | 'All Levels' | 'Intermediate';
  duration: string;
  status?: 'New' | 'Updated';
}

// Array of interactive activities
const activities: InteractiveActivity[] = [
  {
    id: 'drum-kit',
    title: 'Web Drum Kit',
    description: 'Create and record your own beats with this interactive drum machine. Play with keyboard or clicks!',
    href: '/interactives/drum-kit',
    icon: MusicalNoteIcon,
    bgColor: 'bg-pink-500',
    iconColor: 'text-pink-100',
    tags: ['Music', 'JavaScript', 'Audio API', 'Fun'],
    difficulty: 'All Levels',
    duration: '3-10 min',
    status: 'Updated',
  },
  {
    id: 'mad-libs',
    title: 'Coding Mad Libs',
    description: 'Fill in the blanks to create a hilarious coding-themed story. A fun way to play with words and code concepts.',
    href: '/interactives/mad-libs',
    icon: PuzzlePieceIcon,
    bgColor: 'bg-indigo-500',
    iconColor: 'text-indigo-100',
    tags: ['Language', 'Creativity', 'Beginner-Friendly'],
    difficulty: 'Beginner',
    duration: '2 min',
  },
  {
    id: 'color-matcher',
    title: 'Color Matcher Game',
    description: 'Test your memory and color recognition skills in this fun matching game. Can you beat the high score?',
    href: '/interactives/color-matcher',
    icon: PuzzlePieceIcon,
    bgColor: 'bg-purple-500',
    iconColor: 'text-purple-100',
    tags: ['Game', 'Memory', 'Challenge', 'All Levels'],
    difficulty: 'All Levels',
    duration: '5 min',
    status: 'New',
  },
  {
    id: 'http-errors',
    title: 'HTTP Errors Memory Game',
    description: 'Match HTTP error codes with their meanings in this fun and educational memory game.',
    href: '/interactives/http-errors',
    icon: PuzzlePieceIcon,
    bgColor: 'bg-rose-500',
    iconColor: 'text-rose-100',
    tags: ['Game', 'Memory', 'Learning', 'All Levels'],
    difficulty: 'Intermediate',
    duration: '6 min',
  },
  {
    id: 'pixel-art',
    title: 'Pixel Art',
    description: 'Create a masterpiece on a digital pixel canvas. Real-time fun! Will upgrade to allow collaboration soon!',
    href: '/interactives/pixel-art',
    icon: PaintBrushIcon,
    bgColor: 'bg-emerald-500',
    iconColor: 'text-emerald-100',
    tags: ['Art', 'Collaboration', 'Real-time', 'Visual'],
    difficulty: 'All Levels',
    duration: 'open ended',
  },
  {
    id: 'code-quiz',
    title: 'Code Snippet Quiz',
    description: 'Test your knowledge! Take a short quiz on code snippets and concepts.',
    href: '/interactives/code-quiz',
    icon: CodeBracketSquareIcon,
    bgColor: 'bg-sky-500',
    iconColor: 'text-sky-100',
    tags: ['Quiz', 'Learning', 'Challenge', 'All Levels'],
    difficulty: 'All Levels',
    duration: '8 min',
  },
];

export default function InteractivesPage() {
  const skillPathways = [
    {
      label: 'Quick wins',
      description: 'Fast icebreakers for meetings or study sessions.',
      items: ['mad-libs', 'color-matcher'],
    },
    {
      label: 'Level up',
      description: 'Keep your brain moving with short challenges.',
      items: ['http-errors', 'code-quiz'],
    },
    {
      label: 'Creative labs',
      description: 'Hands-on spaces to jam and build visuals.',
      items: ['drum-kit', 'pixel-art'],
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_50%)]" />
        <Container className="relative z-10 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Newman Coding Club Interactives
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold manrope leading-tight">
              Hands-on interactives built by students, for students.
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Learn a concept, test your reflexes, or make art in under ten minutes. Every interactive runs in the browser and works great on touch devices.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#interactive-grid"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-accent"
            >
              Start playing
            </a>
            <a
              href="mailto:newmancodingclub@gmail.com?subject=Interactive%20idea"
              className="inline-flex items-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-primary"
            >
              Suggest an idea
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: 'Interactives live', value: activities.length },
              { label: 'Avg. play time', value: '~6 min' },
              { label: 'Built by', value: 'Club members' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center shadow-inner shadow-slate-900/40"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 text-balance">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="interactive-grid" className="relative z-10 -mt-6 pb-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {skillPathways.map((pathway) => (
              <div key={pathway.label} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/30">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{pathway.label}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{pathway.description}</h3>
                <div className="mt-4 space-y-4">
                  {pathway.items.map((id) => {
                    const activity = activities.find((item) => item.id === id);
                    if (!activity) return null;
                    return (
                      <Link
                        href={activity.href}
                        key={activity.id}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/60"
                      >
                        <div className={`rounded-xl p-2 ${activity.bgColor}`}>
                          <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white group-hover:text-primary">{activity.title}</p>
                          <p className="text-sm text-slate-400">{activity.difficulty} • {activity.duration}</p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-slate-600 group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {activities.map((activity) => (
              <Link
                href={activity.href}
                key={activity.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/30 transition hover:-translate-y-1 hover:border-primary/60"
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 ${activity.bgColor}`}>
                    <activity.icon className={`h-6 w-6 ${activity.iconColor}`} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-primary">{activity.title}</h3>
                      {activity.status && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                          {activity.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{activity.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                  <span>{activity.difficulty}</span>
                  <span>{activity.duration}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-primary hover:text-primary"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Back to the main site
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
