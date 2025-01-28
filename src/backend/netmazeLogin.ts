import { collection, getDocs, query, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../firebase"
import { toast } from "react-toastify";

//verify is the player is a netmaze particcipant
export const isNetmazeParticipant = async (email:string) =>{
    try {
        const collectionRef = collection(db,"netmazeParticipants");

        const getDocRef = await getDocs(query(collectionRef,where("email","==",email)));

        if(getDocRef.empty)
        {
            toast.error("No user Found");
            auth.signOut();
            return;
        }

        if(getDocRef.docs[0].data().isLogin === true)
        {
            toast.error("Already a user is logined with this email");
            auth.signOut();
            return;
        }

        await updateDoc(getDocRef.docs[0].ref,{isLogin:true});
        localStorage.setItem("isLogin","true");
        toast.success("Login Successful");
    } catch (error) {
        console.log(error);   
    }
}


export const LogoutParticicpant = async (email:string)=>{
    try {
        const collectionRef = collection(db,"netmazeParticipants");
        const getDocRef = await getDocs(query(collectionRef,where("email","==",email)));

        if(getDocRef.empty)
        {
            toast.error("No user Found");
            return;
        }
        await updateDoc(getDocRef.docs[0].ref,{isLogin:false})
        toast.success("Logout Successful");
    } catch (error) {
        
    }
}