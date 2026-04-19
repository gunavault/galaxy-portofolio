'use client';
import { useEffect, useRef, useState } from 'react';

export default function SoundManager() {
  const [enabled, setEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const ambientRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Build ambient space sound using Web Audio API (no external files needed)
  const initAudio = () => {
    if (initialized) return;
    const ctx = new AudioContext();
    ambientRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Layer 1 — deep space drone
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, ctx.currentTime);
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.3, ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(masterGain);
    drone.start();

    // Layer 2 — mid tone shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(110, ctx.currentTime);
    shimmer.frequency.setValueAtTime(115, ctx.currentTime + 4);
    shimmer.frequency.setValueAtTime(110, ctx.currentTime + 8);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.1, ctx.currentTime);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmer.start();

    // Layer 3 — high freq space noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(200, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.5, ctx.currentTime);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    oscillatorsRef.current = [drone, shimmer];
    setInitialized(true);
  };

  const toggle = () => {
    if (!initialized) {
      initAudio();
      setTimeout(() => {
        if (gainRef.current && ambientRef.current) {
          gainRef.current.gain.linearRampToValueAtTime(0.4, ambientRef.current.currentTime + 2);
        }
      }, 100);
      setEnabled(true);
      return;
    }

    if (!enabled) {
      ambientRef.current?.resume();
      gainRef.current?.gain.linearRampToValueAtTime(0.4, (ambientRef.current?.currentTime || 0) + 1.5);
    } else {
      gainRef.current?.gain.linearRampToValueAtTime(0, (ambientRef.current?.currentTime || 0) + 1.5);
      setTimeout(() => ambientRef.current?.suspend(), 1600);
    }
    setEnabled(!enabled);
  };

  // Hover sound
  useEffect(() => {
    const playHover = () => {
      if (!enabled || !ambientRef.current) return;
      const ctx = ambientRef.current;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };

    const playClick = () => {
      if (!enabled || !ambientRef.current) return;
      const ctx = ambientRef.current;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    };

    const links = document.querySelectorAll('a, button, .nav-link, .skill-pill, .hobby-card, .movie-card');
    links.forEach(el => {
      el.addEventListener('mouseenter', playHover);
      el.addEventListener('click', playClick);
    });

    return () => {
      links.forEach(el => {
        el.removeEventListener('mouseenter', playHover);
        el.removeEventListener('click', playClick);
      });
    };
  }, [enabled]);

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
        enabled
          ? 'bg-purple-700/80 border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.6)]'
          : 'bg-black/60 border-purple-900/50 hover:border-purple-600'
      } backdrop-blur-md`}
    >
      {enabled ? (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-200">
          <path d="M11 5c1.333 1 2 2.5 2 4s-.667 3-2 4M8 3L4 7H1v4h3l4 4V3z"/>
          <path d="M14 3c2 2.5 2 7.5 0 10" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500">
          <path d="M8 3L4 7H1v4h3l4 4V3z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
      {enabled && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
      )}
    </button>
  );
}