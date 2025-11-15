"use client";

import React, { useMemo, useState, useEffect } from 'react';
import {
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { quizQuestionBank, QuizQuestion } from '@/data/quizQuestions';

const quizLengths = [5, 10, 15];

const shuffle = <T,>(list: T[], seed = Date.now()): T[] => {
  const array = [...list];
  let randomSeed = seed || Date.now();
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

export default function CodeQuizPage() {
  const [questionCount, setQuestionCount] = useState(quizLengths[1]);
  const [sessionKey, setSessionKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ id: number; correct: boolean }[]>([]);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const questionDeck: QuizQuestion[] = useMemo(
    () => shuffle(quizQuestionBank, sessionKey + questionCount).slice(0, questionCount),
    [questionCount, sessionKey],
  );

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [completed, startTime]);

  const currentQuestion = questionDeck[currentIndex];

  const revealAnswer = () => {
    if (selectedOption === null || revealed) return;
    const chosen = currentQuestion.options[selectedOption];
    const isCorrect = chosen.isCorrect;
    setRevealed(true);
    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setAnswers((prev) => [...prev, { id: currentQuestion.id, correct: isCorrect }]);
  };

  const goToNext = () => {
    if (!revealed) return;
    if (currentIndex + 1 === questionDeck.length) {
      setCompleted(true);
      setRevealed(false);
      setSelectedOption(null);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setRevealed(false);
  };

  const restartQuiz = () => {
    setSessionKey((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setAnswers([]);
    setCompleted(false);
    setStartTime(() => Date.now());
    setElapsed(0);
  };

  const percent = Math.round((score / questionDeck.length) * 100);
  const formattedTime = `${Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;
  const missedQuestions = answers
    .filter((answer) => !answer.correct)
    .map((answer) => questionDeck.find((question) => question.id === answer.id))
    .filter((question): question is QuizQuestion => Boolean(question));

  return (
    <section className="pb-16">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 px-6 py-8 shadow-2xl shadow-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Knowledge checkpoint</p>
          <h1 className="mt-2 text-4xl font-bold manrope text-white">Code Snippet Quiz</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Mix-and-match fundamentals from JavaScript, Python, HTML/CSS, SQL, and TypeScript. Answer quickly, then explore the explanation to reinforce the concept.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Question set', value: questionCount },
              { label: 'Score', value: `${score}/${questionDeck.length}` },
              { label: 'Time', value: formattedTime },
              { label: 'Progress', value: `${currentIndex + (completed ? 0 : 1)}/${questionDeck.length}` },
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question count</p>
                <div className="mt-3 space-y-2">
                  {quizLengths.map((length) => (
                    <button
                      key={length}
                      onClick={() => {
                        setQuestionCount(length);
                        restartQuiz();
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        length === questionCount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      {length} questions
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">How scoring works</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Select an answer, then reveal the solution.</li>
                  <li>Correct answers award 1 point.</li>
                  <li>Use the explanation to fill any knowledge gaps.</li>
                </ul>
              </div>

              <button
                onClick={restartQuiz}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowPathIcon className="h-4 w-4" /> Start over
                </span>
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {completed ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <AcademicCapIcon className="mx-auto h-10 w-10 text-primary" />
                  <h2 className="mt-3 text-3xl font-bold text-slate-800">Quiz complete!</h2>
                  <p className="mt-2 text-slate-600">
                    You scored <span className="font-semibold text-slate-800">{score}</span> out of {questionDeck.length} ({percent}%).
                  </p>
                  <p className="text-sm text-slate-500">Time: {formattedTime}</p>
                  {missedQuestions.length > 0 ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-left">
                      <p className="text-sm font-semibold text-slate-700">Review these topics:</p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {missedQuestions.map((question) => (
                          <li key={question.id}>
                            <span className="font-semibold text-slate-800">{question.language}</span> — {question.questionText}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-emerald-600">Perfect run! Nothing to review.</p>
                  )}
                  <button
                    onClick={restartQuiz}
                    className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-accent"
                  >
                    Try another set
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {currentQuestion.language}
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-100">
                      <code>{currentQuestion.snippet}</code>
                    </pre>
                    <p className="mt-4 text-lg font-semibold text-slate-800">{currentQuestion.questionText}</p>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      const correctReveal = revealed && option.isCorrect;
                      const incorrectReveal = revealed && isSelected && !option.isCorrect;
                      return (
                        <button
                          key={option.text}
                          onClick={() => !revealed && setSelectedOption(index)}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                            correctReveal
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : incorrectReveal
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : isSelected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-slate-200 text-slate-700 hover:border-primary/40'
                          }`}
                        >
                          {correctReveal ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : incorrectReveal ? (
                            <XCircleIcon className="h-5 w-5" />
                          ) : (
                            <LightBulbIcon className="h-5 w-5 text-slate-400" />
                          )}
                          <span>{option.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={revealAnswer}
                      disabled={selectedOption === null || revealed}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        selectedOption === null || revealed
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-primary text-white hover:bg-primary-accent'
                      }`}
                    >
                      Reveal answer
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={!revealed}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        revealed ? 'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary' : 'border border-slate-200 text-slate-400'
                      }`}
                    >
                      Next question
                    </button>
                  </div>

                  {revealed && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">Why?</p>
                      <p className="mt-2">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
