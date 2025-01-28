import React, { useState, useEffect } from "react";
import 'react-toastify/ReactToastify.min.css'
import { useLocation, useNavigate } from "react-router-dom";
import GridBtn from "./GridBtn";
import Question from "./question";
import OnScreenKeyboard from "./onScreenKeyboard";
import useIsMobile from "../Custom/Hooks/isMobile";
import  { CrossWordType, fecthQuestions } from "../backend/fetchData";
import { updateCurrentIndex, updateScore } from "../backend/updateData";
// Utility functions for managing local storage and expiration time
const STORAGE_KEY = "crossword-answers";
const SCORE_KEY = "crossword-score";
const EXPIRATION_KEY = "crossword-expiration";
const TIMER_KEY = "crossword-timer";
const TIMER_FINISHED_KEY = "crossword-timer-finished";

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

const setExpirationTime = () => {
  const now = new Date();
  const expirationTime = now.getTime() + 25 * 60 * 1000; // 25 minutes
  localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
};

const isExpired = () => {
  const expirationTime = localStorage.getItem(EXPIRATION_KEY);
  if (!expirationTime) return true;
  const now = new Date().getTime();
  return now > parseInt(expirationTime, 10);
};

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
  localStorage.removeItem(TIMER_KEY);
  localStorage.removeItem(TIMER_FINISHED_KEY);
};

const CrossWord: React.FC = () => {
  
  // Load initial state from local storage or initialize
  const initialInputs = loadFromLocalStorage(STORAGE_KEY) || Array(400).fill('');
  const navigate = useNavigate();
  const initialScore = loadFromLocalStorage(SCORE_KEY) || 0;
  const [currentIndex,setCurrentIndex] = useState<number>(0);
  const [inputs, setInputs] = useState<string[]>(initialInputs);
  const [feedback, setFeedback] = useState<Record<string, boolean | undefined>>({});
  const [score, setScore] = useState<number>(initialScore);
  const [allQuestionsData,setAllQuestionsData] = useState<CrossWordType[]>([]);
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState<number>(0);
  const location = useLocation();
  const {participantData} = location.state;
  const isMobile = useIsMobile();

  useEffect(()=>{
        const fetchData = async () =>{
          try {
            console.log("fetched")
            const tempGrid:CrossWordType[] = await fecthQuestions(participantData?.type) as CrossWordType[]; 
            if (tempGrid) {
              console.log(tempGrid);
              setAllQuestionsData(tempGrid);
              setCurrentQuestionIndex(participantData?.round2?.currentIndex);
            }
          } catch (error) {
            
          }
        }
        fetchData();
    },[navigate,participantData])
  // Save inputs, score, and timer to local storage on change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, inputs);
    saveToLocalStorage(SCORE_KEY, score);
  }, [inputs, score]);
  // Set expiration time when component mounts
  useEffect(() => {
    if (isExpired()) {
      clearLocalStorage();
      setExpirationTime();
    }
  }, []);

  // Call checkAnswers after the component mounts
  useEffect(() => {
    if(allQuestionsData.length > 0)
    {
      checkAnswers();
    }
    
  }, []);



  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };



  const getCellData = () => {
    if (!allQuestionsData[currentQuestionIndex]) {
      return Array.from({ length: 400 }, () => ({
        isInteractive: false,
        value: "",
        questionNumbers: [],
        isCorrect: undefined,
      }));
    }
    const cellData = Array.from({ length: 400 }, () => ({
      isInteractive: false,
      value: "",
      questionNumbers: [] as number[],  // Update to store multiple numbers
      isCorrect: undefined as boolean | undefined,
    }));
    
    // Populate across clues
    Object.entries(allQuestionsData[currentQuestionIndex]?.grid?.across).forEach(([key, { answer, row, col }]) => {
      answer.split('').forEach((_, index) => {
        const cellIndex = row * 20 + (col + index);
        cellData[cellIndex].isInteractive = true;
        cellData[cellIndex].value = inputs[cellIndex];
        
        // Push across question number if it's the first letter
        if (index === 0) cellData[cellIndex].questionNumbers.push(parseInt(key, 10));
    
        // Ensure we keep previous question numbers (if from down clue)
        cellData[cellIndex].isCorrect = feedback[key] ?? undefined;
      });
    });
    
    // Populate down clues
    Object.entries(allQuestionsData[currentQuestionIndex]?.grid?.down).forEach(([key, { answer, row, col }]) => {
      answer.split('').forEach((_, index) => {
        const cellIndex = (row + index) * 20 + col;
        cellData[cellIndex].isInteractive = true;
        cellData[cellIndex].value = inputs[cellIndex];
    
        // Push down question number if it's the first letter
        if (index === 0) cellData[cellIndex].questionNumbers.push(parseInt(key, 10));
    
        // Ensure we keep previous question numbers (if from across clue)
        cellData[cellIndex].isCorrect = feedback[key] ?? undefined;
      });
    });
    
    return cellData;
  };

  const checkWord = (
    _: string,
    answer: string,
    row: number,
    col: number,
    isAcross: boolean
  ) => {
    let isCorrect:any = true;
    answer.split('').forEach((char, index) => {
      const cellIndex = isAcross ? row * 20 + (col + index) : (row + index) * 20 + col;

      if(inputs[cellIndex]==='')
      {
          isCorrect = undefined;
      }
      else if (inputs[cellIndex] !== char) {
        isCorrect = false;
      }
    });
    return isCorrect;
  };


  const checkAnswers = async () => {
    const newFeedback: Record<string, boolean | undefined> = {};
    let newScore = 0;

    Object.entries(allQuestionsData[currentQuestionIndex]?.grid?.across).forEach(([key, { answer, row, col }]) => {
      const isCorrect = checkWord(key, answer, row, col, true);
      newFeedback[key] = isCorrect;
      if (isCorrect) newScore += 1;
    });

    Object.entries(allQuestionsData[currentQuestionIndex]?.grid?.down).forEach(([key, { answer, row, col }]) => {
      const isCorrect = checkWord(key, answer, row, col, false);
      newFeedback[key] = isCorrect;
      if (isCorrect) newScore += 1;
    });

    setFeedback(newFeedback);
    await updateScore(participantData.lotNo,newScore,2);
    setScore(newScore);
    if(newScore == 20)
    {
      await updateCurrentIndex(participantData.lotNo,currentQuestionIndex,2);
      if(allQuestionsData.length > currentQuestionIndex+1)
        setCurrentQuestionIndex(currentQuestionIndex+1);
    }
  };

  const cellData = getCellData();

  
  const handleClick = (index:number)=>{
    if(cellData[index].isInteractive){
      setCurrentIndex(index);
    }
  }


  return (
    <div className="bg-[#1E1E2F] w-full h-screen overflow-auto items-center flex max-sm:flex-col">
    {
      allQuestionsData.length === 0 ? <p>Loading...</p> : 
      <>
<div className="w-[65rem] max-sm:w-fit h-screen overflow-auto bg-blue-400">
        <Question />
      </div>
      <div className="flex flex-col p-4 w-full h-full inset-0 justify-center items-center">
        <div className="flex flex-col w-full">
          <p className="text-2xl text-center text-white font-bold font-playfair mb-4">
            PUZZLE MYSTRIES
          </p>
          <div className="flex mx-10 mb-2 justify-between items-center">
            <div className="text-2xl font-playfair text-[#FFD700]">
              SCORE: {score}
            </div>
          </div>
          {/* <div className="text-lg">{formatTime(timer)}</div> */}
        </div>
        <div
          className="bg-gray-700 w-[40rem] h-[40rem] max-sm:w-[25rem] max-sm:h-[25rem] rounded-lg p-2"
          style={{
            display: "grid",
            gap:"2px",
            gridTemplateColumns: "repeat(20, 1fr)",
            gridTemplateRows: "repeat(20, 1fr)",
          }}
        >
          {cellData.map((cell, index) => (
            <GridBtn
              key={index}
              isInteractive={cell.isInteractive}
              handleClick={()=>{handleClick(index)}}
              onChange={(value) =>{
                cell.isInteractive && handleChange(index, value)}
              }
              value={cell.value}
              questionNumbers={cell.questionNumbers}
              isCorrect={cell.isCorrect}
               // Disable input based on timer
            />
          ))}
        </div>
        <button
          onClick={checkAnswers}
          className="mt-4 p-2 bg-[#388E3C] hover:bg-[#2E7D32] text-white rounded-md"
           // Disable button if timer is not running
        >
          Check Answers
        </button>
        {
          isMobile &&<OnScreenKeyboard onKeyPress={(e)=>{
            if(e == "{bksp}")
            {
              handleChange(currentIndex,"")
            }
            else
            {
              handleChange(currentIndex,e)
            }
            }} />
        }
        
      </div>
      </>
    }
      
    </div>
  );
};

export default CrossWord;
