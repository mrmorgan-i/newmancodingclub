"use client"; 

import React, { useState, useCallback } from 'react';
import { LightBulbIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, ArrowPathIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// Define the structure for a quiz option
interface QuizOption {
  text: string;
  isCorrect: boolean;
}

// Define the structure for a quiz question
interface QuizQuestion {
  id: number;
  snippet: string; 
  language: 'JavaScript' | 'Python' | 'HTML' | 'CSS' | 'TypeScript' | 'SQL'; 
  questionText: string; 
  options: QuizOption[];
  explanation: string; 
}

// Expanded quiz questions - now 20 total
const allQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    snippet: `function greet(name) {\n  return "Hello, " + name + "!";\n}\nconsole.log(greet("Dev"));`,
    language: 'JavaScript',
    questionText: "What will be logged to the console by this JavaScript code?",
    options: [
      { text: "Hello, Dev!", isCorrect: true },
      { text: "Hello, name!", isCorrect: false },
      { text: "Error", isCorrect: false },
      { text: "undefined", isCorrect: false },
    ],
    explanation: "The function `greet` concatenates 'Hello, ' with the provided `name` argument and an exclamation mark. Calling `greet('Dev')` returns 'Hello, Dev!' which is then logged.",
  },
  {
    id: 2,
    snippet: `my_list = [1, 2, 3, 4, 5]\nprint(my_list[1:3])`,
    language: 'Python',
    questionText: "What is the output of this Python code?",
    options: [
      { text: "[1, 2, 3]", isCorrect: false },
      { text: "[2, 3, 4]", isCorrect: false },
      { text: "[2, 3]", isCorrect: true },
      { text: "[1, 2]", isCorrect: false },
    ],
    explanation: "Python list slicing `[start:end]` extracts elements from index `start` up to (but not including) index `end`. So, `my_list[1:3]` extracts elements at index 1 and 2.",
  },
  {
    id: 3,
    snippet: `<h1>Hello World</h1`,
    language: 'HTML',
    questionText: "Is this a valid HTML heading element?",
    options: [
      { text: "Yes, perfectly valid.", isCorrect: false },
      { text: "No, the closing tag is missing a '>' character.", isCorrect: true },
      { text: "No, headings should use <p> tags.", isCorrect: false },
      { text: "Yes, browsers will auto-correct it.", isCorrect: false },
    ],
    explanation: "While most browsers are lenient and might render this, a valid HTML closing tag requires both '<' and '>'. The correct closing tag is `</h1>`.",
  },
  {
    id: 4,
    snippet: `.text-blue {\n  color: #0000FF;\n  font-size: 16px;\n}`,
    language: 'CSS',
    questionText: "Which CSS properties are being applied by this rule?",
    options: [
      { text: "background-color and font-family", isCorrect: false },
      { text: "text-color and font-size", isCorrect: false },
      { text: "color and font-size", isCorrect: true },
      { text: "margin and padding", isCorrect: false },
    ],
    explanation: "The `color` property sets the text color, and `font-size` sets the size of the font. Both are applied to elements with the class `text-blue`.",
  },
  {
    id: 5,
    snippet: `let count: number = 5;\ncount = "five"; // Type Error?`,
    language: 'TypeScript',
    questionText: "Will the second assignment cause a type error in TypeScript?",
    options: [
      { text: "No, TypeScript allows flexible type changes.", isCorrect: false },
      { text: "Yes, because 'five' is a string and count is typed as number.", isCorrect: true },
      { text: "No, because 'count' was declared with 'let'.", isCorrect: false },
      { text: "Only if 'strictNullChecks' is enabled.", isCorrect: false },
    ],
    explanation: "TypeScript is statically typed. Since `count` is explicitly typed as `number`, assigning a string value like 'five' to it will result in a type error during compilation.",
  },
  {
    id: 6,
    snippet: `for i in range(3):\n    print(i, end=' ')`,
    language: 'Python',
    questionText: "What is the output of this Python loop?",
    options: [
      { text: "0 1 2", isCorrect: true },
      { text: "1 2 3", isCorrect: false },
      { text: "0 1 2 3", isCorrect: false },
      { text: "1 2", isCorrect: false },
    ],
    explanation: "range(3) generates numbers from 0 to 2. The end=' ' parameter makes the print output space-separated.",
  },
  {
    id: 7,
    snippet: `SELECT name FROM employees WHERE salary > 50000;`,
    language: 'SQL',
    questionText: "What does this SQL query return?",
    options: [
      { text: "Names of employees earning over $50k", isCorrect: true },
      { text: "All employee data", isCorrect: false },
      { text: "Employee IDs and names", isCorrect: false },
      { text: "Syntax error", isCorrect: false },
    ],
    explanation: "The WHERE clause filters records where salary exceeds 50000, returning only the name column for those records.",
  },
  {
    id: 8,
    snippet: `.container {\n  display: flex;\n  justify-content: center;\n}`,
    language: 'CSS',
    questionText: "What does this CSS code accomplish?",
    options: [
      { text: "Centers items horizontally in a flex container", isCorrect: true },
      { text: "Vertically aligns items", isCorrect: false },
      { text: "Creates a grid layout", isCorrect: false },
      { text: "Applies animation", isCorrect: false },
    ],
    explanation: "justify-content: center centers flex items along the main axis (horizontal by default).",
  },
  {
    id: 9,
    snippet: `<form onsubmit="return validate()">\n  <input type="text" required>\n</form>`,
    language: 'HTML',
    questionText: "What does the 'required' attribute do?",
    options: [
      { text: "Makes field mandatory before submission", isCorrect: true },
      { text: "Auto-focuses the input", isCorrect: false },
      { text: "Validates email format", isCorrect: false },
      { text: "Hides the field", isCorrect: false },
    ],
    explanation: "The required attribute triggers browser validation, preventing form submission if empty.",
  },
  {
    id: 10,
    snippet: `squares = [x**2 for x in range(5)]`,
    language: 'Python',
    questionText: "What does this list comprehension create?",
    options: [
      { text: "[0, 1, 4, 9, 16]", isCorrect: true },
      { text: "[1, 4, 9, 16, 25]", isCorrect: false },
      { text: "Syntax error", isCorrect: false },
      { text: "Dictionary of squares", isCorrect: false },
    ],
    explanation: "range(5) is 0-4. Each number is squared, creating [0,1,4,9,16].",
  },
  {
    id: 11,
    snippet: `SELECT department, COUNT(*) FROM employees GROUP BY department;`,
    language: 'SQL',
    questionText: "What does this SQL query return?",
    options: [
      { text: "Employee count per department", isCorrect: true },
      { text: "All employees grouped by department", isCorrect: false },
      { text: "Department names only", isCorrect: false },
      { text: "Average salary per department", isCorrect: false },
    ],
    explanation: "GROUP BY groups rows by department, COUNT(*) gives number of employees in each group.",
  },
  {
    id: 12,
    snippet: `import matplotlib.pyplot as plt\nplt.plot([1,2,3], [4,5,1])\nplt.show()`,
    language: 'Python',
    questionText: "What does this code create (assuming matplotlib is installed)?",
    options: [
      { text: "Line graph", isCorrect: true },
      { text: "Bar chart", isCorrect: false },
      { text: "Pie chart", isCorrect: false },
      { text: "Scatter plot", isCorrect: false },
    ],
    explanation: "plt.plot() creates a line graph by default when given two lists of coordinates.",
  },
  {
    id: 13,
    snippet: `const arr = [1,2,3];\nconst doubled = arr.map(n => n * 2);`,
    language: 'JavaScript',
    questionText: "What is the value of 'doubled'?",
    options: [
      { text: "[2,4,6]", isCorrect: true },
      { text: "[1,2,3]", isCorrect: false },
      { text: "[1,4,9]", isCorrect: false },
      { text: "undefined", isCorrect: false },
    ],
    explanation: "map() creates a new array with each element doubled.",
  },
  {
    id: 14,
    snippet: `def add(a, b=0):\n    return a + b\nprint(add(5))`,
    language: 'Python',
    questionText: "What is the output?",
    options: [
      { text: "5", isCorrect: true },
      { text: "0", isCorrect: false },
      { text: "Error", isCorrect: false },
      { text: "None", isCorrect: false },
    ],
    explanation: "b defaults to 0 if not provided. 5 + 0 = 5.",
  },
  {
    id: 15,
    snippet: `SELECT AVG(salary) FROM employees;`,
    language: 'SQL',
    questionText: "What does this query calculate?",
    options: [
      { text: "Average salary", isCorrect: true },
      { text: "Total salaries", isCorrect: false },
      { text: "Maximum salary", isCorrect: false },
      { text: "Number of employees", isCorrect: false },
    ],
    explanation: "AVG() aggregate function calculates the average value of the salary column.",
  },
  {
    id: 16,
    snippet: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\ndef traverse(head):\n    current = head\n    while current:\n        print(current.data)\n        current = current.next`,
    language: 'Python',
    questionText: "What does this linked list traversal code do?",
    options: [
      { text: "Prints all node values sequentially", isCorrect: true },
      { text: "Reverses the linked list", isCorrect: false },
      { text: "Finds the middle node", isCorrect: false },
      { text: "Deletes duplicates", isCorrect: false },
    ],
    explanation: "The traverse function starts at the head and visits each node, printing its data, until reaching the end (None/null).",
  },
  {
    id: 17,
    snippet: `stack = []\nstack.append(1) \nstack.append(2)\nstack.pop()\nstack.append(3)`,
    language: 'Python',
    questionText: "What remains in the stack after these operations (using Python list methods)?",
    options: [
      { text: "[1, 3]", isCorrect: true },
      { text: "[1, 2]", isCorrect: false },
      { text: "[3]", isCorrect: false },
      { text: "[2, 3]", isCorrect: false },
    ],
    explanation: "Stack follows LIFO (Last In, First Out): append(1) -> [1], append(2) -> [1, 2], pop() removes 2 -> [1], append(3) -> [1, 3].",
  },
  {
    id: 18,
    snippet: `const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Done!"), 100);\n});\npromise.then(val => console.log(val));`,
    language: 'JavaScript',
    questionText: "What is the behavior of this JavaScript Promise code?",
    options: [
      { text: "Logs 'Done!' after approximately 100ms", isCorrect: true },
      { text: "Logs 'Done!' immediately", isCorrect: false },
      { text: "Causes an error", isCorrect: false },
      { text: "Logs 'Promise'", isCorrect: false },
    ],
    explanation: "The Promise resolves with 'Done!' after a 100ms timeout. The `.then()` callback executes with the resolved value.",
  },
  {
    id: 19,
    snippet: `a = 5\nb = 2\nresult = a // b`,
    language: 'Python',
    questionText: "What is the value of `result` in this Python code?",
    options: [
      { text: "2.5", isCorrect: false },
      { text: "2", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "Error", isCorrect: false },
    ],
    explanation: "The `//` operator in Python performs floor division, which divides and rounds down to the nearest whole number. 5 // 2 is 2.",
  },
  {
    id: 20,
    snippet: `ALTER TABLE Customers ADD Email varchar(255);`,
    language: 'SQL',
    questionText: "What is the purpose of this SQL statement?",
    options: [
      { text: "To update existing email addresses in the Customers table.", isCorrect: false },
      { text: "To add a new column named 'Email' to the Customers table.", isCorrect: true },
      { text: "To create a new table named 'Customers_Email'.", isCorrect: false },
      { text: "To delete the 'Email' column from the Customers table.", isCorrect: false },
    ],
    explanation: "`ALTER TABLE` is used to modify an existing table structure. `ADD Email varchar(255)` adds a new column named 'Email' that can store strings up to 255 characters.",
  }
];

// Function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

type GamePhase = 'selection' | 'playing' | 'finished';

export default function CodeQuizPage() {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizOption | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [gamePhase, setGamePhase] = useState<GamePhase>('selection');
  const [numQuestionsSelected, setNumQuestionsSelected] = useState<number | null>(null);


  // Initialize or restart the game
  const startGame = useCallback((numberOfQuestions: number) => {
    const shuffled = shuffleArray(allQuizQuestions);
    setActiveQuestions(shuffled.slice(0, numberOfQuestions));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowExplanation(false);
    setGamePhase('playing');
    setNumQuestionsSelected(numberOfQuestions);
  }, []);


  // Handle user selecting an answer
  const handleAnswerSelect = (option: QuizOption) => {
    if (isAnswered) return; 

    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option.isCorrect) {
      setScore(prevScore => prevScore + 10);
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setShowExplanation(false); 
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGamePhase('finished'); 
    }
  };
  
  // Function to handle selection of number of questions
  const handleNumQuestionsSelect = (num: number) => {
    startGame(num);
  };

  // Function to go back to the selection screen
  const handlePlayAgain = () => {
    setGamePhase('selection');
    setNumQuestionsSelected(null); 
  };


  if (gamePhase === 'selection') {
    return (
      <div className="py-8">
        <div className="max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100 text-center">
          <AcademicCapIcon className="w-16 h-16 mx-auto text-sky-400 mb-4" />
          <h1 className="text-3xl font-bold text-sky-400 mb-6 manrope">Code Snippet Quiz</h1>
          <p className="text-slate-300 mb-8">How many questions would you like to tackle?</p>
          <div className="grid grid-cols-2 gap-4">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                onClick={() => handleNumQuestionsSelect(num)}
                className="p-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
              >
                {num} Questions
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (activeQuestions.length === 0 && gamePhase === 'playing') {
    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100 text-center">
                <p>Loading Quiz...</p>
            </div>
        </div>
    );
  }

  const currentQuestion = activeQuestions[currentQuestionIndex];

  return (
    <div className="py-8"> 
      <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-sky-400 manrope">
          Code Snippet Quiz
        </h1>

        {gamePhase === 'playing' && currentQuestion ? (
            <div>
              {/* Progress Bar and Question Counter */}
              <div className="mb-4">
                <div className="text-sm text-slate-300 mb-1 text-right">
                  Question {currentQuestionIndex + 1} of {activeQuestions.length}
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Code Snippet Display */}
              <div className="bg-slate-900 p-4 rounded-md mb-6 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-sky-300 uppercase">{currentQuestion.language}</p>
                </div>
                <pre className="text-sm text-slate-200 whitespace-pre-wrap overflow-x-auto">
                  <code>{currentQuestion.snippet}</code>
                </pre>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-100">
                {currentQuestion.questionText}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  let buttonClass = 'bg-slate-700 hover:bg-slate-600 border-slate-600'; 
                  if (isAnswered) {
                    if (option.isCorrect) {
                      buttonClass = 'bg-green-700 border-green-500 text-white'; 
                    } else if (isSelected && !option.isCorrect) {
                      buttonClass = 'bg-red-700 border-red-500 text-white'; 
                    } else {
                      buttonClass = 'bg-slate-700 border-slate-600 opacity-70'; 
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-md border-2 transition-colors duration-150 ease-in-out text-sm sm:text-base
                        ${buttonClass}
                        ${isAnswered && !isSelected && !option.isCorrect ? 'cursor-default' : 'cursor-pointer'}
                        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-sky-400' : ''}
                      `}
                    >
                      {option.text}
                      {isAnswered && option.isCorrect && <CheckCircleIcon className="inline-block w-5 h-5 ml-2 text-white" />}
                      {isAnswered && isSelected && !option.isCorrect && <XCircleIcon className="inline-block w-5 h-5 ml-2 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation Section */}
              {isAnswered && (
                <div className={`p-4 rounded-md mb-6 text-sm
                  ${selectedAnswer?.isCorrect ? 'bg-green-800/50 border border-green-700' : 'bg-red-800/50 border border-red-700'}
                `}>
                  <p className="font-semibold mb-1">
                    {selectedAnswer?.isCorrect ? 'Correct!' : 'Not quite!'}
                  </p>
                  {showExplanation && <p className="text-slate-300">{currentQuestion.explanation}</p>}
                  {!showExplanation && (
                     <button 
                        onClick={() => setShowExplanation(true)}
                        className="text-xs text-sky-400 hover:underline mt-1 inline-flex items-center"
                    >
                        <LightBulbIcon className="w-4 h-4 mr-1" /> Show Explanation
                    </button>
                  )}
                </div>
              )}
              
              {/* Next Question Button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
                >
                  {currentQuestionIndex < activeQuestions.length - 1 ? 'Next Question' : 'Show Results'}
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : gamePhase === 'finished' && numQuestionsSelected !== null ? ( // Corrected: check numQuestionsSelected for finished phase
            // Game Over Screen
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Quiz Complete!
              </h2>
              <p className="text-xl mb-6 text-slate-200">
                Your Final Score: <span className="font-bold text-emerald-400">{score}</span> out of {numQuestionsSelected * 10}
              </p>
              <button
                onClick={handlePlayAgain} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
              >
                <ArrowPathIcon className="w-5 h-5" /> Play Again
              </button>
            </div>
          ) : null 
        }

        <div className="mt-10 text-center text-slate-400 text-xs">
            <p>Test your coding knowledge! Good luck!</p>
        </div>
      </div>
    </div>
  );
}
