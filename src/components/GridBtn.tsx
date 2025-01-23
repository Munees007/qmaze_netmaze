import React, { useEffect, useState } from 'react';

interface GridBtnProps {
  isInteractive: boolean;
  onChange?: (value: string) => void;
  handleClick:() => void;
  value?: string;
  questionNumbers?: number[];
  isCorrect?: boolean;
  disabled?: boolean;
}

const GridBtn: React.FC<GridBtnProps> = ({
  isInteractive,
  onChange,
  handleClick,
  value,
  questionNumbers,
  isCorrect,
  disabled = false,
}) => {
  const [isMobile,setIsMobile] = useState<boolean>(false);
  // Determine the background color based on the new rules
  let backgroundColor;
  if (!isInteractive) {
    backgroundColor = 'bg-[#D2DBEC]'; // white
  } else if (value === '') {
    backgroundColor = 'bg-[#2b2d42]'; // yellow
  }  else if (isCorrect === undefined) {
    backgroundColor = 'bg-[#2b2d42]'; // green
  }else if (isCorrect)
    {
      backgroundColor = 'bg-[#4CAF50]';
    }
  else {
    backgroundColor = 'bg-[#F44336]'; // red
  }

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile threshold
    };
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return (
    <div
      className={`border ${backgroundColor} border-black border-2`}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isInteractive && !disabled ? 'text' : 'default',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
      }}
      aria-disabled={disabled}
    >
       {/* {questionNumbers != undefined && questionNumbers.length > 0 && (
        <div
          className="absolute text-xs text-gray-700"
          style={{ top: 2, left: 2 }}
        >
          {questionNumbers.map((num, idx) => (
            <div key={idx}>{num}</div>
          ))}
        </div>
      )} */}
      {isInteractive ? (
        <input
          type="text"
          maxLength={1}
          value={value}
          onClick={handleClick}
          readOnly={isMobile}
          onChange={(e) => onChange?.(e.target.value.toUpperCase())}
          className={`w-full h-full font-bold text-[#faf3f6] bg-transparent border-none text-center ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ boxSizing: 'border-box' }}
          disabled={disabled}
          aria-label={`Cell ${questionNumbers}`}
        />
      ) : (
        <div className="w-full h-full bg-transparent" />
      )}
      {questionNumbers !== undefined && (
        <div
          className={`absolute flex items-center top-0 left-0 justify-center z-10`}>
          <p className="text-xs text-gray-500">{questionNumbers[0]}</p>
        </div>
      )}
    </div>
  );
};

export default GridBtn;
