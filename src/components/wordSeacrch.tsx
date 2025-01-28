import React, { useEffect, useState } from 'react';
import { Snowfall } from 'react-snowfall';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css'
import { useLocation, useNavigate} from 'react-router-dom';
import { fecthQuestions } from '../backend/fetchData';
import { updateCurrentIndex, updateScore } from '../backend/updateData';




interface SelectedPathItem {
  letter: string;
  index: number;
}

interface FoundWord {
  word: string;
  path: SelectedPathItem[];
  color: string;
}

// interface GameData  {
//   wordsFound: FoundWord[],
//   score:number,
//   chanceleft:number,
//   time : number
// }

const WordSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {participantData} = location.state;
  const [words,setWords] = useState<string[][]>([]);
  const [grid,setGrid] = useState<string[][]>([])

  const colors = ["#dc0073", "#ff7700", "#005ae0"];
  const [selectedLetters, setSelectedLetters] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<SelectedPathItem[]>([]);
  const [selectionDirection, setSelectionDirection] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [score, setScore] = useState<number>(0);
  const [chanceCount, setChanceCount] = useState<number>(30);
  const [gameOver, __] = useState<boolean>(false);
  const [_, setIsMobile] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [selectedGrid,setSelectedGrid] = useState<number>(0); // Randomly select a grid


  useEffect(()=>{
      const fetchData = async () =>{
        try {
          const tempGrid = await fecthQuestions(participantData?.type); 
          if (tempGrid) {
            if(participantData.round1.currentIndex < tempGrid.length)
            {
              setSelectedGrid(participantData.round1.currentIndex)
              const grids:string[][] = []
              const wordsArr:string[][] = []
              tempGrid.map((data)=>{
                grids.push(data.grid as string[])
                wordsArr.push(data.words as string[])
              })
              console.log(grids)
              console.log(wordsArr)
              setGrid(grids)
              setWords(wordsArr); 
            }
            else
            {
              toast.info("You have completed all the grids for this round.",{autoClose: 10,onClose:()=>{
                navigate('/');
              }})
            }
          }
            
        } catch (error) {
          
        }
      }
      fetchData();
  },[navigate,participantData])

  useEffect(() => {
    if (chanceCount === 0) {
      // Update the score and proceed to the next grid
      const moveToNextGrid = async () => {
        await updateCurrentIndex(participantData.lotNo, selectedGrid, 1);
        await updateScore(participantData.lotNo, score, 0); // Update score
  
        // Reset local storage
        localStorage.setItem(
          "word-search-state",
          JSON.stringify({
            foundWords: [],
            score: 0,
            chanceCount: 30,
            selectedGrid: selectedGrid + 1, // Move to the next grid
          })
        );
  
        // Update selected grid
        setSelectedGrid((prev) => prev + 1);
  
        // Reset state for the new grid
        setFoundWords([]);
        setScore(0);
        setChanceCount(30);
        setSelectedPath([]);
        setSelectedLetters('');
        setSelectionDirection(null);
      };
  
      moveToNextGrid();
    }
  }, [chanceCount, participantData, selectedGrid, score]);
  

  const resetData = () =>{
    const initialState = {
      foundWords: [],
      score: 0,
      chanceCount: 30,
      selectedGrid,
    };
    localStorage.setItem("word-search-state", JSON.stringify(initialState));
    // Reset state for the new grid
    setFoundWords([]);
    setScore(0);
    setChanceCount(30);
    setSelectedPath([]);
    setSelectedLetters('');
    setSelectionDirection(null);
  }
  
  useEffect(() => {
    if (grid.length > 0 && words.length > 0) {
      // Check local storage after grid and words are loaded
      const savedState = JSON.parse(localStorage.getItem("word-search-state") || "{}");
  
      if (savedState.selectedGrid === selectedGrid) {
        // Load saved state
        setFoundWords(savedState.foundWords || []);
        setScore(savedState.score || 0);
        setChanceCount(savedState.chanceCount || 30);
      } else {
        // Initialize fresh state
        const initialState = {
          foundWords: [],
          score: 0,
          chanceCount: 30,
          selectedGrid,
        };
        localStorage.setItem("word-search-state", JSON.stringify(initialState));
      }
    }
  }, [grid, words, selectedGrid]); // Dependency: Ensure this runs only after grid/words/selectedGrid is updated
  useEffect(() => {
    if (grid.length > 0 && words.length > 0) {
      const state = {
        foundWords,
        score,
        chanceCount,
        selectedGrid,
      };
      localStorage.setItem("word-search-state", JSON.stringify(state));
    }
  }, [foundWords, score, chanceCount, selectedGrid, grid, words]);
    
  

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const handleMouseDown = (letter: string, index: number) => {
    if (gameOver) return;
    setIsSelecting(true);
    setSelectedPath([{ letter, index }]);
    setSelectedLetters(letter);
    setSelectionDirection(null);
  };

  const handleMouseMove = (letter: string, index: number) => {
    if (gameOver || !isSelecting) return;

    const lastSelected = selectedPath[selectedPath.length - 1];
    const lastIndex = lastSelected.index;

    if (isValidSelection(lastIndex, index)) {
      setSelectedPath([...selectedPath, { letter, index }]);
      setSelectedLetters(selectedLetters + letter);
    }
  };

  const handleMouseUp = () => {
    if (gameOver) return;
    setIsSelecting(false);
    checkWord(selectedLetters);
  };

  const handleTouchStart = (letter: string, index: number) => {
    if (gameOver) return;
    setIsSelecting(true);
    setSelectedPath([{ letter, index }]);
    setSelectedLetters(letter);
    setSelectionDirection(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameOver || !isSelecting) return;
  
    // Get touch coordinates
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
  
    if (target && target.dataset.index) {
      const newIndex = parseInt(target.dataset.index, 10); // Get index from the dataset
      const lastSelected = selectedPath[selectedPath.length - 1];
      const lastIndex = lastSelected.index;
  
      // Only update if the new index is valid
      if (isValidSelection(lastIndex, newIndex)) {
        setSelectedPath([...selectedPath, { letter: target.innerText, index: newIndex }]);
        setSelectedLetters(selectedLetters + target.innerText);
      }
    }
  };
  
  

  const handleTouchEnd = () => {
    if (gameOver) return;
    console.log("Touch end");
    setIsSelecting(false);
    checkWord(selectedLetters);
  };

  const checkWord = async (word: string) => {
    if (words[selectedGrid].includes(word)) {
      // If the word is found, highlight the word with a random color
      const color = getRandomColor();
      const newFoundWords = [...foundWords, { word, path: selectedPath, color }];
      setFoundWords(newFoundWords);
      await updateScore(participantData.lotNo,score,1);
      setScore(score + 1);

      
      if (newFoundWords.length === words[selectedGrid].length) {
        await updateCurrentIndex(participantData.lotNo,selectedGrid,1);
        resetData();
        setSelectedGrid((prev)=>prev+1)
      }
    } else {
      // Word is incorrect: reset the selection and reduce chances
      if (!toastVisible) {  // Only show toast if no other toast is visible
        setToastVisible(true);
        toast.error(`Incorrect word: ${word}`, { 
          autoClose: 2000,
          onClose: () => setToastVisible(false)  // Reset the flag when toast closes
        });
      }
      
  
      // Reset selected path and letters (remove colors)
      setSelectedPath([]);
      setSelectedLetters('');
    }
    setChanceCount((prev) => prev - 1);
  };
  

  const isValidSelection = (lastIndex: number, currentIndex: number): boolean => {
    const lastRow = Math.floor(lastIndex / 10);
    const lastCol = lastIndex % 10;
    const currentRow = Math.floor(currentIndex / 10);
    const currentCol = currentIndex % 10;
  
    // If no direction is set yet, determine the direction
    if (selectionDirection === null) {
      if (lastRow === currentRow && Math.abs(lastCol - currentCol) === 1) {
        setSelectionDirection('row');
      } else if (lastCol === currentCol && Math.abs(lastRow - currentRow) === 1) {
        setSelectionDirection('column');
      } else if (Math.abs(lastRow - currentRow) === 1 && Math.abs(lastCol - currentCol) === 1) {
        setSelectionDirection('diagonal');
      } else {
        return false;
      }
    }
  
    // Check the direction and return true if valid
    switch (selectionDirection) {
      case 'row':
        return lastRow === currentRow && Math.abs(lastCol - currentCol) === 1;
      case 'column':
        return lastCol === currentCol && Math.abs(lastRow - currentRow) === 1;
      case 'diagonal':
        return Math.abs(lastRow - currentRow) === 1 && Math.abs(lastCol - currentCol) === 1;
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



  return (
    <div className={`wordGamebg overflow-hidden h-screen flex justify-center items-center w-full`}>
      <Snowfall />
      <div className='overflow-hidden w-full max-md:flex-col max-sm:flex-col flex justify-center gap-2 items-center h-[32rem]'>
        <div className='max-md:flex max-sm:flex border-teal-500 shadow-lg shadow-white/30 rounded-lg border-2 bg-black/60 hidden items-center flex-col justify-between w-fit px-10 text-2xl font-playfair text-white'>
          <p className=''>Chance Left : {chanceCount}</p>
          <p className=''>Selected Letters: {selectedLetters}</p>
          <p className=''>Score: {score}</p>
        </div>
        <div className='grid grid-cols-10 gap-1 w-fit p-3 bg-black/60 border-2 h-full border-teal-500 rounded-lg shadow-lg shadow-white/30'>
          {grid[selectedGrid]?.map((letter, index) => (
            <div
            key={index}
            data-index={index}
            className={`select-none flex justify-center items-center shadow-lg shadow-teal-700 max-sm:w-8 max-sm:h-8 max-md:w-8 max-md:h-8 w-10 h-10 border-2 border-black rounded-lg cursor-pointer ${
              isCellSelected(index) ? 'bg-gray-500' : 'bg-teal-700'
            }`}
            onMouseDown={() => handleMouseDown(letter, index)}
            onMouseMove={() => handleMouseMove(letter, index)}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleTouchStart(letter, index)}
            onTouchMove={(e) => handleTouchMove(e)}
            onTouchEnd={handleTouchEnd}
            style={{
              backgroundColor: getCellColor(index),
            }}
          >
            <p className="font-playfair text-white">{letter}</p>
          </div>
          ))}
        </div>
        <div className='flex flex-col border-2 h-full overflow-auto max-sm:hidden max-md:hidden  border-teal-500 shadow-lg shadow-white/30 rounded-lg w-72 p-5 bg-black/60 text-white font-playfair text-xl'>
          <div className='flex flex-col  items-center'>
            <p className=''>Chance Left : {chanceCount}</p>
            <p className=''>Selected Letters: {selectedLetters}</p>
            <p className='mt-4'>Score: {score}</p>
          </div>
          <div className='flex flex-col items-center'>
            <h3 className='mt-4 max-sm:mt-0 max-md:mt-0'>Found Words:</h3>
            <ul className='mt-4'>
              {foundWords.map((foundWord, index) => (
                <li key={index} style={{  }}>{foundWord.word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer position='top-right'/>
    </div>
  );
};

export default WordSearch;
