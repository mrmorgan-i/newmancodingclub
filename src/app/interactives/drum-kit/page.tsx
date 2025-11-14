"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SpeakerWaveIcon, PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/outline';

interface DrumItem {
  key: string;
  sound: string;
  label: string;
  color: string;
  activeColor?: string;
}

const drums: DrumItem[] = [
  { key: 'w', sound: 'tom-1', label: 'Tom 1', color: 'bg-red-500', activeColor: 'border-red-200' },
  { key: 'a', sound: 'tom-2', label: 'Tom 2', color: 'bg-blue-500', activeColor: 'border-blue-200' },
  { key: 's', sound: 'tom-3', label: 'Tom 3', color: 'bg-green-500', activeColor: 'border-green-200' },
  { key: 'd', sound: 'tom-4', label: 'Tom 4', color: 'bg-yellow-500', activeColor: 'border-yellow-200' },
  { key: 'j', sound: 'snare', label: 'Snare', color: 'bg-purple-500', activeColor: 'border-purple-200' },
  { key: 'k', sound: 'crash', label: 'Crash', color: 'bg-pink-500', activeColor: 'border-pink-200' },
  { key: 'l', sound: 'kick-bass', label: 'Kick', color: 'bg-indigo-500', activeColor: 'border-indigo-200' },
];

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
  const [bpm, setBpm] = useState(110);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomePulse, setMetronomePulse] = useState(0);

  const playSound = useCallback((key: string) => {
    const drum = drums.find((item) => item.key === key);
    if (!drum) return;

    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 180);

    const audio = new Audio(`/sounds/${drum.sound}.mp3`);
    audio.play().catch(() => {});

    if (isRecording && recordingStartTime) {
      const timestamp = Date.now() - recordingStartTime;
      setBeatRecording((prev) => [...prev, { key, timestamp }]);
    }
  }, [isRecording, recordingStartTime]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const drum = drums.find((item) => item.key === event.key.toLowerCase());
      if (drum) {
        event.preventDefault();
        playSound(drum.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  useEffect(() => {
    if (!metronomeOn || playbackActive) return;
    const interval = setInterval(() => setMetronomePulse((prev) => prev + 1), (60_000 / bpm));
    return () => clearInterval(interval);
  }, [metronomeOn, bpm, playbackActive]);

  const startRecording = () => {
    setBeatRecording([]);
    setIsRecording(true);
    setPlaybackActive(false);
    setRecordingStartTime(Date.now());
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playRecording = () => {
    if (beatRecording.length === 0 || playbackActive || isRecording) return;
    setPlaybackActive(true);
    const tempoRatio = 110 / bpm;

    beatRecording.forEach((beat, index) => {
      setTimeout(() => {
        playSound(beat.key);
        if (index === beatRecording.length - 1) {
          setTimeout(() => setPlaybackActive(false), 250);
        }
      }, beat.timestamp * tempoRatio);
    });
  };

  const stopPlayback = () => {
    setPlaybackActive(false);
  };

  return (
    <section className="pb-16">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-200">Live coding jam</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">Interactive Web Drum Kit</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Trigger pads with your keyboard (WASD + JKL) or tap them on touch screens. Record loops, tweak the BPM, and use the metronome to stay in sync.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Pads', value: drums.length },
              { label: 'BPM', value: bpm },
              { label: 'Recorded hits', value: beatRecording.length },
              { label: 'Metronome', value: metronomeOn ? 'On' : 'Off' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/60">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {drums.map((drum) => (
                <button
                  key={drum.key}
                  onClick={() => playSound(drum.key)}
                  className={`aspect-square rounded-2xl border-4 text-white transition ${
                    activeKey === drum.key
                      ? `${drum.color} ${drum.activeColor} scale-95`
                      : `${drum.color} border-transparent hover:scale-105`
                  }`}
                  aria-label={`Play ${drum.label}`}
                >
                  <span className="block text-2xl font-bold">{drum.key.toUpperCase()}</span>
                  <span className="text-sm font-medium">{drum.label}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Recorder</p>
                    <p className="text-xs text-slate-500">Capture keyboard hits in real time.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={startRecording}
                      disabled={isRecording}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isRecording ? 'bg-slate-200 text-slate-500' : 'bg-rose-500 text-white hover:bg-rose-600'
                      }`}
                    >
                      {isRecording ? 'Recording…' : 'Start'}
                    </button>
                    <button
                      onClick={stopRecording}
                      disabled={!isRecording}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isRecording ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      Stop
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={playRecording}
                    disabled={beatRecording.length === 0 || playbackActive}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      beatRecording.length === 0 || playbackActive
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    <PlayCircleIcon className="h-5 w-5" />
                    Play loop
                  </button>
                  <button
                    onClick={stopPlayback}
                    disabled={!playbackActive}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      playbackActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <PauseCircleIcon className="h-5 w-5" />
                    Stop
                  </button>
                  <p className="text-xs text-slate-500">{beatRecording.length} beat{beatRecording.length === 1 ? '' : 's'} captured</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">Tempo + Metronome</p>
                  <button
                    onClick={() => setMetronomeOn((prev) => !prev)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      metronomeOn ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <SpeakerWaveIcon className="h-4 w-4" />
                    {metronomeOn ? 'Metronome on' : 'Metronome off'}
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="range"
                    min={80}
                    max={160}
                    value={bpm}
                    onChange={(event) => setBpm(Number(event.target.value))}
                    className="w-full"
                  />
                  <span className="w-12 text-right text-sm font-semibold text-slate-700">{bpm} BPM</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-3 flex-1 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all"
                      style={{ width: `${((bpm - 80) / 80) * 100}%` }}
                    />
                  </div>
                  {metronomeOn && (
                    <span
                      className={`h-4 w-4 rounded-full ${metronomePulse % 2 === 0 ? 'bg-sky-500' : 'bg-emerald-500'} transition`}
                    />
                  )}
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Tip: Layer multiple passes by recording, playing back, and improvising on top of the loop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
