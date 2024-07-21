import React, { useEffect, useState } from "react";
import { getAllUserData, getFlagData, setFlagData } from "./storeData";

interface UserData {
  formData: {
    name: string;
    rollNumber: string;
    className: string;
    email: string;
  };
  gameData: {
    chanceleft: number;
    score: number;
    time: number;
    gridNum:number;
    wordsFound: {
      color: string;
      path: { index: number; letter: string }[];
      word: string;
    }[];
  };
}

const UserDataComponent: React.FC = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [flag,setFlag] = useState<any>();

  const fetchData = async (type: string) => {
    try {
      const userData = await getAllUserData();
      const usersArray = Object.keys(userData).map(key => ({ key, ...userData[key] }));
      
      // Manual sorting based on the selected type
      if (type === "score") {
        usersArray.sort((a, b) => b.gameData.score - a.gameData.score);
      } else if (type === "time") {
        usersArray.sort((a, b) => b.gameData.time - a.gameData.time);
      } else if (type === "chanceleft") {
        usersArray.sort((a, b) => b.gameData.chanceleft - a.gameData.chanceleft);
      }
      const getFlag = await getFlagData();
      setUserList(usersArray);
      setFlag(getFlag);
      console.log(usersArray)
      console.log(flag)
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    fetchData(selectedValue);
  };
  const handleTimerStart = async () =>{
    await setFlagData(!flag);
    setFlag(!flag);
  }

  useEffect(() => {
    fetchData("all");
  }, [dataFetched,flag]);

  if (!userList) {
    return <p>Loading...</p>;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full h-screen overflow-auto bg-teal-900 p-5">
      <h2 className="text-center font-playfair text-white text-3xl font-bold">
        All USER DETAILS
      </h2>
      <p className="text-white">Time Started : {flag ? "true" : "false"}</p>
        <button onClick={handleTimerStart} className="bg-teal-400 px-4 py-1 rounded-md border-2 font-playfair font-bold">{flag ? "off" : "on"}</button>
      <div className="absolute right-5">
        <select onChange={handleSelectChange} className="bg-teal-400 border-2 border-white rounded-md shadow-md hover:bg-teal-300 shadow-black">
          <option value="all">Overall</option>
          <option value="score">Score</option>
          <option value="time">Time</option>
          <option value="chanceleft">Chance Left</option>
        </select>
      </div>
      <table className="w-full overflow-auto border-collapse mt-10">
        <thead className="rounded-lg text-white text-center font-playfair border-2">
          <tr>
            <th className="py-3 w-fit border-r-2 bg-teal-600">NAME</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">ROLL NO</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">CLASS</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">EMAIL</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">gridNum</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">SCORE</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">CHANCE LEFT</th>
            <th className="py-3 w-fit border-r-2 bg-teal-600">TIME LEFT</th>
            <th className="py-3 w-96 bg-teal-600">WORDS FOUND</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={index} className="text-black font-semibold font-playfair border-2">
              <td className="pl-2 w-fit border-r-2 bg-teal-400">{user.formData.name}</td>
              <td className="w-fit border-r-2 bg-teal-400 text-center">{user.formData.rollNumber}</td>
              <td className="w-fit border-r-2 bg-teal-400 text-center">{user.formData.className}</td>
              <td className="pl-2 w-fit border-r-2 bg-teal-400">{user.formData.email}</td>
              <td className="pl-2 w-fit border-r-2 bg-teal-400">{user.gameData.gridNum + 1}</td>
              <td className="w-fit border-r-2 bg-teal-400 text-center">{user.gameData.score}</td>
              <td className="w-fit border-r-2 bg-teal-400 text-center">{user.gameData.chanceleft}</td>
              <td className="w-fit border-r-2 bg-teal-400 text-center">{formatTime(user.gameData.time)}</td>
              <td className="bg-teal-400 overflow-auto">
                <div className="flex flex-col h-20">
                  {
                    user.gameData.wordsFound ?
                  user.gameData.wordsFound.map((val, index) => (
                    <p key={index} className="ml-2">{val.word}</p>
                  )):<p className="ml-2">NO Words Found</p>
                }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataComponent;
