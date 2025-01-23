// import { FcSearch } from "react-icons/fc";
const Question = () => {
  const ques = {
    across: {
      1: { clue: "An input device", answer: "MOUSE" },
      5: {
        clue: "______ peripheral device allows a user to input data and interact with a computer through a set of keys?",
        answer: "KEYBOARD",
      },
      6: { clue: "International Business Machines", answer: "IBM" },
      9: {
        clue: "The smallest piece of computer information, either the number 0 or 1.",
        answer: "BIT",
      },
      11: {
        clue: "A __________ is a general-purpose computer designed for use by an individual",
        answer: "PERSONALCOMPUTER",
      },
      12: { clue: "An output device", answer: "PRINTER" },
      14: { clue: "The brain of the computer.", answer: "CPU" },
      17: {
        clue: "To output text and graphics from a computer onto paper, you would use a __________.",
        answer: "PRINTER",
      },
      18: {
        clue: "The __________ key is used to enable or disable the automatic capitalization of letters on a keyboard.",
        answer: "CAPSLOCK",
      },
      19: {
        clue: "The __________ is a peripheral device that amplifies sound and allows you to hear audio from your computer.",
        answer: "SPEAKERS",
      },
    },
    down: {
      2: {
        clue: "What key is typically used to activate shortcut commands such as selecting text, copying, or pasting in combination with other keys?",
        answer: "SHIFT",
      },
      3: {
        clue: "What is the general term for a piece of electronic equipment designed to perform a specific function, such as a smartphone, tablet, or printer?",
        answer: "DEVICE",
      },
      4: {
        clue: "_________ type of non-volatile memory is used to store firmware and essential system software that is not intended to be modified frequently?",
        answer: "ROM",
      },
      7: {
        clue: "Which hardware component is used to view the visual output from a computer, including text, images, and videos?",
        answer: "MONITOR",
      },
      8: {
        clue: "_______ are found on the right side of the keyboard and act much like a calculator pad",
        answer: "NUMERICKEYS",
      },
      9: {
        clue: "In computing, what term refers to the procedure of starting a computer from an off state and loading the operating system?",
        answer: "BOOT",
      },
      10: {
        clue: "_______ are Small, lightweight, portable battery-powered computers that can fit onto your lap.",
        answer: "LAPTOP",
      },
      13: {
        clue: "__________ is the type of computer memory that temporarily stores data for quick access by the CPU.",
        answer: "RAM",
      },
      15: {
        clue: "The __________ statement in SQL is used to modify data in existing rows based on a condition.",
        answer: "UPDATE",
      },
      16: {
        clue: "A collection of interconnected computers and devices that can communicate with each other is called a __________.",
        answer: "NETWORK",
      },
    },
  };
  return (
    <div className="bg-[#2C2C3A]  border-2  border-[#2C2C2C] p-3 font-playfair w-full text-white">
        <p className="text-2xl font-extrabold">ACROSS</p>
      {Object.entries(ques.across).map(([key, { clue }]) => (
        <div key={key} className="flex my-2 items-center text-justify justify-between">
        <p  className=" text-lg font-semibold">
          {key}. {clue}
        </p>
        {/* <div>
        <FcSearch size={40} className="ml-10"/>
        </div> */}
        </div>
      ))}
      <p className="text-2xl font-extrabold">DOWN</p>
      {
        Object.entries(ques.down).map(([key,{clue}])=>(
            <div key={key} className="flex items-center my-2">
            <p className=" text-justify text-lg font-semibold justify-between">
                {key}. {clue}
            </p>
            {/* <div className="ml-10">
            <FcSearch size={40}/>
            </div> */}
            </div>
        ))
      }
    </div>
  );
};

export default Question;
