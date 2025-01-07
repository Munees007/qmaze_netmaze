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

export const fetchQuestions = async (event:number) =>{
    try {
        
    } catch (error) {
        
    }
}