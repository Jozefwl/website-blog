"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import '../css/imagebox.css';

export default function Imagebox({ srcArray, altArray, captionArray }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % srcArray.length);
        setFade(true);
      }, 200); // Duration of the fade-out effect
    }, 4500); // Duration between image changes

    return () => clearInterval(interval);
  }, [srcArray.length]);

  useEffect(() => {
    // Preload the next image
    const nextIndex = (currentIndex + 1) % srcArray.length;
    const img = new Image();
    img.src = srcArray[nextIndex];
  }, [currentIndex, srcArray]);

  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <div className={`relative w-full h-64 sm:h-80 md:h-96 ${fade ? 'fade-in' : 'fade-out'}`}>
        <Image
          src={srcArray[currentIndex]}
          alt={altArray[currentIndex]}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
        />
      </div>
      {captionArray[currentIndex] && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white">
          {captionArray[currentIndex]}
        </p>
      )}
    </div>
  );
}