import React, { useEffect, useState } from 'react';
import './App.css';

interface SelectedPathItem {
  letter: string;
  index: number;
}

interface FoundWord {
  word: string;
  path: SelectedPathItem[];
  color: string;
}

const App: React.FC = () => {
  const words = ["JAVA", "PYTHON", "CPLUSPLUS", "BCA", "HTML", "CSS", "SQL"];
  const colors = ["red", "green", "pink", "blue", "orange", "purple", "yellow"];
  const [selectedLetters, setSelectedLetters] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<SelectedPathItem[]>([]);
  const [selectionDirection, setSelectionDirection] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<FoundWord[]>(() => {
    const storedWords = localStorage.getItem('foundWords');
    return storedWords ? JSON.parse(storedWords) : [];
  });
  const [score, setScore] = useState<number>(() => {
    const storedScore = localStorage.getItem('score');
    return storedScore ? JSON.parse(storedScore) : 0;
  });

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (words.includes(selectedLetters) && !foundWords.some(word => word.word === selectedLetters)) {
        const color = getRandomColor();
        const newFoundWords = [...foundWords, { word: selectedLetters, path: selectedPath, color }];
        setFoundWords(newFoundWords);
        setScore(score + 1);
        localStorage.setItem('foundWords', JSON.stringify(newFoundWords));
        localStorage.setItem('score', JSON.stringify(score + 1));
      } else {
        setSelectedPath([]);
      }
      setIsSelecting(false);
      setSelectionDirection(null);
      setSelectedLetters('');
    };

    if (isSelecting) {
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, selectedLetters, foundWords, score, words]);

  const handleMouseDown = (letter: string, index: number) => {
    setIsSelecting(true);
    setSelectedPath([{ letter, index }]);
    setSelectedLetters(letter);
    setSelectionDirection(null); // Reset direction on new selection
  };

  const handleMouseOver = (letter: string, index: number) => {
    if (isSelecting) {
      const lastSelected = selectedPath[selectedPath.length - 1];
      const lastIndex = lastSelected.index;

      if (isValidSelection(lastIndex, index)) {
        setSelectedPath([...selectedPath, { letter, index }]);
        setSelectedLetters(selectedLetters + letter);
      }
    }
  };

  const isValidSelection = (lastIndex: number, currentIndex: number): boolean => {
    const lastRow = Math.floor(lastIndex / 10);
    const lastCol = lastIndex % 10;
    const currentRow = Math.floor(currentIndex / 10);
    const currentCol = currentIndex % 10;

    if (selectionDirection === null) {
      if (lastRow === currentRow) {
        setSelectionDirection('row');
      } else if (lastCol === currentCol) {
        setSelectionDirection('column');
      } else if (Math.abs(lastRow - currentRow) === Math.abs(lastCol - currentCol)) {
        setSelectionDirection('diagonal');
      } else {
        return false;
      }
    }

    switch (selectionDirection) {
      case 'row':
        return lastRow === currentRow;
      case 'column':
        return lastCol === currentCol;
      case 'diagonal':
        return Math.abs(lastRow - currentRow) === Math.abs(lastCol - currentCol);
      default:
        return false;
    }
  };

  const isCellSelected = (index: number): boolean => {
    return selectedPath.some(item => item.index === index);
  };

  const getCellColor = (index: number): string => {
    for (const foundWord of foundWords) {
      if (foundWord.path.some(item => item.index === index)) {
        return foundWord.color;
      }
    }
    return '';
  };

  const grid = [
    'J', 'A', 'V', 'A', 'R', 'A', 'N', 'D', 'O', 'M',
    'B', 'C', 'A', 'X', 'L', 'X', 'Y', 'L', 'Q', 'Z',
    'M', 'A', 'R', 'L', 'C', 'S', 'S', 'N', 'X', 'U',
    'H', 'T', 'M', 'L', 'F', 'U', 'V', 'T', 'R', 'V',
    'K', 'C', 'X', 'X', 'C', 'P', 'L', 'U', 'S', 'K',
    'O', 'Q', 'T', 'W', 'S', 'Q', 'L', 'O', 'E', 'I',
    'N', 'D', 'A', 'S', 'Q', 'K', 'L', 'O', 'Q', 'T',
    'C', 'O', 'D', 'E', 'A', 'W', 'L', 'J', 'B', 'R',
    'M', 'P', 'T', 'H', 'O', 'N', 'N', 'I', 'S', 'U',
    'A', 'X', 'B', 'R', 'T', 'A', 'X', 'R', 'M', 'W'
  ];

  return (
    <>
      <h1 className='text-center text-3xl font-serif font-bold m-2'>WORD SEACRCH</h1>
      <div className='w-full flex justify-center items-center mt-10'>
      <div className='grid grid-cols-10 gap-1 w-fit p-3 border-2 border-black rounded-lg shadow-lg shadow-black'>
        {grid.map((letter, index) => (
          <div
            key={index}
            className={`select-none flex justify-center items-center w-10 h-10 border-2 border-black rounded-lg cursor-pointer ${
              isCellSelected(index) ? 'bg-gray-500' : 'bg-transparent hover:bg-gradient-to-r from-red-600 via-white to-sky-500'
            }`}
            onMouseDown={() => handleMouseDown(letter, index)}
            onMouseOver={() => handleMouseOver(letter, index)}
            style={{ backgroundColor: getCellColor(index), pointerEvents: isCellSelected(index) ? 'none' : 'auto' }}
          >
            <p>{letter}</p>
          </div>
        ))}
      </div>
      
      <div className='flex flex-col border-2 ml-10 border-black shadow-lg shadow-black rounded-lg w-fit p-5 h-fit'>
      <p>Selected Letters: {selectedLetters}</p>
      <p>Score: {score}</p>
      
      <div>
        <h3>Found Words:</h3>
        <ul>
          {foundWords.map((foundWord, index) => (
            <li key={index} style={{ color: foundWord.color }}>{foundWord.word}</li>
          ))}
        </ul>
      </div>
      </div>
      </div>
    </>
  );
};

export default App;
