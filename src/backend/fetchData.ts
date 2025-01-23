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

export interface QuestionType {
    currentQuestion:number,
    grid:any[] |string[],
    round:number,
    words:any[] | string[],
    type:string
}
export const fecthQuestions = async (deptType:string) =>{

    try{
        const collectionRef = collection(db,"netmazeQuestions");
        const currentRound = await getCurrentRound();
        const questions = await getDocs(query(collectionRef,where("round","==",currentRound),where("type","==",deptType)));
        if(questions.empty)
        {

        }
        else
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
    }catch(error){

    }
}


// export const fetchQuestions = async (event:number) =>{
//     try {
        
//     } catch (error) {
        
//     }
// }