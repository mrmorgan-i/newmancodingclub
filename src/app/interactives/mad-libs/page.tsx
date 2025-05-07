"use client";

import React, { useState, useMemo } from 'react';

// Define the structure for a placeholder in the Mad Libs story
interface MadLibPlaceholder {
  key: string;
  label: string;
  type: 'noun' | 'verb' | 'adjective' | 'techTerm' | 'pluralNoun' | 'advberb';
}

// Define the structure for the Mad Libs story template
interface MadLibStoryTemplate {
  title: string;
  placeholders: MadLibPlaceholder[];
  generateStory: (inputs: Record<string, string>) => string;
  instruction: string; // Brief instruction for the user
}

// Define our coding-themed Mad Libs story
const codingMadLibTemplate: MadLibStoryTemplate = {
  title: "My First Coding Adventure",
  instruction: "Fill in the blanks below to create your own hilarious coding story!",
  placeholders: [
    { key: "adjective1", label: "Adjective", type: "adjective" },
    { key: "techTerm1", label: "Tech Term (e.g., 'Algorithm')", type: "techTerm" },
    { key: "verb1", label: "Verb (ending in -ing)", type: "verb" },
    { key: "pluralNoun1", label: "Plural Noun", type: "pluralNoun" },
    { key: "techTerm2", label: "Another Tech Term (e.g., 'API')", type: "techTerm" },
    { key: "adjective2", label: "Adjective", type: "adjective" },
    { key: "noun1", label: "Noun", type: "noun" },
    { key: "verb2", label: "Verb (past tense)", type: "verb" },
    { key: "techTerm3", label: "A Programming Language (e.g., 'Python')", type: "techTerm" },
    { key: "adjective3", label: "Adjective", type: "adjective" },
  ],
  generateStory: (inputs) =>
    `Last night, I had a very ${inputs.adjective1 || "(adjective)"} dream about coding.
    I was trying to understand a complex ${inputs.techTerm1 || "(tech term)"} while ${inputs.verb1 || "(verb ending in -ing)"} with a bunch of ${inputs.pluralNoun1 || "(plural noun)"}.
    Suddenly, a wild ${inputs.techTerm2 || "(another tech term)"} appeared! It was so ${inputs.adjective2 || "(adjective)"} that my ${inputs.noun1 || "(noun)"} nearly ${inputs.verb2 || "(verb, past tense)"}.
    Thankfully, I remembered my ${inputs.techTerm3 || "(programming language)"} skills and wrote some ${inputs.adjective3 || "(adjective)"} code to save the day!
    Then I woke up and realized it was all just a debug session. Phew!`
};

export default function MadLibsPage() {
  const storyTemplate = codingMadLibTemplate; // Using the defined template

  // Initialize inputs state dynamically based on placeholders
  const initialInputs = useMemo(() => 
    storyTemplate.placeholders.reduce((acc, p) => {
      acc[p.key] = '';
      return acc;
    }, {} as Record<string, string>), 
  [storyTemplate.placeholders]);

  const [inputs, setInputs] = useState<Record<string, string>>(initialInputs);
  const [completedStory, setCompletedStory] = useState<string | null>(null);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle changes in input fields
  const handleChange = (key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
    if (error) setError(null); // Clear error when user starts typing
  };

  // Handle form submission to generate the story
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all fields are filled
    const allFilled = storyTemplate.placeholders.every(p => inputs[p.key]?.trim() !== '');
    if (!allFilled) {
      setError("Oops! Please fill in all the fields to create your story.");
      return;
    }
    
    const generated = storyTemplate.generateStory(inputs);
    setCompletedStory(generated);
    setShowStory(true);
    setError(null); // Clear any previous errors
  };

  // Handle resetting the game to play again
  const handleReset = () => {
    setInputs(initialInputs); // Reset inputs to their initial empty state
    setCompletedStory(null);
    setShowStory(false);
    setError(null);
  };

  return (
    <div className="py-8"> {/* Overall padding for the page content */}
      <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-sky-400 manrope">
          {storyTemplate.title}
        </h1>
        <p className="text-center text-slate-300 mb-8 text-sm sm:text-base">
          {storyTemplate.instruction}
        </p>

        {/* Conditional rendering: show input form or the completed story */}
        {!showStory ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {storyTemplate.placeholders.map((placeholder) => (
              <div key={placeholder.key}>
                <label htmlFor={placeholder.key} className="block text-sm font-medium text-slate-300 mb-1">
                  {placeholder.label} <span className="text-xs text-slate-400">({placeholder.type})</span>:
                </label>
                <input
                  type="text"
                  id={placeholder.key}
                  name={placeholder.key}
                  value={inputs[placeholder.key]}
                  onChange={(e) => handleChange(placeholder.key, e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 text-slate-100 text-sm"
                  placeholder={`Enter a ${placeholder.type}...`}
                />
              </div>
            ))}
            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75"
            >
              Create My Coding Adventure!
            </button>
          </form>
        ) : (
          <div className="bg-slate-700 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-sky-300">Your Epic Coding Story:</h2>
            {/* Using whitespace-pre-line to preserve line breaks from the template string */}
            <p className="text-lg leading-relaxed whitespace-pre-line text-slate-200">
              {completedStory}
            </p>
            <button
              onClick={handleReset}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Play Again?
            </button>
          </div>
        )}
         <div className="mt-8 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Newman Coding Club - Mad Libs Fun!</p>
        </div>
      </div>
    </div>
  );
}
