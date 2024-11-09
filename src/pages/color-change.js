"use client";

import '../css/color-change.css';
import { useEffect } from 'react';

const ColorChange = () => {

  // Function to change the background color based on key press
  const handleKeyPress = (event) => {
    // 16777215 = amount of colors 255x255x255
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    document.body.style.backgroundColor = randomColor;
  };

  // Adding event listener when the component mounts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="color-change-container">
      <h1>Press a key to change color!</h1>
    </div>
  );
};

export default ColorChange;
