import React, { useEffect, useState } from "react";
import WordSearch from "./components/wordSeacrch";
import HomePage from "./components/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ToggleContext";
import Thank from "./components/Thank";
import { toast, ToastContainer } from "react-toastify";
import CrossWord from "./components/CrossWord";
import Game from "./components/Game";
import LeaderBoard from "./components/LeaderBoard";


const App: React.FC = () => {
  const warningToastMessages: string[] = [
    "Oops! That key doesn’t unlock any secrets. Try playing the game instead!",
    "Inspecting the game? Ah, the mysteries lie in playing, not peeking!",
    "Nice try! But this isn’t Hogwarts, and no magic keys work here.",
    "Caught you red-handed! Stick to the rules and enjoy the game.",
  ];

  const [isFullScreen, setIsFullScreen] = useState(false);

  const warnPlayer = () => {
    const randomMessage =
      warningToastMessages[Math.floor(Math.random() * warningToastMessages.length)];
    toast.warn(randomMessage);
  };

  const enableFullScreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const monitorFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(false);
    }
  };

  const handleFullScreenToggle = () => {
    enableFullScreen();
    setIsFullScreen(true);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", monitorFullScreen);

    const disableInspect = (e: MouseEvent | KeyboardEvent) => {
      // Disable right-click
      if (e.type === "contextmenu") {
        warnPlayer();
        e.preventDefault();
      }

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J
      if (e.type === "keydown") {
        const keyboardEvent = e as KeyboardEvent;
        if (
          keyboardEvent.key === "F12" || // F12 key
          (keyboardEvent.ctrlKey &&
            keyboardEvent.shiftKey &&
            (keyboardEvent.key === "I" || keyboardEvent.key === "J")) // Ctrl+Shift+I or J
        ) {
          warnPlayer();
          keyboardEvent.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", disableInspect);
    document.addEventListener("keydown", disableInspect);

    return () => {
      document.removeEventListener("fullscreenchange", monitorFullScreen);
      document.removeEventListener("contextmenu", disableInspect);
      document.removeEventListener("keydown", disableInspect);
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {!isFullScreen &&  (
          <div className="bg-gray-900 w-full h-screen flex justify-center items-center">
            <button
              onClick={handleFullScreenToggle}
              className="bg-green-500 font-playwrite font-extrabold rounded-md border-2 border-black hover:bg-green-300 cursor-pointer px-4 py-2"
            >
              Enter Full Screen to Start the Game
            </button>
          </div>
        )}
        {isFullScreen && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wordGame" element={<WordSearch />} />
            <Route path="/crossWord" element={<CrossWord />} />
            <Route path="/riddleRunner" element={<Game/>}/>
            <Route path="/mw" element={<LeaderBoard />} />
            <Route path="/end" element={<Thank />} />
          </Routes>
        )}
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
