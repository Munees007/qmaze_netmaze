import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import Form from "./Form";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { isNetmazeParticipant, LogoutParticicpant } from "../backend/netmazeLogin";
import { fetchParticipantData, getCurrentRound } from "../backend/fetchData";
import { auth } from "../firebase";
import { BiLogOutCircle } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Modal, List, Button } from "antd";  // Import Ant Design Modal, List, Button

type RoundDataType = {
  Rule: string[];
  name: string;
  imgPath: string;
  navigateTo: string;
  starts: string;
};

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [participantData, setParticipantData] = useState<any>(null);
  const [currentRound, setCurrentRound] = useState<number>();
  const [roundData] = useState<RoundDataType[]>([
    {
      Rule: [
        "Welcome to the Word Search Challenge! In this game, you will need to locate hidden technical terms within a grid of letters.",
        "The terms can appear in any direction: horizontally, vertically, or diagonally.",
        "To select a word, simply click and drag your mouse over the letters of the word, making sure to follow the correct sequence of letters.",
        "Each word may only be used once. After you have found a word, mark it off the list provided.",
        "The game starts as soon as you begin, and you will be racing against the clock, so aim to find as many words as possible before time expires.",
        "You will have access to a limited number of hints. Use them wisely to reveal parts of words you're stuck on.",
        "Remember, the clock is ticking, and every second counts. Stay focused, and good luck!"
      ],
      name: "Word Search",
      imgPath: "./netmaze.png",
      navigateTo: "/wordGame",
      starts: "29.01.2025"
    },
    {
      Rule: [
        "Welcome to the Crossword Puzzle! In this round, your task is to fill the grid with the correct answers based on the clues provided.",
        "The crossword puzzle has two categories of clues: 'Across' and 'Down'. You will need to solve the clues in these two sections to fill in the grid.",
        "Each clue corresponds to a word that you must enter into the grid, making sure the letters match correctly with the numbered boxes.",
        "Ensure that the answers fit in the grid, both in terms of the correct letters and the correct placement.",
        "If you make an error, simply correct the letters or clear them to try again.",
        "The goal is to complete the puzzle by filling in all the correct answers. Take your time, but aim to finish within the time limit.",
        "The timer will track your progress, so be mindful of the time as you solve the clues. Accuracy is key!",
        "Good luck, and may the best minds prevail in solving the puzzle!"
      ],
      name: "Cross Word Puzzle",
      imgPath: "./netmaze.png",
      navigateTo: "/crossWord",
      starts: "01.02.2025"
    }
  ]);

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await isNetmazeParticipant(result?.user?.email!);
    } catch (error) {
      toast.error("Failed to sign in with Google");
    }
  };

  // Check authentication and protect the route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const participantData = await fetchParticipantData(user.email!);
          const num = await getCurrentRound();
          setIsLogined(participantData?.isLogin ?? false);
          setParticipantData(participantData);
          setCurrentRound(Number(num));
        } catch (error) {
          toast.error("Error fetching participant data");
        }
      } else {
        setIsLogined(false);
        navigate("/"); // Redirect to homepage if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await LogoutParticicpant(auth.currentUser?.email!);
    navigate("/"); // Redirect to homepage after logout
  };

  const handleNavigateToPlay = (index: number) => {
    if(currentRound == -1)
    {
      toast.info("Today's questions have ended. Please come back tomorrow for the next set of questions!");
    }
    if (currentRound == index + 1) {
      toast.info("Event begins");
      navigate(roundData[index].navigateTo,{state:{participantData}});
    } else {
      toast.info("Event not yet started, please wait...");
    }
  };

  // Modal state for displaying rules
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);

  const showRulesModal = (rules: string[]) => {
    setModalContent(rules);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return !isLogined ? (
    <Form onGoogleSignIn={handleGoogleSignIn} />
  ) : (
    <div className="h-screen w-full flex flex-col relative">
      {/* header */}
      <div className="w-full font-shadow bg-[#1c2541] font-bold h-fit text-white p-3 flex justify-between">
        <p className="text-3xl">NETMAZE</p>
        <BiLogOutCircle
          size={40}
          onClick={handleLogout}
          className="hover:scale-105 active:scale-95 cursor-pointer"
        />
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
      <div className="flex flex-col p-5 w-full justify-center items-center">
        <p className="text-xl font-bold">Rounds</p>
        <div className="grid grid-cols-2 m-4 gap-10 max-sm:grid-cols-1">
          {roundData.map((round, index) => (
            <div
              key={index}
              className={` bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 gap-1 text-white w-fit p-3 rounded-md shadow-lg shadow-black flex flex-col justify-center items-center`}
            >
              <p className="text-2xl font-bold font-playfair">{round.name}</p>
              <img src={round.imgPath} className="w-60 h-60" alt={`Round ${index + 1}`} />
              <span
                className="flex text-2xl font-bold font-playfair items-center gap-2 cursor-pointer"
                onClick={() => showRulesModal(round.Rule)} // Show modal with rules
              >
                <BsEye size={30} /> Rules
              </span>
              <button
                onClick={() => handleNavigateToPlay(index)}
                className="mt-2 bg-green-500 hover:bg-green-800 hover:scale-105 active:scale-95 w-full text-xl font-bold border-2 border-black p-2 rounded-md shadow-md shadow-black"
              >
                START
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for rules */}
      <Modal
        title="Rules"
        className="w-fit"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel} className="bg-red-500 text-white">
            Close
          </Button>
        ]}
      >
        <List
          size="large"
          bordered
          dataSource={modalContent}
          renderItem={(item) => (
            <List.Item>
              <p className="text-lg">{item}</p>
            </List.Item>
          )}
        />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
