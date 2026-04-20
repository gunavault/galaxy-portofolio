'use client';
import GlitchText from '@/components/GlitchText';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    ctx.imageSmoothingEnabled = false;

    // ── STARS ──
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
    }));

    // ── PARTICLES ──
    const particles: any[] = [];

    // ── DRAW PIXEL CIRCLE ──
    const drawPixelCircle = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
          if (i * i + j * j <= r * r) {
            ctx.fillRect(Math.floor(x + i), Math.floor(y + j), 2, 2);
          }
        }
      }
    };

    // ── ASTRONAUT ──
    const drawAstronaut = (x: number, y: number, frame: number) => {
      ctx.fillStyle = '#fff';

      ctx.fillRect(x, y, 4, 4);
      ctx.fillRect(x + 1, y + 4, 2, 4);

      ctx.fillRect(x - 2, y + 4, 2, 2);
      ctx.fillRect(x + 4, y + 4, 2, 2);

      ctx.fillRect(x, y + 8, 2, 2);
      ctx.fillRect(x + 2, y + 8, 2, 2);

      // jetpack
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(x + 1, y + 4, 2, 3);

      // flame
      const flame = 2 + Math.sin(frame * 0.3) * 1.5;
      ctx.fillStyle = '#f97316';
      ctx.fillRect(x + 1, y + 10, 2, flame);

      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 1.5, y + 10, 1, flame - 1);

      // particles
      if (Math.random() < 0.5) {
        particles.push({
          x: x + 2,
          y: y + 12,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 1 + Math.random() * 1.5,
          life: 0,
          maxLife: 40,
        });
      }
    };

    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      ctx.clearRect(0, 0, W, H);

      // stars
      stars.forEach((s) => {
        ctx.fillStyle = 'white';
        ctx.fillRect((s.x + frame * 0.1) % W, (s.y + frame * 0.05) % H, 1, 1);
      });

      // lonely planet
      drawPixelCircle(W * 0.2, H * 0.7, 12, '#a78bfa');

      // astronaut floating
      const x = W / 2 + Math.sin(frame * 0.02) * 80;
      const y = H / 2 + Math.cos(frame * 0.015) * 40;

      drawAstronaut(x, y, frame);

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(251,146,60,${alpha})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
    };

    animate();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.dispatchEvent(new CustomEvent('jetpack', { detail: true }))
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center text-center">
      
      {/* Canvas background */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />

      {/* Content */}
      <div className="z-10 px-6">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
          <GlitchText text="404" />
        </h1>

        <p className="text-purple-400 font-mono mb-6">
          Lost in space... this page doesn’t exist 🚀
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-all"
        >
          Return to Orbit
        </Link>
      </div>
    </div>
  );
}