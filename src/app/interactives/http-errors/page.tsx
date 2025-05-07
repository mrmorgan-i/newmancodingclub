"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Interface for the card data
interface ErrorCodeCard {
  id: string;        
  name: string;      
  color: string;     
  uniqueId: number; 
}

// The initial set of error codes to be used for the cards
const baseErrorCodes = [
  { id: '404', name: 'Not Found', color: 'bg-red-500' },
  { id: '500', name: 'Server Error', color: 'bg-orange-600' },
  { id: '403', name: 'Forbidden', color: 'bg-yellow-500' },
  { id: '401', name: 'Unauthorized', color: 'bg-purple-500' },
  { id: '400', name: 'Bad Request', color: 'bg-blue-500' },
  { id: '503', name: 'Service Unavailable', color: 'bg-green-500' },
  { id: '301', name: 'Moved Permanently', color: 'bg-pink-500' },
  { id: '418', name: 'I\'m a teapot', color: 'bg-teal-500' },
];

export default function MemoryGamePage() {
  const [cards, setCards] = useState<ErrorCodeCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const initializeGame = useCallback(() => {
    const gameCardsSetup = [...baseErrorCodes, ...baseErrorCodes]
      .map((errorCode, index) => ({
        ...errorCode,
        uniqueId: index,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCardsSetup);
    setFlippedIndices([]);
    setSolvedIds([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startTime && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (!startTime || gameOver) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, gameOver]);

  const handleCardClick = (index: number) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (flippedIndices.length === 2 || flippedIndices.includes(index) || solvedIds.includes(cards[index].id)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      const firstCard = cards[newFlippedIndices[0]];
      const secondCard = cards[newFlippedIndices[1]];

      if (firstCard.id === secondCard.id) {
        setSolvedIds(prevSolved => [...prevSolved, firstCard.id]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  useEffect(() => {
    if (baseErrorCodes.length > 0 && solvedIds.length === baseErrorCodes.length) {
      setGameOver(true);
    }
  }, [solvedIds, baseErrorCodes.length]);

  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-sky-400 manrope">
          HTTP Error Code Memory Game
        </h1>

        <div className="flex flex-col sm:flex-row justify-around items-center mb-6 bg-slate-700 p-4 rounded-lg shadow-md gap-4">
          <div className="text-center">
            <p className="text-lg font-medium text-slate-300">Moves</p>
            <p className="text-3xl font-bold text-emerald-400">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-slate-300">Time</p>
            <p className="text-3xl font-bold text-amber-400">{formatTime(elapsedTime)}</p>
          </div>
        </div>

        {gameOver && (
          <div className="text-center py-8">
            <div className="bg-slate-700 border border-emerald-500 p-6 rounded-lg mb-6 shadow-lg">
              <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Congratulations!
              </h2>
              <p className="text-lg text-slate-200 mb-1">You&apos;ve matched all the error codes!</p>
              <p className="text-xl font-semibold text-slate-100">
                Final Time: {formatTime(elapsedTime)} | Total Moves: {moves}
              </p>
            </div>
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-150 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Play Again
            </button>
          </div>
        )}

        {!gameOver && (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            {cards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index);
              const isSolved = solvedIds.includes(card.id);
              const showFace = isFlipped || isSolved;

              return (
                <div
                  key={card.uniqueId}
                  className={`w-full aspect-[3/4] sm:aspect-square rounded-lg shadow-md transition-transform duration-300 ease-in-out cursor-pointer perspective
                    ${isSolved && showFace ? 'opacity-60 cursor-default' : ''} 
                  `}
                  onClick={() => handleCardClick(index)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card Face: Rotates into view when showFace is true */}
                  <div className={`absolute w-full h-full rounded-lg flex flex-col items-center justify-center p-2 text-center text-white ${card.color} backface-hidden transition-transform duration-500
                    ${showFace ? 'rotate-y-0' : 'rotate-y-180'} 
                  `}>
                    <p className="text-2xl sm:text-3xl font-bold">{card.id}</p>
                    <p className="text-xs sm:text-sm mt-1">{card.name}</p>
                  </div>
                  {/* Card Back: Rotates into view when showFace is false */}
                  <div className={`absolute w-full h-full rounded-lg bg-slate-600 hover:bg-slate-500 flex items-center justify-center backface-hidden transition-transform duration-500
                    ${showFace ? 'rotate-y-180' : 'rotate-y-0'}
                  `}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-1/2 h-1/2 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Click the cards to reveal the HTTP error codes. Match all the pairs to win the game!
          </p>
        </div>
        <style jsx global>{`
          .perspective { perspective: 1000px; }
          .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
          /* These rotate classes are now applied directly to face/back for clarity */
          .rotate-y-180 { transform: rotateY(180deg); }
          .rotate-y-0 { transform: rotateY(0deg); }
        `}</style>
      </div>
    </div>
  );
}
