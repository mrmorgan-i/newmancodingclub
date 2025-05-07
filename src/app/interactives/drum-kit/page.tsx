"use client"; 

import React, { useState, useEffect, useCallback } from 'react';

// Define the structure for a drum
interface DrumItem {
  key: string;
  sound: string; // Filename without extension (e.g., 'tom-1')
  label: string;
  color: string;
  activeColor?: string;
}

// Define the drum set
const drums: DrumItem[] = [
  { key: 'w', sound: 'tom-1', label: 'Tom 1', color: 'bg-red-500', activeColor: 'border-red-300' },
  { key: 'a', sound: 'tom-2', label: 'Tom 2', color: 'bg-blue-500', activeColor: 'border-blue-300' },
  { key: 's', sound: 'tom-3', label: 'Tom 3', color: 'bg-green-500', activeColor: 'border-green-300' },
  { key: 'd', sound: 'tom-4', label: 'Tom 4', color: 'bg-yellow-500', activeColor: 'border-yellow-300' },
  { key: 'j', sound: 'snare', label: 'Snare', color: 'bg-purple-500', activeColor: 'border-purple-300' },
  { key: 'k', sound: 'crash', label: 'Crash', color: 'bg-pink-500', activeColor: 'border-pink-300' },
  { key: 'l', sound: 'kick-bass', label: 'Kick', color: 'bg-indigo-500', activeColor: 'border-indigo-300' },
];

// Define the structure for a recorded beat
interface Beat {
  key: string;
  timestamp: number;
}

export default function DrumKitPage() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [beatRecording, setBeatRecording] = useState<Beat[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [playbackActive, setPlaybackActive] = useState<boolean>(false);

  // Memoized playSound function
  const playSound = useCallback((key: string) => {
    const drum = drums.find(d => d.key === key);
    if (!drum) return;
    
    // Visual feedback for the pressed key
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 200); // Shorter timeout for snappier feel
    
    try {
      const audio = new Audio(`/sounds/${drum.sound}.mp3`);
      audio.play().catch(error => console.error(`Error playing sound ${drum.sound}:`, error));
    } catch (error) {
        console.error("Error creating audio element:", error);
    }
    
    // If currently recording, add this beat to the recording
    if (isRecording && recordingStartTime) {
      const now = Date.now();
      const timestamp = now - recordingStartTime;
      setBeatRecording(prev => [...prev, { key, timestamp }]);
    }
  }, [isRecording, recordingStartTime]); // Dependencies for playSound

  // Handle keyboard events for playing drums
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent playing sound if a modifier key is pressed (e.g. for browser shortcuts)
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const drum = drums.find(d => d.key === event.key.toLowerCase());
      if (drum) {
        event.preventDefault(); // Prevent default browser action for the key (e.g. scrolling)
        playSound(drum.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playSound]);

  // Function to start recording a beat
  const startRecording = () => {
    setBeatRecording([]); // Clear previous recording
    setIsRecording(true);
    setPlaybackActive(false); // Ensure playback is stopped
    setRecordingStartTime(Date.now());
  };

  // Function to stop recording
  const stopRecording = () => {
    setIsRecording(false);
  };

  // Function to play back the recorded beat
  const playRecording = () => {
    if (beatRecording.length === 0 || playbackActive || isRecording) return;
    
    setPlaybackActive(true);
    
    beatRecording.forEach((beat, index) => {
      setTimeout(() => {
        playSound(beat.key);
        
        // If this is the last beat, set playback as inactive after it plays
        if (index === beatRecording.length - 1) {
          // Add a slight delay after the last sound to ensure it finishes
          setTimeout(() => setPlaybackActive(false), 300); 
        }
      }, beat.timestamp);
    });
  };

  return (
    <div className="py-8"> {/* Overall padding for the page content */}
      <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-sky-400 manrope">
          Interactive Web Drum Kit
        </h1>
        
        {/* Drum Pads Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 mb-10">
          {drums.map((drum) => (
            <button
              key={drum.key}
              className={`w-full aspect-square rounded-lg border-4 shadow-lg flex flex-col items-center justify-center text-white font-bold text-2xl sm:text-3xl transition-all transform focus:outline-none
                ${drum.color} 
                ${activeKey === drum.key 
                  ? `scale-95 opacity-90 ${drum.activeColor || 'border-white'} ring-4 ${drum.activeColor || 'ring-white'}` 
                  : `${drum.color} border-slate-700 hover:scale-105 hover:border-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400`
                }`}
              onClick={() => playSound(drum.key)}
              aria-label={`Play ${drum.label} (key ${drum.key.toUpperCase()})`}
            >
              <span className="mb-1 sm:mb-2 text-xl sm:text-2xl">{drum.key.toUpperCase()}</span>
              <span className="text-xs sm:text-sm font-normal">{drum.label}</span>
            </button>
          ))}
        </div>
        
        {/* Beat Recorder Controls */}
        <div className="bg-slate-700 p-4 sm:p-6 rounded-lg shadow-inner">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-sky-300">Beat Recorder</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-6 py-3 rounded-md font-semibold text-base transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${isRecording 
                  ? 'bg-slate-500 text-slate-300 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                }`}
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`px-6 py-3 rounded-md font-semibold text-base transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${!isRecording 
                  ? 'bg-slate-500 text-slate-300 cursor-not-allowed' 
                  : 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400'
                }`}
            >
              Stop Recording
            </button>
            
            <button
              onClick={playRecording}
              disabled={beatRecording.length === 0 || playbackActive || isRecording}
              className={`px-6 py-3 rounded-md font-semibold text-base transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${(beatRecording.length === 0 || playbackActive || isRecording)
                  ? 'bg-slate-500 text-slate-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                }`}
            >
              {playbackActive ? 'Playing...' : 'Play Recording'}
            </button>
          </div>
          
          <div className="mt-4 sm:mt-6 text-center text-slate-400">
            <p>{beatRecording.length} beat{beatRecording.length !== 1 ? 's' : ''} recorded</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Press the buttons or use your keyboard (W, A, S, D, J, K, L) to play drums!</p>
          <p>Made with ❤️ by the Newman Coding Club</p>
        </div>
      </div>
    </div>
  );
}
