import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

// This file is to fetch necessary data
export const fetchParticipantData = async (email:string) =>{
    try {
        const collectionRef = collection(db,"netmazeParticipants");
        const getDocRef = await getDocs(query(collectionRef,where("email","==",email)));

        if(getDocRef.empty)
        {
            toast.error("no user found");
            return;
        }

        return getDocRef.docs[0].data();
    } catch (error) {
        
    }
}
export const getCurrentRound = async ():Promise<Number> => {
    const Ref = await getDocs(collection(db,"netmazeCurrentRound"));
    if(Ref.empty)
    {
        return 0;
    }
    else
    {
        const temp = Ref.docs[0].data().round;
        return temp;
    }
}

export interface GridData {
    across: Record<string, { answer: string; row: number; col: number }>;
    down: Record<string, { answer: string; row: number; col: number }>;
  }

  export default interface CrossWordQuestionType{
    across: Record<string, { clue:string,answer:string }>;
    down: Record<string, { clue:string,answer:string }>
  }

export interface CrossWordType{
    currentQuestion:number,
    grid:GridData,
    round:number,
    words:CrossWordQuestionType,
    type:string
}

export interface QuestionType {
    currentQuestion:number,
    grid:string[],
    round:number,
    words:string[],
    type:string
}
export const fecthQuestions = async (deptType:string):Promise<QuestionType[] | CrossWordType[]> =>{

    try{
        const collectionRef = collection(db,"netmazeQuestions");
        const currentRound = await getCurrentRound();
        const questions = await getDocs(query(collectionRef,where("round","==",2),where("type","==",deptType)));
            if(currentRound == 0)
            {
                const data:QuestionType[] = [];

            questions.docs.map((question)=>{
                const daTa = question.data();
                const temp:QuestionType = {
                    currentQuestion:daTa.currentQuestion,
                    grid:daTa.grid,
                    words:daTa.words,
                    round:daTa.round,
                    type:daTa.type
                }
                data.push(temp)
            })
            return data;
            }
            else
            {
                const data:CrossWordType[] = [];
                questions.docs.map((question)=>{
                    const daTa = question.data();
                    const temp:CrossWordType = {
                        currentQuestion:daTa.currentQuestion,
                        grid:daTa.grid,
                        words:daTa.words,
                        round:daTa.round,
                        type:daTa.type
                    }
                    data.push(temp)
                })
                return data;
            }
    } catch (error) {
        console.error(error);
        return [];

    }
}


// export const fetchQuestions = async (event:number) =>{
//     try {
        
//     } catch (error) {
        
//     }
// }