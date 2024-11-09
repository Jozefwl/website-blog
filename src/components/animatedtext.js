"use client";

import { useEffect, useState } from 'react';
import '../css/textanim.css';

const TextAnim = ({ text }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="text-container">
      {text.split(' ').map((word, index) => (
        <span key={index} className="word">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={`letter ${animate ? 'animate' : ''}`}
              style={{ animationDelay: `${charIndex * 0.1}s` }}
            >
              {char}
            </span>
          ))}
          <span className="space">{'\u00A0'}</span>
        </span>
      ))}
    </div>
  );
};

export default TextAnim;