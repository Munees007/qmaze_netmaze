import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const OnScreenKeyboard: React.FC<{ onKeyPress: (key: string) => void }> = ({ onKeyPress }) => {
  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={{
        default: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "Z X C V B N M {bksp}"
        ]
      }}
      theme="hg-theme-default hg-layout-default"
    />
  );
};

export default OnScreenKeyboard;