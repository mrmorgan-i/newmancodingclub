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
  },
];

export default function InteractivesPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold manrope mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-500">
              Interactive Activities
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Explore fun and engaging coding activities built by and for the Newman Coding Club. Click on an activity to try it out!
          </p>
        </div>

        {/* Grid of Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {activities.map((activity) => (
            <Link href={activity.href} key={activity.id} legacyBehavior>
              <a className={`group block p-6 rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-sky-500/30 ${activity.href === '#' ? 'bg-slate-800 cursor-not-allowed opacity-70' : 'bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50'}`}>
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${activity.bgColor} ${activity.href === '#' ? 'opacity-60' : ''}`}>
                    <activity.icon className={`w-7 h-7 ${activity.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold manrope text-sky-300 group-hover:text-sky-200 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 text-sm mb-3">
                      {activity.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 text-xs rounded-full font-medium ${activity.href === '#' ? 'bg-slate-700 text-slate-400' : 'bg-sky-700 text-sky-200 group-hover:bg-sky-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {activity.href !== '#' && (
                    <ChevronRightIcon className="w-6 h-6 text-slate-500 group-hover:text-sky-400 transition-transform duration-300 group-hover:translate-x-1 self-center" />
                  )}
                </div>
                {activity.href === '#' && (
                   <p className="text-xs text-amber-400 mt-3 text-right font-semibold">Coming Soon!</p>
                )}
              </a>
            </Link>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="mt-16 text-center">
          <Link href="/" legacyBehavior>
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-sky-100 bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </a>
          </Link>
        </div>
      </div>
    </main>
  );
}
