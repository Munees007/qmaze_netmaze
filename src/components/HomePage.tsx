import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getFlagData } from "./storeData";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import Form from "./Form";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { isNetmazeParticipant, LogoutParticicpant } from "../backend/netmazeLogin";
import { fetchParticipantData } from "../backend/fetchData";
import { auth } from "../firebase";
import { BiLogOutCircle } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

type RoundDataType =
{
  Rule: string[];
  imgPath:string;
  navigateTo:string;
}
const HomePage = () => {
    //const navigate = useNavigate();
    const [isLogined,setIsLogined] = useState<boolean>(false);
    const [participantData,setParticipantData] = useState<any>(null);
    const [roundData,_] = useState<RoundDataType[]>([
      {
        Rule:[],
        imgPath:"./netmaze.png",
        navigateTo:"WordSearch"
      },
      {
        Rule:[],
        imgPath:"./netmaze.png",
        navigateTo:"WordSearch"
      },
      {
        Rule:[],
        imgPath:"./netmaze.png",
        navigateTo:"WordSearch"
      },
    ]);

    // const changePath = async () => {
    //     const flag = await getFlagData();

    //     if (flag) {
    //         localStorage.setItem('timeFlag', 'true');
    //         navigate('/wordGame');
    //     } else {
    //         toast.info("Kindly wait for some more minutes to get started");
    //     }
    // };
    const handleGoogleSignIn = async ()=>{
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await isNetmazeParticipant(result?.user?.email!);
      } catch (error) {
        toast.error("Failed to sign in with Google");
      }
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
              try {
                  const participantData = await fetchParticipantData(user.email!);
                  setIsLogined(participantData?.isLogin ?? false);
                  setParticipantData(participantData);
              } catch (error) {
                  toast.error("Error fetching participant data");
              }
          } else {
              setIsLogined(false);
          }
      });
      return () => unsubscribe();
  }, []);

    return !isLogined ? (
      <Form onGoogleSignIn={handleGoogleSignIn} />
    ) : (
      <div className=" h-screen w-full overflow-hidden flex flex-col relative">
        {/* header */}
        <div className="w-full font-shadow bg-[#1c2541] font-bold h-fit text-white p-3 flex justify-between">
          <p className="text-3xl">NETMAZE</p>
          <BiLogOutCircle size={40} onClick={ async()=>{
            await LogoutParticicpant(auth.currentUser?.email!);
          }} className="hover:scale-105 active:scale-95 cursor-pointer"/>
        </div>
        {/* Participant Details */}
        <div className="m-5 font-serif text-xl font-extralight space-y-3">
          <p className="text-lg md:text-xl">Hello, {participantData?.name}</p>
          <p className="text-lg md:text-xl">
            College name: {participantData?.collegeName}
          </p>
          <p className="text-lg md:text-xl">Lot No: {participantData?.lotNo}</p>
        </div>
        {/* Events */}
        <div className="flex w-full justify-center">
        <div className="grid grid-cols-3 m-4 gap-10">
          { 
              roundData.map((round,index)=>(
                <div key={index} className="bg-[#1282a2] text-white w-fit p-2 rounded-md shadow-lg shadow-black flex flex-col justify-center items-center">
                    <img src={round.imgPath} className="w-36 h-36"></img>
                    <span className="flex items-center gap-2 cursor-pointer"><BsEye/> Rules</span>
                    <p>Round {index+1}</p>
                </div>
              ))
          }
        </div>
        </div>
        <ToastContainer />
      </div>
    );
};

export default HomePage;
