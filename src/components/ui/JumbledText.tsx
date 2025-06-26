'use client'

import { useState, useEffect, useRef } from 'react'

interface JumbledBannerTextProps {
  text: string
}

export function JumbledBannerText({ text }: JumbledBannerTextProps) {
  const [jumbledText, setJumbledText] = useState(text);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const jumbled = text
        .split('')
        .map((char) => {
          if (char === ' ') return ' ';
          if (Math.random() > 0.7) {
            return characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return char;
        })
        .join('');

      setJumbledText(jumbled);
    }, 150);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, characters]);

  return jumbledText;
}

export function JumbledText() {
  const [text, setText] = useState('Generating');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dotsRef = useRef('');

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Add dots animation
      dotsRef.current = dotsRef.current.length < 3 ? dotsRef.current + '.' : '';
      
      // Create jumbled text
      const jumbled = 'Generating'
        .split('')
        .map((char) => {
          if (Math.random() > 0.8) {
            return characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return char;
        })
        .join('') + dotsRef.current;

      setText(jumbled);
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [characters]);

  return (
    <span className="ml-2 text-sm font-normal text-blue-400">
      {text}
    </span>
  );
}