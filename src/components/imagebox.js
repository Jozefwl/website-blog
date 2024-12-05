"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import '../css/imagebox.css';

export default function Imagebox({ srcArray, altArray, captionArray }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Function to get the next image index in a circular manner
  const getNextIndex = (index) => (index + 1) % srcArray.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out the current image
      setTimeout(() => {
        setCurrentIndex((prevIndex) => getNextIndex(prevIndex)); // Update index to the next image
        setFade(true); // Start fading in the next image
      }, 200); // Duration of the fade-out effect
    }, 4500); // Duration between image changes

    return () => clearInterval(interval);
  }, [srcArray.length]);

  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        {/* Current image */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={srcArray[currentIndex]}
            alt={altArray[currentIndex]}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        
        {/* Next image */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={srcArray[getNextIndex(currentIndex)]}
            alt={altArray[getNextIndex(currentIndex)]}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      </div>
      {captionArray[currentIndex] && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white">
          {captionArray[currentIndex]}
        </p>
      )}
    </div>
  );
}
