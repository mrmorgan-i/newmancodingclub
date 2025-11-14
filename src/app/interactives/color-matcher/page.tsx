"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ColorCodeItem {
  id: number;
  code: string;
  display: string;
}

const initialColorCodes: ColorCodeItem[] = [
  { id: 1, code: 'rgb(255, 0, 0)', display: '#FF0000' },
  { id: 2, code: 'rgb(0, 255, 0)', display: '#00FF00' },
  { id: 3, code: 'rgb(0, 0, 255)', display: '#0000FF' },
  { id: 4, code: 'rgb(255, 255, 0)', display: '#FFFF00' },
  { id: 5, code: 'rgb(255, 0, 255)', display: '#FF00FF' },
  { id: 6, code: 'rgb(0, 255, 255)', display: '#00FFFF' },
  { id: 7, code: 'rgb(0, 0, 0)', display: '#000000' },
  { id: 8, code: 'rgb(255, 255, 255)', display: '#FFFFFF' },
  { id: 9, code: 'rgb(128, 128, 128)', display: '#808080' },
  { id: 10, code: 'rgb(255, 165, 0)', display: '#FFA500' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const difficulties = [
  { id: 'zen', label: 'Zen', time: 90, blurb: 'Extra time to memorize swatches.' },
  { id: 'standard', label: 'Challenge', time: 60, blurb: 'Balanced pace with light pressure.' },
  { id: 'speedrun', label: 'Speedrun', time: 45, blurb: 'Rapid-fire matching. Trust your gut.' },
];

export default function ColorMatcherPage() {
  const [score, setScore] = useState(0);
  const [selectedCodeId, setSelectedCodeId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const perfectScore = initialColorCodes.length * 10;
  const [difficultyId, setDifficultyId] = useState(difficulties[1].id);

  const activeDifficulty = useMemo(
    () => difficulties.find((option) => option.id === difficultyId) ?? difficulties[1],
    [difficultyId],
  );

  const [timeLeft, setTimeLeft] = useState(activeDifficulty.time);
  const [shuffledCodes, setShuffledCodes] = useState<ColorCodeItem[]>([]);
  const [shuffledColors, setShuffledColors] = useState<ColorCodeItem[]>([]);

  const initializeGame = useCallback(() => {
    setScore(0);
    setSelectedCodeId(null);
    setSelectedColorId(null);
    setMatchedIds([]);
    setGameOver(false);
    setTimeLeft(activeDifficulty.time);
    setShuffledCodes(shuffleArray(initialColorCodes));
    setShuffledColors(shuffleArray(initialColorCodes));
  }, [activeDifficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameOver) {
      setBestScore((prev) => Math.max(prev, score));
    }
  }, [gameOver, score]);

  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (!gameOver && matchedIds.length === initialColorCodes.length) {
      setGameOver(true);
    }
  }, [matchedIds, gameOver]);

  useEffect(() => {
    if (selectedCodeId === null || selectedColorId === null || gameOver) return;

    if (selectedCodeId === selectedColorId) {
      if (!matchedIds.includes(selectedCodeId)) {
        setScore((prev) => prev + 10);
        setMatchedIds((prev) => [...prev, selectedCodeId]);
      }
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }

    const timer = setTimeout(() => {
      setSelectedCodeId(null);
      setSelectedColorId(null);
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCodeId, selectedColorId, gameOver, matchedIds]);

  const handleCodeClick = (id: number) => {
    if (gameOver || matchedIds.includes(id) || selectedCodeId === id) return;
    setSelectedCodeId(id);
  };

  const handleColorClick = (id: number) => {
    if (gameOver || matchedIds.includes(id) || selectedColorId === id) return;
    setSelectedColorId(id);
  };

  return (
    <section className="pb-16">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Visual sprint</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">Code &amp; Color Matcher</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Pair each hex value with its swatch before the clock hits zero. Steady hands earn streaks, but wrong guesses shave points.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Score', value: score },
              { label: 'Time left', value: `${timeLeft}s` },
              { label: 'Matches found', value: `${matchedIds.length}/${initialColorCodes.length}` },
              { label: 'Best run', value: bestScore },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/60">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="space-y-5 lg:w-1/3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</p>
                <div className="mt-3 space-y-2">
                  {difficulties.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDifficultyId(option.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        option.id === difficultyId
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-sm text-slate-500">{option.time}s • {option.blurb}</p>
                    </button>
                  ))}
                </div>
              </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-700">How to play</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Tap a hex value, then its matching swatch.</li>
                  <li>Correct matches add 10 points, misses subtract 5.</li>
                  <li>Clear all pairs before the timer expires.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-slate-500">
                <p className="text-xs uppercase tracking-wide text-slate-400">Perfect score</p>
                <p className="text-lg font-semibold text-slate-700">{perfectScore} pts</p>
                <p className="text-xs">Earned when you match every pair without a single miss.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <button
                  onClick={initializeGame}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  Restart round
                </button>
                {gameOver && (
                  <p className="mt-2 text-center text-sm font-semibold text-emerald-500">
                    {matchedIds.length === initialColorCodes.length ? 'Perfect clear!' : 'Time is up'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                    style={{ width: `${(matchedIds.length / initialColorCodes.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

            <div className="space-y-6 lg:w-2/3">
              {gameOver ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <h2 className="text-3xl font-bold text-slate-800">
                    {matchedIds.length === initialColorCodes.length ? 'Flawless victory!' : 'Round complete'}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Final score <span className="font-semibold text-slate-900">{score}</span>
                  </p>
                  <button
                    onClick={initializeGame}
                    className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-accent"
                  >
                    Play again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-center text-lg font-semibold text-slate-700">Match these hex values</h3>
                    <div className="mt-4 space-y-3">
                      {shuffledCodes.map((item) => (
                        <button
                          key={`code-${item.id}`}
                          onClick={() => handleCodeClick(item.id)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 font-mono text-sm transition ${
                            matchedIds.includes(item.id)
                              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                              : selectedCodeId === item.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40'
                          }`}
                          disabled={matchedIds.includes(item.id)}
                        >
                          <span>{item.display}</span>
                          {matchedIds.includes(item.id) && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                              <CheckCircleIcon className="h-4 w-4" />
                              Matched
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-center text-lg font-semibold text-slate-700">To these swatches</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {shuffledColors.map((item) => (
                        <button
                          key={`color-${item.id}`}
                          onClick={() => handleColorClick(item.id)}
                          className={`relative aspect-square rounded-xl border transition ${
                            matchedIds.includes(item.id)
                              ? 'border-slate-200 opacity-40'
                              : selectedColorId === item.id
                                ? 'border-4 border-primary scale-105'
                                : 'border-slate-200 hover:border-primary/60'
                          }`}
                          style={{ backgroundColor: item.code }}
                          aria-label={`Color swatch ${item.display}`}
                          disabled={matchedIds.includes(item.id)}
                        >
                          {matchedIds.includes(item.id) && (
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-600">
                              ×
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
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
