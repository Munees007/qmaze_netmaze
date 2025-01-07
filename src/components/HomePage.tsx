import { Snowfall } from "react-snowfall";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFlagData } from "./storeData";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';

import {BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Form from "./Form";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { isNetmazeParticipant } from "../backend/netmazeLogin";
import { fetchParticipantData } from "../backend/fetchData";
import { auth } from "../firebase";

const HomePage = () => {
    const [currentImg, setCurrentImg] = useState<string>("w2");
    const backGround = ["w1", "w2", "w3"];
    const navigate = useNavigate();
    const [isLogined,setIsLogined] = useState<boolean>(false);

    const handleImageChange = (direction: "next" | "prev") => {
        const currentIndex = backGround.indexOf(currentImg);
        const nextIndex = direction === "next" ? (currentIndex + 1) % backGround.length : (currentIndex - 1 + backGround.length) % backGround.length;
        setCurrentImg(backGround[nextIndex]);
    };

    const changePath = async () => {
        const flag = await getFlagData();

        if (flag) {
            localStorage.setItem('timeFlag', 'true');
            navigate('/wordGame');
        } else {
            toast.info("Kindly wait for some more minutes to get started");
        }
    };
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

    useEffect(()=>{
      const fetchData = async () =>{
        const participantData = await fetchParticipantData(auth.currentUser?.email!);
        if(participantData)
          setIsLogined(participantData.isLogin);
      }

      fetchData();
      
    },[])

    return ( !isLogined && <Form onGoogleSignIn={handleGoogleSignIn}/>)

    return (
      <div className="font-shadow h-screen w-full overflow-hidden flex relative">
        <Snowfall />
        <img
          src={`/${currentImg}.jpg`}
          className="w-full h-full animate-[ping_1s]"
          alt="Background"
        />
        {backGround.indexOf(currentImg) === 0 && (
          <div className="absolute text-xl font-bold inset-0 flex items-center justify-center">
            <div className="bg-gray-100 font-playfair p-6 rounded-lg shadow-lg max-w-2xl w-full text-center">
              <p className="text-2xl  mb-4">
                This word search game was created by Munees and organized by the
                III BCA B students.
              </p>
              <p className="text-xl font-semibold mb-4">
                We would like to extend our special thanks to our <b>seniors</b> and
                the <b>faculty members</b> for their invaluable support and guidance.
              </p>
              <p className="text-xl font-semibold mb-4">
                A heartfelt thank you to our <b>Head of Department </b>for approving
                and encouraging this event.
              </p>
              <p className="text-xl font-semibold mb-4">
                We appreciate your <b>participation</b> and enthusiasm. We hope to see
                you in future events!
              </p>
              <p className="text-xl font-semibold">
                Best regards,
                <br />
                R. Karthik Balan <br />
                P. Muneeswaran <br />
                III BCA B Students
              </p>
            </div>
          </div>
        )}
        {backGround.indexOf(currentImg) === 2 && (
          <div className="absolute inset-0  flex items-center justify-center">
            <video src="/demo1.mp4" autoPlay={true} controls className="w-[50rem] border-4 border-pink-700 shadow-md shadow-pink-600 rounded-md">
              <source src="/demo1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className="absolute inset-y-1/2 left-0 right-0 flex justify-between px-4 z-10">
          <button
            className="bg-gray-800 flex items-center animate-scale text-white p-4 rounded-full"
            title="Previous Image"
            onClick={() => handleImageChange("prev")}
          >
            <BiSolidLeftArrow />
          </button>
          <button
            className="bg-gray-800 flex items-center animate-scale  text-white p-4 rounded-full"
            title="Next Image"
            onClick={() => handleImageChange("next")}
          >
            <BiSolidRightArrow />
          </button>
        </div>
        <button
          className="absolute bottom-0 right-2 motion-safe:animate-[bounce_1.2s_infinite] z-10"
          title="Click to Start"
          onClick={changePath}
        >
          <img src="/btn.png" className="w-36 h-36" alt="Start Button" />
        </button>
        <ToastContainer />
      </div>
    );
};

export default HomePage;
