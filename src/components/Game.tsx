import React, { useState, useEffect } from 'react';

type SudokuGrid = (string | number)[][];

interface Riddle {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Pre-filled Sudoku Grid (example)
const initialSudokuGrid: SudokuGrid = [
  [5, 3, '', '', 7, '', '', '', ''],
  [6, '', '', 1, 9, 5, '', '', ''],
  ['', 9, 8, '', '', '', '', 6, ''],
  [8, '', '', '', 6, '', '', '', 3],
  [4, '', '', 8, '', 3, '', '', 1],
  [7, '', '', '', 2, '', '', '', 6],
  ['', 6, '', '', '', '', 2, 8, ''],
  ['', '', '', 4, 1, 9, '', '', 5],
  ['', '', '', '', 8, '', '', 7, 9],
];

// Sudoku Component
const Sudoku: React.FC<{
  onCheckAnswer: (isCorrect: boolean) => void;
  onSudokuCompleted: () => void;
}> = ({ onCheckAnswer, onSudokuCompleted }) => {
  const [grid, setGrid] = useState<SudokuGrid>(initialSudokuGrid);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  const checkSudoku = () => {
    const isValid = grid.every((row, rowIndex) =>
      row.every((value, colIndex) => {
        if (value === '') return true; // Skip empty cells
        return value === initialSudokuGrid[rowIndex][colIndex].toString();
      })
    );
    onCheckAnswer(isValid); // Pass result to parent component
    setIsChecked(true); // Disable further edits
  };

  const checkProgress = () => {
    let completedRows = 0;
    let completedCols = 0;

    // Check completed rows
    for (let row = 0; row < 9; row++) {
      if (grid[row].every(cell => cell !== '')) {
        completedRows++;
      }
    }

    // Check completed columns
    for (let col = 0; col < 9; col++) {
      if (grid.every(row => row[col] !== '')) {
        completedCols++;
      }
    }

    if (completedRows >= 3 || completedCols >= 3) {
      onSudokuCompleted(); // Trigger riddle display
    }
  };

  useEffect(() => {
    checkProgress();
  }, [grid]); // Check progress whenever the grid changes

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(9, 1fr)' }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="text"
              maxLength={1}
              value={value === '' ? '' : value}
              style={{
                width: '50px',
                height: '50px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderTop: rowIndex === 0 ? '3px solid black' : '1px solid #ccc',
                borderBottom: rowIndex % 3 === 2 ? '3px solid black' : '1px solid #ccc',
                borderRight: colIndex === 8 ? '3px solid black' : '1px solid #ccc',
                borderLeft: colIndex % 3 === 0 ? '3px solid black' : 'none',
                backgroundColor: isChecked && value !== initialSudokuGrid[rowIndex][colIndex].toString()
                  ? 'red' : '',
              }}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              disabled={isChecked || initialSudokuGrid[rowIndex][colIndex] !== ''}
            />
          ))}
        </div>
      ))}
      <button onClick={checkSudoku} style={{ backgroundColor: '#28a745', color: 'white' }}>
        Check Answer
      </button>
    </div>
  );
};

// Riddle Component
const riddles: Riddle[] = [
  { question: "What is 2 + 2?", options: ["4", "5", "3", "6"], correctAnswer: "4" },
  { question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], correctAnswer: "Paris" },
  { question: "Which planet is known as the Red Planet?", options: ["Mars", "Earth", "Jupiter", "Venus"], correctAnswer: "Mars" },
];

const RiddleComponent: React.FC<{ onAnswer: (correct: boolean) => void }> = ({ onAnswer }) => {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentRiddle = riddles[currentRiddleIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (option === currentRiddle.correctAnswer) {
      onAnswer(true); // Correct answer
    } else {
      onAnswer(false); // Incorrect answer
    }
    setTimeout(() => {
      if (currentRiddleIndex < riddles.length - 1) {
        setCurrentRiddleIndex(currentRiddleIndex + 1);
        setSelectedOption(null);
      }
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>{currentRiddle.question}</h2>
      <div style={{ marginTop: '20px' }}>
        {currentRiddle.options.map((option) => (
          <button
            key={option}
            style={{
              padding: '10px',
              backgroundColor: selectedOption === option
                ? option === currentRiddle.correctAnswer
                  ? 'green'
                  : 'red'
                : 'blue',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Game Component
const Game: React.FC = () => {
  const [showRiddle, setShowRiddle] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [riddleShown, setRiddleShown] = useState<boolean>(false); // Prevent showing riddle multiple times

  const handleRiddleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }
    setShowRiddle(false);
    setRiddleShown(false); // Reset riddle shown flag for next round
  };

  const handleSudokuAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 2); // Award more points for solving Sudoku
    }
    if (!riddleShown) { // Show riddle only if not shown before
      setShowRiddle(true); // Show riddle after checking Sudoku
      setRiddleShown(true); // Mark riddle as shown
    }
  };

  const handleSudokuCompleted = () => {
    if (!riddleShown) { // Prevent riddle showing more than once
      setShowRiddle(true);
      setRiddleShown(true); // Mark riddle as shown
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', textAlign: 'center' }}>Sudoku Game with Riddles</h1>
      <h2 style={{ textAlign: 'center' }}>Score: {score}</h2>

      {showRiddle ? (
        <RiddleComponent onAnswer={handleRiddleAnswer} />
      ) : (
        <Sudoku onCheckAnswer={handleSudokuAnswer} onSudokuCompleted={handleSudokuCompleted} />
      )}
    </div>
  );
};

export default Game;
