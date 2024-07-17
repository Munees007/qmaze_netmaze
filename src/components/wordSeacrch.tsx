import React, { useEffect, useState } from 'react';
import Form from './Form'; // Adjust the path as per your project structure

interface SelectedPathItem {
  letter: string;
  index: number;
}

interface FoundWord {
  word: string;
  path: SelectedPathItem[];
  color: string;
}

const WordSearch: React.FC = () => {
  const words = ["JAVA", "PYTHON", "CPLUSPLUS", "BCA", "HTML", "CSS", "SQL"];
  const colors = ["green", "pink", "blue", "orange", "yellow"];
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
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const storedTime = localStorage.getItem('timeLeft');
    return storedTime ? JSON.parse(storedTime) : 300; // Default to 300 seconds (5 minutes)
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(() => {
    const formSubmitted = localStorage.getItem('formSubmitted');
    return formSubmitted ? false : true; // Show form if 'formSubmitted' is not set
  });

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('timeLeft', JSON.stringify(timeLeft)); // Store remaining time
  }, [timeLeft]);

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
    if (gameOver) return; // Disable selection if game over
    setIsSelecting(true);
    setSelectedPath([{ letter, index }]);
    setSelectedLetters(letter);
    setSelectionDirection(null); // Reset direction on new selection
  };

  const handleMouseOver = (letter: string, index: number) => {
    if (gameOver || !isSelecting) return; // Disable selection if game over or not selecting
    const lastSelected = selectedPath[selectedPath.length - 1];
    const lastIndex = lastSelected.index;

    if (isValidSelection(lastIndex, index)) {
      setSelectedPath([...selectedPath, { letter, index }]);
      setSelectedLetters(selectedLetters + letter);
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFormSubmit = () => {
    localStorage.setItem('formSubmitted', 'true');
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className={`wordGamebg h-screen flex justify-center items-center w-full`}>
        <div className='w-full flex justify-center gap-2  items-center mt-40 h-[32rem]'>
          <div className='grid grid-cols-10 gap-1 w-fit p-3 bg-[#1e1e24]  border-2 h-full border-black rounded-lg shadow-lg shadow-black'>
            {grid.map((letter, index) => (
              <div
                key={index}
                className={`select-none flex justify-center items-center shadow-sm shadow-gray-600 w-10 h-10 border-2 border-gray-700 rounded-lg cursor-pointer ${
                  isCellSelected(index) ? 'bg-gray-500' : 'bg-[#92140c]'
                }`}
                onMouseDown={() => handleMouseDown(letter, index)}
                onMouseOver={() => handleMouseOver(letter, index)}
                style={{ backgroundColor: getCellColor(index), pointerEvents: isCellSelected(index) || gameOver ? 'none' : 'auto' }}
              >
                <p className='font-playfair text-white'>{letter}</p>
              </div>
            ))}
          </div>
          <div className='flex flex-col border-2 h-full overflow-auto border-black shadow-lg shadow-black rounded-lg w-72  p-5 bg-[#1e1e24] text-white font-playfair text-xl'>
            <div className='flex flex-col items-center'>
              <p className=''>Selected Letters: {selectedLetters}</p>
              <p className='mt-4'>Score: {score}</p>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='mt-4'>Found Words:</h3>
              <ul className='mt-4'>
                {foundWords.map((foundWord, index) => (
                  <li key={index} style={{ }}>{foundWord.word}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded">
          Timer: {formatTime(timeLeft)}
        </div>
      </div>
    );
  }

  return (
    <div className="wordGamebg h-screen flex justify-center items-center w-full">
      <Form onSubmit={handleFormSubmit} />
    </div>
  );
};

export default WordSearch;
