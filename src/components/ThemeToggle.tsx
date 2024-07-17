import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from './ToggleContext';
// Adjust path as per your project structure

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 absolute right-0 top-0 mt-2 mr-2 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center"
    >
      {isDarkMode ? <FaSun size={25} color="#FFA500" /> : <FaMoon size={25} color="#FFA500" />}
    </button>
  );
};

export default ThemeToggle;
