"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const GRID_SIZE = 20; // e.g., 20x20 grid
const PIXEL_SIZE_REM = 1.5; // Each pixel will be 1.5rem x 1.5rem (24px x 24px if 1rem=16px)

const defaultColor = '#FFFFFF'; // White

const colorPalette: string[] = [
  '#000000', // Black
  '#FFFFFF', // White
  '#EF4444', // Red-500
  '#F97316', // Orange-500
  '#EAB308', // Yellow-500
  '#22C55E', // Green-500
  '#0EA5E9', // Sky-500
  '#3B82F6', // Blue-500
  '#8B5CF6', // Violet-500
  '#EC4899', // Pink-500
  '#A1A1AA', // Zinc-400 (Light Gray)
  '#713F12', // Amber-900 (Brown)
];

// Initialize the grid with the default color
const createInitialGrid = (size: number, color: string): string[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(color));
};

export default function PixelArtPage() {
  const [grid, setGrid] = useState<string[][]>(() => createInitialGrid(GRID_SIZE, defaultColor));
  const [selectedColor, setSelectedColor] = useState<string>(colorPalette[0]); // Default to black

  // Memoize grid width for performance if GRID_SIZE were dynamic
  const gridWidthStyle = useMemo(() => ({
    width: `${GRID_SIZE * PIXEL_SIZE_REM}rem`,
  }), []);

  // Handle clicking on a pixel to change its color
  const handlePixelClick = useCallback((rowIndex: number, colIndex: number) => {
    setGrid(prevGrid => {
      // Create a new grid to avoid direct state mutation
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[rowIndex][colIndex] = selectedColor;
      return newGrid;
    });
  }, [selectedColor]);

  // Handle selecting a color from the palette
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Clear the entire grid to the default color
  const handleClearGrid = () => {
    setGrid(createInitialGrid(GRID_SIZE, defaultColor));
  };
  

  return (
    <div className="py-8">
      <div className="max-w-max mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-sky-400 manrope">
          Pixel Art Creator
        </h1>
        <p className="text-center text-slate-300 mb-6 text-sm sm:text-base">
          Click a color, then click a square on the grid to paint!
        </p>

        {/* Color Palette */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 p-3 bg-slate-700 rounded-md shadow">
          {colorPalette.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md border-2 transition-all duration-150 ease-in-out
                ${selectedColor === color ? 'ring-4 ring-offset-2 ring-offset-slate-700 ring-sky-400 scale-110' : 'border-slate-600 hover:border-sky-500'}
              `}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        
        {/* Controls: Clear Grid */}
        <div className="flex justify-center gap-4 mb-6">
            <button
                onClick={handleClearGrid}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
                <TrashIcon className="w-5 h-5" /> Clear All
            </button>
            {/* Placeholder for more controls if needed */}
        </div>


        {/* Pixel Grid */}
        <div 
          className="grid border-2 border-slate-600 shadow-lg mx-auto" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            ...gridWidthStyle, // Apply dynamic width
            touchAction: 'none' // Improves touch interaction on some devices
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((pixelColor, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="border border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  width: `${PIXEL_SIZE_REM}rem`,
                  height: `${PIXEL_SIZE_REM}rem`,
                  backgroundColor: pixelColor,
                }}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
                // For mobile: allow "dragging" to paint (optional, more complex)
                // onTouchMove={(e) => { e.preventDefault(); handlePixelClick(rowIndex, colIndex);}}
              />
            ))
          )}
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs">
            <p>Create your masterpiece! The grid is {GRID_SIZE}x{GRID_SIZE} pixels.</p>
        </div>
      </div>
    </div>
  );
}
