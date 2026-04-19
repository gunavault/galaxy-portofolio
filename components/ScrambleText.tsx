'use client';
import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  trigger?: boolean;
  className?: string;
  delay?: number;
}

export default function ScrambleText({ text, trigger = true, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const animeRef = useRef<any>(null);
  const built = useRef(false);

  // Build character spans once on mount
  useEffect(() => {
    if (!ref.current || built.current) return;
    built.current = true;

    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(50px)';
      span.style.willChange = 'transform, opacity';
      return span;
    });

    ref.current.innerHTML = '';
    chars.forEach(span => ref.current!.appendChild(span));
    charsRef.current = chars;
  }, [text]);

  // Scroll-bound animation
  useEffect(() => {
    if (!ref.current || charsRef.current.length === 0) return;

    const el = ref.current;

    const handleScroll = () => {
      import('animejs').then((animeModule) => {
        const anime = animeModule.default;
        const rect = el.getBoundingClientRect();
        const windowH = window.innerHeight;

        // Progress: 0 when element enters bottom, 1 when fully visible
        const progress = Math.max(0, Math.min(1,
          (windowH - rect.top) / (windowH * 0.6)
        ));

        charsRef.current.forEach((char, i) => {
          const charProgress = Math.max(0, Math.min(1,
            (progress - (i / charsRef.current.length) * 0.5) / 0.5
          ));
          const easedProgress = 1 - Math.pow(1 - charProgress, 3); // easeOutCubic
          char.style.opacity = String(easedProgress);
          char.style.transform = `translateY(${(1 - easedProgress) * 50}px)`;
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <span ref={ref} className={className}>{text}</span>;
}