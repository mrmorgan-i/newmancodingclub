"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface ErrorCodeCard {
  id: string;
  name: string;
  color: string;
  uniqueId: number;
}

const errorLibrary = [
  { id: '404', name: 'Not Found', color: 'bg-rose-500' },
  { id: '500', name: 'Server Error', color: 'bg-orange-500' },
  { id: '403', name: 'Forbidden', color: 'bg-yellow-500' },
  { id: '401', name: 'Unauthorized', color: 'bg-purple-500' },
  { id: '400', name: 'Bad Request', color: 'bg-sky-500' },
  { id: '503', name: 'Service Unavailable', color: 'bg-emerald-500' },
  { id: '301', name: 'Moved Permanently', color: 'bg-pink-500' },
  { id: '418', name: "I'm a teapot", color: 'bg-teal-500' },
  { id: '429', name: 'Too Many Requests', color: 'bg-indigo-500' },
  { id: '204', name: 'No Content', color: 'bg-cyan-500' },
];

const decks = [
  { id: 'classic', label: 'Classic 8 pairs', size: 8, blurb: 'Quick memorization run.' },
  { id: 'extended', label: 'Extended 10 pairs', size: 10, blurb: 'More codes to learn.' },
];

export default function MemoryGamePage() {
  const [cards, setCards] = useState<ErrorCodeCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [deckId, setDeckId] = useState(decks[0].id);
  const [isPeeking, setIsPeeking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const activeDeck = useMemo(
    () => errorLibrary.slice(0, decks.find((deck) => deck.id === deckId)?.size ?? decks[0].size),
    [deckId],
  );

  const initializeGame = useCallback(() => {
    const setup = [...activeDeck, ...activeDeck]
      .map((card, index) => ({ ...card, uniqueId: index }))
      .sort(() => Math.random() - 0.5);

    setCards(setup);
    setFlippedIndices([]);
    setSolvedIds([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsPeeking(false);
    setHintsUsed(0);
  }, [activeDeck]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startTime && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, gameOver]);

  const handleCardClick = (index: number) => {
    if (!startTime) setStartTime(() => Date.now());
    if (
      isPeeking ||
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      solvedIds.includes(cards[index]?.id ?? '')
    ) {
      return;
    }

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards[nextFlipped[0]];
      const secondCard = cards[nextFlipped[1]];

      if (firstCard.id === secondCard.id) {
        setSolvedIds((prev) => [...prev, firstCard.id]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  useEffect(() => {
    if (activeDeck.length > 0 && solvedIds.length === activeDeck.length) {
      setGameOver(true);
    }
  }, [solvedIds, activeDeck.length]);

  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePeek = () => {
    if (isPeeking || gameOver || cards.length === 0) return;
    setHintsUsed((prev) => prev + 1);
    setIsPeeking(true);
    setTimeout(() => setIsPeeking(false), 1500);
  };

  const stats = [
    { label: 'Pairs cleared', value: `${solvedIds.length}/${activeDeck.length}` },
    { label: 'Moves', value: moves },
    { label: 'Time', value: formatTime(elapsedTime) },
    { label: 'Hints used', value: hintsUsed },
  ];
  const perfectMoves = activeDeck.length;

  return (
    <section className="pb-16">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-200">Protocol practice</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">HTTP Error Memory Lab</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Memorize the most common response codes by matching them faster than your teammates. Flip two cards to find a pair;
            finish the board with the fewest moves.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Board size</p>
                <div className="mt-3 space-y-2">
                  {decks.map((deck) => (
                    <button
                      key={deck.id}
                      onClick={() => setDeckId(deck.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        deck.id === deckId
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold">{deck.label}</p>
                      <p className="text-sm text-slate-500">{deck.blurb}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">Tips</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Use Peek sparingly; it costs a hint.</li>
                  <li>Reset anytime to train from scratch.</li>
                </ul>
              </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={initializeGame}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Reset board
              </button>
              <button
                onClick={handlePeek}
                disabled={isPeeking || gameOver}
                className={`flex-1 rounded-2xl border px-4 py-3 font-semibold transition ${
                  isPeeking || gameOver
                    ? 'cursor-not-allowed border-slate-200 text-slate-400'
                    : 'border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300'
                }`}
              >
                {isPeeking ? 'Revealing…' : 'Peek (hint)'}
              </button>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-wide text-slate-400">Perfect run</p>
              <p className="text-lg font-semibold text-slate-800">{perfectMoves} moves</p>
              <p>Match every card without a single miss.</p>
            </div>
          </div>
            </div>

            <div className="lg:w-2/3">
              {gameOver && (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <h2 className="text-3xl font-bold text-emerald-700">Protocol mastered!</h2>
                  <p className="mt-2 text-emerald-800">
                    Final time {formatTime(elapsedTime)} • Moves {moves} • Hints {hintsUsed}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {cards.map((card, index) => {
                  const isFlipped = flippedIndices.includes(index);
                  const isSolved = solvedIds.includes(card.id);
                  const showFace = isFlipped || isSolved || isPeeking;

                  return (
                    <button
                      type="button"
                      key={card.uniqueId}
                      className={`relative aspect-[3/4] rounded-xl border border-slate-200 transition-transform duration-300 ${
                        isSolved ? 'opacity-60' : 'hover:-translate-y-1'
                      }`}
                      onClick={() => handleCardClick(index)}
                      disabled={isSolved || isPeeking}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl p-3 text-center text-white ${card.color} backface-hidden transition-transform duration-500 ${
                          showFace ? 'rotate-y-0' : 'rotate-y-180'
                        }`}
                      >
                        <p className="text-2xl font-bold">{card.id}</p>
                        <p className="text-xs mt-1">{card.name}</p>
                      </div>
                      <div
                        className={`absolute inset-0 rounded-xl bg-slate-100 flex items-center justify-center backface-hidden transition-transform duration-500 ${
                          showFace ? 'rotate-y-180' : 'rotate-y-0'
                        }`}
                      >
                        <div className="h-8 w-8 rounded-full border-2 border-dashed border-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                Tap cards to reveal HTTP responses. Match every pair to complete the incident response play-through.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </section>
  );
}
