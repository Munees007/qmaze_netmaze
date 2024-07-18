

import { Snowfall } from "react-snowfall";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
const HomePage = () =>{
    const [currentImg,setCurrentImg] = useState<string>("w2");
    const backGround = ["w1","w2","w3"];
    const navigate = useNavigate();

    useEffect(()=>{
            const interval = setInterval(()=>{
                    const current:number = backGround.indexOf(currentImg);
                    const nextIndex = (current+1) % backGround.length;
                    setCurrentImg(backGround[nextIndex]);
            },5000)

            return()=>{clearInterval(interval)}
    },[currentImg,backGround])

    const changePath = () =>{
        navigate('/wordGame');
    }
    return(
        <div className="font-shadow h-fit overflow-hidden flex">
            <Snowfall/>
            <img src={`/${currentImg}.jpg`} className="animate-[ping_1s]"></img>
            <button 
                className="absolute bottom-0 right-2 motion-safe:animate-[bounce_1.2s_infinite]" 
                title="Click to Start"
                onClick={changePath}
            >
                    <img src="/btn.png" className="w-36 h-36"></img>
            </button>
        </div>
    );
}

export default HomePage;