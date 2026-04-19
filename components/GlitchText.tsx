'use client';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  intensity?: 'low' | 'high';
}

export default function GlitchText({ text, className = '', intensity = 'high' }: Props) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), intensity === 'high' ? 400 : 200);
    };
    triggerGlitch();
    const interval = setInterval(triggerGlitch, intensity === 'high' ? 3000 : 6000);
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span className={`glitch-wrapper ${className}`} data-text={text}>
      <span className={glitching ? 'glitch-active' : ''}>{text}</span>
    </span>
  );
}
