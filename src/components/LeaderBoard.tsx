import { useEffect, useState } from "react";
import { getParticipantsData } from "../backend/fetchData";

// Function to calculate total time from an object containing time entries (seconds + nanoseconds)
const calculateTotalTime = (round: { [key: string]: any }): number => {
  let totalTime = 0;
  for (const key in round) {
    if (key.startsWith("time")) {
      totalTime += round[key].seconds * 1000 + round[key].nanoseconds / 1e6; // Convert to milliseconds
    }
  }
  return totalTime;
};

// Function to calculate total score from an object containing score entries
const calculateTotalScore = (round: { [key: string]: any }): number => {
  let totalScore = 0;
  for (const key in round) {
    if (key.startsWith("score")) {
      totalScore += round[key];
    }
  }
  return totalScore;
};

// Function to convert milliseconds to a readable time format (hh:mm:ss)
// const formatTime = (milliseconds: number): string => {
//   const seconds = Math.floor(milliseconds / 1000);
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;
//   return `${hours.toString().padStart(2, "0")}:${minutes
//     .toString()
//     .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

interface Participant {
  name: string;
  lotNo: number;
  type: string;
  round1: { [key: string]: any };
  round2: { [key: string]: any };
  round1TotalTime: number;
  round2TotalTime: number;
  totalScore: number;
  wholeTotalTime: number;
}

const LeaderBoard = () => {
  const [UG, setUG] = useState<Participant[]>([]);
  const [PG, setPG] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getParticipantsData();
      if (response) {
        // Process UG participants
        const ug = response
          .filter((item: any) => item.type === "UG")
          .map((item: any) => {
            const round1TotalTime = calculateTotalTime(item.round1);
            const round2TotalTime = calculateTotalTime(item.round2);
            const round1Score = calculateTotalScore(item.round1);
            const round2Score = calculateTotalScore(item.round2);
            const totalScore = round1Score + round2Score;
            const wholeTotalTime = round1TotalTime + round2TotalTime;

            return {
              ...item,
              round1TotalTime,
              round2TotalTime,
              totalScore,
              wholeTotalTime,
            };
          })
          .sort(
            (a: Participant, b: Participant) =>
              b.totalScore - a.totalScore
          ); // Sort by total score in descending order

        // Process PG participants similarly
        const pg = response
          .filter((item: any) => item.type === "PG")
          .map((item: any) => {
            const round1TotalTime = calculateTotalTime(item.round1);
            const round2TotalTime = calculateTotalTime(item.round2);
            const round1Score = calculateTotalScore(item.round1);
            const round2Score = calculateTotalScore(item.round2);
            const totalScore = round1Score + round2Score;
            const wholeTotalTime = round1TotalTime + round2TotalTime;

            return {
              ...item,
              round1TotalTime,
              round2TotalTime,
              totalScore,
              wholeTotalTime,
            };
          })
          .sort(
            (a: Participant, b: Participant) =>
              b.totalScore - a.totalScore
          ); // Sort by total score in descending order

        setUG(ug);
        setPG(pg);
      }
    };
    fetchData();
  }, []);

  const renderTable = (data: Participant[], title: string) => (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Lot Number</th>
            {/* <th className="border border-gray-300 px-4 py-2">
              Round 1 Total Time
            </th> */}
            <th className="border border-gray-300 px-4 py-2">
              Round 1 Total Score
            </th>
            {/* <th className="border border-gray-300 px-4 py-2">
              Round 2 Total Time
            </th> */}
            <th className="border border-gray-300 px-4 py-2">
              Round 2 Total Score
            </th>
            {/* <th className="border border-gray-300 px-4 py-2">
              Whole Total Time
            </th> */}
            <th className="border border-gray-300 px-4 py-2">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.lotNo}
              </td>
              {/* <td className="border border-gray-300 px-4 py-2">
                {formatTime(item.round1TotalTime)}
              </td> */}
              <td className="border border-gray-300 px-4 py-2">
                {calculateTotalScore(item.round1)}
              </td>
              {/* <td className="border border-gray-300 px-4 py-2">
                {formatTime(item.round2TotalTime)}
              </td> */}
              <td className="border border-gray-300 px-4 py-2">
                {calculateTotalScore(item.round2)}
              </td>
              {/* <td className="border border-gray-300 px-4 py-2">
                {formatTime(item.wholeTotalTime)}
              </td> */}
              <td className="border border-gray-300 px-4 py-2">
                {item.totalScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      {renderTable(UG, "UG Leaderboard")}
      {renderTable(PG, "PG Leaderboard")}
    </div>
  );
};

export default LeaderBoard;
