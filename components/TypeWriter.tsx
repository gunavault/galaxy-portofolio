'use client';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export default function TypeWriter({ text, speed = 60, delay = 0, className = '', cursor = true }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {cursor && <span className={`inline-block w-0.5 h-[1em] bg-purple-400 ml-0.5 align-middle ${done ? 'animate-pulse' : ''}`} />}
    </span>
  );
}
