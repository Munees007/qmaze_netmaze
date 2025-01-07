import React from "react";

interface Props {
  onGoogleSignIn: () => void;
}

const Form: React.FC<Props> = ({ onGoogleSignIn }) => {
  return (
    <div className={`fixed bg-blue-900 top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-50 
        `}>
      <div className="flex flex-col items-center w-96 h-fit gap-2  bg-white p-5 rounded-lg shadow-lg">
        <img
          src="./netmaze.png" // Replace with your image URL
          alt="NetMaze Logo"
          className="w-52 h-52"
        />
        <button
          onClick={onGoogleSignIn}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Form;
