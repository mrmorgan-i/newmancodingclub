"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Interface for color code items
interface ColorCodeItem {
  id: number;
  code: string; 
  display: string;
}

const initialColorCodes: ColorCodeItem[] = [
  { id: 1, code: 'rgb(255, 0, 0)', display: '#FF0000' },       // Red
  { id: 2, code: 'rgb(0, 255, 0)', display: '#00FF00' },       // Green
  { id: 3, code: 'rgb(0, 0, 255)', display: '#0000FF' },       // Blue
  { id: 4, code: 'rgb(255, 255, 0)', display: '#FFFF00' },     // Yellow
  { id: 5, code: 'rgb(255, 0, 255)', display: '#FF00FF' },     // Magenta/Fuchsia
  { id: 6, code: 'rgb(0, 255, 255)', display: '#00FFFF' },     // Cyan/Aqua
  { id: 7, code: 'rgb(0, 0, 0)', display: '#000000' },         // Black
  { id: 8, code: 'rgb(255, 255, 255)', display: '#FFFFFF' },   // White
  { id: 9, code: 'rgb(128, 128, 128)', display: '#808080' },   // Gray (Challenging)
  { id: 10, code: 'rgb(255, 165, 0)', display: '#FFA500' },  // Orange (Challenging)
];

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]; // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ColorMatcherPage() {
  const [score, setScore] = useState(0);
  const [selectedCodeId, setSelectedCodeId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Game duration: 60 seconds

  const [shuffledCodes, setShuffledCodes] = useState<ColorCodeItem[]>([]);
  const [shuffledColors, setShuffledColors] = useState<ColorCodeItem[]>([]);

  // Initialize or restart the game
  const initializeGame = useCallback(() => {
    setScore(0);
    setSelectedCodeId(null);
    setSelectedColorId(null);
    setMatchedIds([]);
    setGameOver(false);
    setTimeLeft(60); // Reset timer to 60 seconds
    setShuffledCodes(shuffleArray(initialColorCodes));
    setShuffledColors(shuffleArray(initialColorCodes));
  }, []);

  // Effect to initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Effect for the game timer
  useEffect(() => {
    if (gameOver) return; // Stop timer if game is already over

    if (timeLeft <= 0) {
      setGameOver(true); // End game if time runs out
      return;
    }

    // Set a timeout to decrement timeLeft every second
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [timeLeft, gameOver]);

  // Effect to check for win condition (all items matched)
  useEffect(() => {
    // Only check if the game is not already over and there are items to match
    if (!gameOver && initialColorCodes.length > 0 && matchedIds.length === initialColorCodes.length) {
      setGameOver(true); // All items matched, game over (win)
    }
  }, [matchedIds, initialColorCodes.length, gameOver]); // Dependencies for win condition check

  // Effect to handle matching logic when selections are made
  useEffect(() => {
    // Only process if both selections are made and the game is not over
    if (selectedCodeId === null || selectedColorId === null || gameOver) {
      return;
    }

    if (selectedCodeId === selectedColorId) {
      // Correct match: only update score and matchedIds if this item hasn't been matched yet
      if (!matchedIds.includes(selectedCodeId)) {
        setScore((prevScore) => prevScore + 10);
        setMatchedIds((prevMatchedIds) => [...prevMatchedIds, selectedCodeId]);
      }
    } else {
      // Incorrect match
      setScore((prevScore) => Math.max(0, prevScore - 5)); // Penalize score, not below 0
    }

    // Reset selections after a short delay for user to see feedback (if any)
    const feedbackTimer = setTimeout(() => {
      setSelectedCodeId(null);
      setSelectedColorId(null);
    }, 300); // 300ms delay for feedback

    return () => clearTimeout(feedbackTimer); // Cleanup feedback timer
    // Dependencies: selections, game over state, and matchedIds to check current state
  }, [selectedCodeId, selectedColorId, gameOver, matchedIds]);


  // Handler for clicking a code snippet button
  const handleCodeClick = (id: number) => {
    if (gameOver || matchedIds.includes(id) || selectedCodeId === id) return;
    setSelectedCodeId(id);
  };

  // Handler for clicking a color swatch button
  const handleColorClick = (id: number) => {
    if (gameOver || matchedIds.includes(id) || selectedColorId === id) return;
    setSelectedColorId(id);
  };

  // Helper function to check if an item (by ID) has been matched
  const isMatched = (id: number) => matchedIds.includes(id);

  // JSX for the game UI
  return (
    <div className="py-8"> {/* Overall padding for the page content */}
      <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-sky-400 manrope">
          Code & Color Matcher
        </h1>
        
        {/* Score and Timer Display */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-700 p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold text-emerald-400 mb-2 sm:mb-0">Score: {score}</div>
          <div className="text-xl font-bold text-amber-400">Time Left: {timeLeft}s</div>
        </div>

        {/* Game Over State */}
        {gameOver ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
              {/* Custom message if all items are matched (win) vs. time up (game over) */}
              {matchedIds.length === initialColorCodes.length ? "Congratulations, You Won!" : "Game Over!"}
            </h2>
            <p className="text-xl mb-6 text-slate-300">Your Final Score: {score}</p>
            <button 
              onClick={initializeGame} // Restart the game
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-150 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Play Again
            </button>
          </div>
        ) : (
          // Active Game State (Code Snippets and Color Swatches)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column for Code Snippets */}
            <div className="bg-slate-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-bold text-xl mb-4 text-center text-sky-300">Match This Code:</h3>
              <div className="space-y-3">
                {shuffledCodes.map((item) => (
                  <button
                    key={`code-${item.id}`}
                    onClick={() => handleCodeClick(item.id)}
                    className={`w-full p-3 text-left font-mono text-sm rounded-md border-2 transition-all duration-150 ease-in-out
                      ${isMatched(item.id) 
                        ? 'bg-slate-600 border-slate-500 opacity-50 cursor-not-allowed text-slate-400' // Matched style
                        : selectedCodeId === item.id 
                          ? 'bg-sky-700 border-sky-500 text-white ring-2 ring-sky-400' // Selected style
                          : 'bg-slate-800 border-slate-600 hover:bg-slate-600 hover:border-sky-500 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' // Default style
                      }`}
                    disabled={isMatched(item.id) || gameOver} // Disable if matched or game over
                  >
                    {item.display} {/* Shows challenging code like #FF0000 */}
                  </button>
                ))}
              </div>
            </div>

            {/* Column for Color Swatches */}
            <div className="bg-slate-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-bold text-xl mb-4 text-center text-sky-300">To This Color:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted grid for potentially more colors */}
                {shuffledColors.map((item) => (
                  <button
                    key={`color-${item.id}`}
                    onClick={() => handleColorClick(item.id)}
                    className={`aspect-square rounded-md shadow-md transition-all duration-150 ease-in-out
                      ${isMatched(item.id) 
                        ? 'opacity-30 cursor-not-allowed ring-2 ring-slate-500' // Matched style
                        : selectedColorId === item.id 
                          ? 'ring-4 ring-sky-400 scale-105' // Selected style
                          : 'hover:ring-2 hover:ring-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400' // Default style
                      }`}
                    style={{ backgroundColor: item.code }} // Apply the actual color for the swatch
                    disabled={isMatched(item.id) || gameOver} // Disable if matched or game over
                    aria-label={`Color swatch for ${item.display}`} // Accessibility
                  >
                    {/* Button is visually represented by its background color */}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions Text */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Match the CSS color codes on the left with their visual representation on the right. Beat the clock!
          </p>
        </div>
      </div>
    </div>
  );
}
