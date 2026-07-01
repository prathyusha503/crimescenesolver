'use client';

import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // ms between each letter
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval); // cleanup
  }, [text, speed]);

  return (
    <p className="text-4xl font-serif whitespace-pre-wrap">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default TypingText;
