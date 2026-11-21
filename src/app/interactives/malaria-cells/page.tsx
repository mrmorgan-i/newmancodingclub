"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Cell {
  id: string;
  infected: boolean;
}

const cellPool: Cell[] = [
  { id: '003233bf', infected: true },
  { id: '0da07c68', infected: false },
  { id: '120b9573', infected: true },
  { id: '2299682c', infected: false },
  { id: '37960226', infected: true },
  { id: '3b241ac0', infected: false },
  { id: '421404bb', infected: true },
  { id: '4359d6cd', infected: true },
  { id: '5a07e315', infected: true },
  { id: '5bc70e24', infected: false },
  { id: '5ff56ae2', infected: false },
  { id: '609203b5', infected: false },
  { id: '61ef721d', infected: false },
  { id: '6f6af7d9', infected: true },
  { id: '788e51ba', infected: false },
  { id: '7b861f88', infected: false },
  { id: '8036a955', infected: false },
  { id: '83b31a36', infected: true },
  { id: '85bf65aa', infected: true },
  { id: '876df340', infected: true },
  { id: '910c6f75', infected: false },
  { id: '93663232', infected: true },
  { id: 'a3894dce', infected: false },
  { id: 'a47a1301', infected: false },
  { id: 'b99d53fb', infected: false },
  { id: 'ba9bed09', infected: false },
  { id: 'c2c326b8', infected: false },
  { id: 'c3f1ce1f', infected: true },
  { id: 'c8882be6', infected: true },
  { id: 'd5a9043a', infected: false },
  { id: 'dcd4a76f', infected: false },
  { id: 'ed5d16a5', infected: true },
  { id: 'f1417fe5', infected: true },
  { id: 'f9cb8ebf', infected: true },
  { id: 'fc8476ef', infected: true },
];

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const shuffle = <T,>(list: T[], seed: number): T[] => {
  const array = [...list];
  let randomSeed = seed;
  const random = () => {
    randomSeed = (randomSeed * 1664525 + 1013904223) % 4294967296;
    return randomSeed / 4294967296;
  };
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const makeRound = (seed: number): Cell[] => {
  const infected = shuffle(cellPool.filter((cell) => cell.infected), seed).slice(0, 4);
  const healthy = shuffle(cellPool.filter((cell) => !cell.infected), seed + 7).slice(0, 4);
  return shuffle([...infected, ...healthy], seed + 13);
};

export default function MalariaCellsPage() {
  const [cells, setCells] = useState<Cell[]>(() => makeRound(20261121));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRight, setTotalRight] = useState(0);
  const [totalSeen, setTotalSeen] = useState(0);

  const toggle = (id: string) => {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const found = cells.filter((cell) => cell.infected && selected.has(cell.id)).length;
  const falseAlarms = cells.filter((cell) => !cell.infected && selected.has(cell.id)).length;
  const rightThisRound = cells.filter((cell) => cell.infected === selected.has(cell.id)).length;

  const check = () => {
    if (checked || selected.size === 0) return;
    setChecked(true);
    setTotalRight((prev) => prev + rightThisRound);
    setTotalSeen((prev) => prev + cells.length);
  };

  const nextRound = () => {
    setCells(makeRound(Date.now() % 4294967296));
    setSelected(new Set());
    setChecked(false);
    setRound((prev) => prev + 1);
  };

  const resultLine = () => {
    const healthyPart =
      falseAlarms === 0
        ? 'and no healthy cells'
        : `and marked ${falseAlarms} healthy ${falseAlarms === 1 ? 'cell' : 'cells'} by mistake`;
    return `You found ${found} of 4 infected cells ${healthyPart}.`;
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900 px-6 py-8">
        <h1 className="text-4xl font-bold manrope text-white">Spot the Malaria</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-300">
          Four of these eight red blood cells are infected with malaria. Tap the ones you think are infected, then check. The parasite takes up the purple stain, so look for a dark dot or ring inside the cell.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Round', value: round },
            { label: 'Selected', value: `${selected.size} of 8` },
            { label: 'Cells right so far', value: totalSeen === 0 ? 'None yet' : `${totalRight} of ${totalSeen}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-sm text-slate-300">{stat.label}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {cells.map((cell, index) => {
          const isSelected = selected.has(cell.id);
          let ring = isSelected ? 'ring-4 ring-sky-400' : 'ring-1 ring-white/10';
          let tag: { text: string; tone: string } | null = null;
          if (checked) {
            if (cell.infected && isSelected) {
              ring = 'ring-4 ring-emerald-400';
              tag = { text: 'Infected, you found it', tone: 'bg-emerald-500 text-white' };
            } else if (cell.infected) {
              ring = 'ring-4 ring-amber-400';
              tag = { text: 'Infected, missed', tone: 'bg-amber-400 text-slate-950' };
            } else if (isSelected) {
              ring = 'ring-4 ring-rose-500';
              tag = { text: 'Healthy', tone: 'bg-rose-500 text-white' };
            } else {
              ring = 'ring-1 ring-white/10';
              tag = { text: 'Healthy', tone: 'bg-slate-700 text-slate-100' };
            }
          }
          return (
            <button
              key={cell.id}
              onClick={() => toggle(cell.id)}
              aria-pressed={isSelected}
              aria-label={`Cell ${letters[index]}`}
              className={`relative overflow-hidden rounded-2xl bg-black transition ${ring} ${checked ? 'cursor-default' : 'hover:ring-sky-300'}`}
            >
              <Image
                src={`/interactives/malaria/${cell.id}.png`}
                alt={`Red blood cell ${letters[index]}`}
                width={256}
                height={256}
                className="h-auto w-full"
                priority
              />
              <span className="absolute left-3 top-2 text-2xl font-bold text-white">{letters[index]}</span>
              {isSelected && !checked && (
                <CheckCircleIcon className="absolute right-2 top-2 h-8 w-8 text-sky-300" />
              )}
              {tag && (
                <span className={`absolute inset-x-2 bottom-2 rounded-full px-2 py-1 text-sm font-semibold ${tag.tone}`}>
                  {tag.text}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center">
        {!checked ? (
          <button
            onClick={check}
            disabled={selected.size === 0}
            className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition hover:bg-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check my answers
          </button>
        ) : (
          <>
            <p className="text-xl font-semibold text-white">{resultLine()}</p>
            <button
              onClick={nextRound}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition hover:bg-primary-accent sm:ml-auto"
            >
              <ArrowPathIcon className="h-5 w-5" /> New cells
            </button>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-slate-300">
        <p>
          These are real images from the U.S. National Library of Medicine malaria dataset, which has 27,558 cell images from thin blood smears.
        </p>
      </div>
    </div>
  );
}
