//This File is for Updating data like score

import { collection,getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase"

export const updateCurrentIndex = async (lotNo:number,index:number,round:number) =>{
    try {
        const collectionRef = collection(db,"netmazeParticipants");
        const getData = await getDocs(query(collectionRef,where("lotNo","==",lotNo)))
        if(getData.empty)
        {

        }
        else
        {
            const key:string = `round${round}.currentIndex`
            await updateDoc(getData.docs[0].ref,{[key]:index+1})
        }
    } catch (error) {
        
    }
}
export const updateScore = async (lotNo:number,index:number,round:number) =>{
    try {
        const collectionRef = collection(db,"netmazeParticipants");
        const getData = await getDocs(query(collectionRef,where("lotNo","==",lotNo)))
        if(getData.empty)
        {

        }
        else
        {
            const data = getData.docs[0].data();
            const currentIndex:number = data?.[`round${round}`]?.currentIndex;
            const key:string = `round${round}.score${currentIndex}`;
            await updateDoc(getData.docs[0].ref,{[key]:index+1})
        }
    } catch (error) {
        
    }
}