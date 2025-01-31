import React, { useEffect } from "react"
import CrossWordQuestionType from "../backend/fetchData";

// import { FcSearch } from "react-icons/fc";
interface QuestionProps {
  ques: CrossWordQuestionType;
}
const Question:React.FC<QuestionProps> = ({ques}) => {
  useEffect(()=>{
    console.log(ques)
    console.log(ques.across)
  },[])
  
  return (
    <div className="bg-[#2C2C3A]  border-2  border-[#2C2C2C] p-3 font-playfair w-full text-white">
        <p className="text-2xl font-extrabold">ACROSS</p>
      {Object.entries(ques.across).map(([key, { clue }]) => (
        <div key={key} className="flex my-2 items-center text-justify justify-between">
        <p  className=" text-lg font-semibold">
          {key}. {clue}
        </p>
        {/* <div>
        <FcSearch size={40} className="ml-10"/>
        </div> */}
        </div>
      ))}
      <p className="text-2xl font-extrabold">DOWN</p>
      {
        Object.entries(ques.down).map(([key,{clue}])=>(
            <div key={key} className="flex items-center my-2">
            <p className=" text-justify text-lg font-semibold justify-between">
                {key}. {clue}
            </p>
            {/* <div className="ml-10">
            <FcSearch size={40}/>
            </div> */}
            </div>
        ))
      }
    </div>
  );
};

export default Question;
