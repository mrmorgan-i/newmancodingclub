"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type ProgramId = 'heart' | 'fevers';

interface Step {
  line: number;
  note: string;
  output?: string;
}

const FEVER_LINE = 100.4;

const formatNumber = (value: number) => String(value);

const heartLines = (rate: number) => [
  `heart_rate = ${rate}`,
  '',
  'if heart_rate > 100:',
  '    print("Too fast")',
  'else:',
  '    print("Normal")',
];

const heartSteps = (rate: number): Step[] => {
  const fast = rate > 100;
  const steps: Step[] = [
    { line: 0, note: `heart_rate is now ${rate}` },
    { line: 2, note: `Is ${rate} > 100? ${fast ? 'Yes' : 'No'}` },
  ];
  if (fast) {
    steps.push({ line: 3, note: 'The condition was true, so this line runs', output: 'Too fast' });
  } else {
    steps.push({ line: 4, note: 'The condition was false, so Python jumps to else' });
    steps.push({ line: 5, note: 'This line runs', output: 'Normal' });
  }
  return steps;
};

const feverLines = (temps: number[]) => [
  `temps = [${temps.map(formatNumber).join(', ')}]`,
  'fevers = 0',
  '',
  'for t in temps:',
  `    if t >= ${FEVER_LINE}:`,
  '        fevers = fevers + 1',
  '',
  'print(fevers)',
];

const feverSteps = (temps: number[]): Step[] => {
  const steps: Step[] = [
    { line: 0, note: `temps holds ${temps.length} temperatures` },
    { line: 1, note: 'fevers starts at 0' },
  ];
  let fevers = 0;
  temps.forEach((t) => {
    steps.push({ line: 3, note: `t is now ${formatNumber(t)}` });
    const isFever = t >= FEVER_LINE;
    steps.push({ line: 4, note: `Is ${formatNumber(t)} >= ${FEVER_LINE}? ${isFever ? 'Yes' : 'No'}` });
    if (isFever) {
      fevers += 1;
      steps.push({ line: 5, note: `fevers goes up to ${fevers}` });
    }
  });
  steps.push({ line: 7, note: 'The loop is done, so Python prints fevers', output: String(fevers) });
  return steps;
};

export default function PredictOutputPage() {
  const [program, setProgram] = useState<ProgramId>('heart');
  const [rate, setRate] = useState(112);
  const [temps, setTemps] = useState<string[]>(['98.6', '101.2', '99.1', '102.5']);
  const [guess, setGuess] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [score, setScore] = useState({ right: 0, tries: 0 });

  const parsedTemps = temps.map((value) => Number.parseFloat(value));
  const tempsValid = parsedTemps.every((value) => Number.isFinite(value));

  const lines = program === 'heart' ? heartLines(rate) : feverLines(tempsValid ? parsedTemps : [0, 0, 0, 0]);
  const steps = useMemo(
    () => (program === 'heart' ? heartSteps(rate) : tempsValid ? feverSteps(parsedTemps) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [program, rate, temps.join('|'), tempsValid],
  );

  const choices = program === 'heart' ? ['Too fast', 'Normal'] : ['0', '1', '2', '3', '4'];
  const answer = steps.length > 0 ? steps[steps.length - 1].output ?? '' : '';
  const stepping = stepIndex >= 0 && stepIndex < steps.length - 1;
  const finished = stepIndex === steps.length - 1 && steps.length > 0;
  const current = stepIndex >= 0 ? steps[stepIndex] : null;

  const nextStep = () => setStepIndex((prev) => (prev >= 0 && prev < steps.length - 1 ? prev + 1 : prev));
  const backStep = () => setStepIndex((prev) => (prev > 0 && prev < steps.length - 1 ? prev - 1 : prev));
  const runToEnd = () => setStepIndex((prev) => (prev >= 0 ? steps.length - 1 : prev));

  useEffect(() => {
    if (!stepping) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.tagName === 'INPUT') return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setStepIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepping, steps.length]);

  useEffect(() => {
    if (finished && guess !== null) {
      setScore((prev) => ({ right: prev.right + (guess === answer ? 1 : 0), tries: prev.tries + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const reset = () => {
    setGuess(null);
    setStepIndex(-1);
  };

  const choose = (value: string) => {
    if (stepIndex >= 0) return;
    setGuess(value);
    setStepIndex(0);
  };

  const switchProgram = (id: ProgramId) => {
    setProgram(id);
    reset();
  };

  const changeRate = (value: number) => {
    setRate(Math.max(30, Math.min(220, value)));
    reset();
  };

  const changeTemp = (index: number, value: string) => {
    setTemps((prev) => prev.map((item, i) => (i === index ? value : item)));
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900 px-6 py-8">
        <h1 className="text-4xl font-bold manrope text-white">Predict the Output</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-300">
          Read the Python program and pick what you think it prints. Then step through it one line at a time, the way a debugger does. Change the numbers and try again.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { id: 'heart' as ProgramId, label: 'Heart rate' },
            { id: 'fevers' as ProgramId, label: 'Fevers' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchProgram(item.id)}
              className={`rounded-full border px-6 py-3 text-lg font-semibold transition ${
                program === item.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-white/15 text-slate-200 hover:border-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
          <p className="ml-auto self-center text-lg text-slate-300">
            Right so far: <span className="font-semibold text-white">{score.right} of {score.tries}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            {program === 'heart' ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg text-slate-300">Heart rate</span>
                <button onClick={() => changeRate(rate - 10)} className="rounded-full border border-white/15 px-4 py-2 text-lg font-semibold text-white hover:border-primary">
                  minus 10
                </button>
                <input
                  type="number"
                  value={rate}
                  onChange={(event) => changeRate(Number.parseInt(event.target.value || '0', 10))}
                  className="w-28 rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-center text-2xl font-semibold text-white"
                  aria-label="Heart rate"
                />
                <button onClick={() => changeRate(rate + 10)} className="rounded-full border border-white/15 px-4 py-2 text-lg font-semibold text-white hover:border-primary">
                  plus 10
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg text-slate-300">Temperatures (°F)</span>
                {temps.map((value, index) => (
                  <input
                    key={index}
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(event) => changeTemp(index, event.target.value)}
                    className="w-28 rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-center text-2xl font-semibold text-white"
                    aria-label={`Temperature ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 font-mono text-base leading-relaxed sm:text-xl" style={{ fontVariantLigatures: 'none' }}>
              {lines.map((text, index) => (
                <div
                  key={index}
                  className={`rounded-lg px-3 transition ${
                    current && current.line === index ? 'bg-sky-500/30 text-white' : 'text-slate-200'
                  }`}
                >
                  <span className="mr-4 inline-block w-6 select-none text-right text-slate-500">{index + 1}</span>
                  {text || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-lg font-semibold text-white">What will it print?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => choose(choice)}
                  disabled={stepIndex >= 0 || (program === 'fevers' && !tempsValid)}
                  className={`min-w-20 rounded-2xl border px-6 py-4 text-2xl font-semibold transition disabled:cursor-not-allowed ${
                    guess === choice
                      ? 'border-primary bg-primary text-white'
                      : 'border-white/15 text-slate-100 hover:border-primary disabled:opacity-50'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
            {program === 'fevers' && !tempsValid && (
              <p className="mt-3 text-rose-300">Each temperature needs a number.</p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">What Python is doing</p>
            <p className="mt-2 min-h-8 text-xl text-white">{current ? current.note : 'Pick an answer to start.'}</p>
            {stepIndex >= 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={nextStep}
                  disabled={!stepping}
                  className="rounded-full bg-primary px-7 py-3 text-lg font-semibold text-white transition hover:bg-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next line
                </button>
                <button
                  onClick={backStep}
                  disabled={!stepping || stepIndex === 0}
                  className="rounded-full border border-white/15 px-5 py-3 text-lg font-semibold text-slate-100 transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  onClick={runToEnd}
                  disabled={!stepping}
                  className="rounded-full border border-white/15 px-5 py-3 text-lg font-semibold text-slate-100 transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Run to end
                </button>
                <span className="text-slate-400">
                  Step {stepIndex + 1} of {steps.length}
                </span>
              </div>
            )}
            <p className="mt-5 text-sm text-slate-400">Output</p>
            <p className="mt-2 min-h-10 font-mono text-3xl text-emerald-300">{finished ? answer : ''}</p>
          </div>

          {finished && (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <p className={`text-2xl font-semibold ${guess === answer ? 'text-emerald-300' : 'text-amber-300'}`}>
                {guess === answer ? 'You got it.' : `It printed ${answer}, not ${guess}.`}
              </p>
              <button
                onClick={reset}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white hover:bg-primary-accent"
              >
                <ArrowPathIcon className="h-5 w-5" /> Change the numbers and go again
              </button>
            </div>
          )}

          {stepIndex === -1 && (
            <p className="flex items-center gap-2 text-slate-400">
              <PlayIcon className="h-5 w-5" /> After you pick, tap Next line to run the program one line at a time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
