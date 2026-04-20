'use client';
import { useEffect, useRef } from 'react';

type Planet = {
  radius: number;
  color: string;
  orbitRadius: number;
  speed: number;
  angle: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

type FGPlanet = {
  x: number;
  y: number;
  radius: number;
  color: string;
  depth: number;
};

export default function GalaxyCanvas() {
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

    // ── PLANETS ──
    const planets: Planet[] = [
      { radius: 4, color: '#facc15', orbitRadius: 60, speed: 0.02, angle: 0 },
      { radius: 6, color: '#fb923c', orbitRadius: 100, speed: 0.015, angle: 1 },
      { radius: 7, color: '#38bdf8', orbitRadius: 150, speed: 0.01, angle: 2 },
      { radius: 5, color: '#ef4444', orbitRadius: 200, speed: 0.008, angle: 3 },
      { radius: 10, color: '#a78bfa', orbitRadius: 260, speed: 0.006, angle: 4 },
    ];

    const fgPlanets: FGPlanet[] = [
      { x: W * 0.2, y: H * 0.8, radius: 20, color: '#a78bfa', depth: 0.6 },
      { x: W * 0.85, y: H * 0.7, radius: 16, color: '#38bdf8', depth: 0.8 },
      { x: W * 0.7, y: H * 0.3, radius: 12, color: '#f472b6', depth: 0.5 },
    ];

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
    }));

    const particles: Particle[] = [];

    // ── INTERACTION ──
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isBoosting = false;

    // astronaut physics
    let astroX = W / 2;
    let astroY = H * 0.7;
    let vx = 0;
    let vy = 0;

    const handleScroll = () => { scrollY = window.scrollY; };

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleDown = () => { isBoosting = true; };
    const handleUp = () => { isBoosting = false; };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', handleResize);

    // ── DRAW HELPERS ──
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

      // flame (stronger if boosting)
      const base = isBoosting ? 4 : 2;
      const flameSize = base + Math.sin(frame * 0.3) * 1.5;

      ctx.fillStyle = '#f97316';
      ctx.fillRect(x + 1, y + 10, 2, flameSize);

      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 1.5, y + 10, 1, flameSize - 1);

      // particles (more if boosting)
      const spawnRate = isBoosting ? 0.9 : 0.5;

      if (Math.random() < spawnRate) {
        particles.push({
          x: x + 2,
          y: y + 12,
          vx: (Math.random() - 0.5) * 1,
          vy: 1 + Math.random() * (isBoosting ? 3 : 1.5),
          life: 0,
          maxLife: 30 + Math.random() * 20,
        });
      }
    };

    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      ctx.clearRect(0, 0, W, H);

      const centerX = W / 2;
      const centerY = H / 2 - scrollY * 0.2;

      // ── STARS ──
      stars.forEach((s) => {
        ctx.fillStyle = 'white';
        ctx.fillRect((s.x + frame * 0.1) % W, (s.y + frame * 0.05) % H, 1, 1);
      });

      // ── SUN ──
      drawPixelCircle(centerX, centerY, 8, '#facc15');

      // ── PLANETS ──
      planets.forEach((p) => {
        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.orbitRadius;
        const py = centerY + Math.sin(p.angle) * p.orbitRadius;

        ctx.strokeStyle = 'rgba(167,139,250,0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, p.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        drawPixelCircle(px, py, p.radius, p.color);
      });

      // ── FOREGROUND PLANETS ──
      fgPlanets.forEach((p) => {
        const x = p.x;
        const y = p.y - scrollY * p.depth;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.radius * 3);
        glow.addColorStop(0, `${p.color}55`);
        glow.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        drawPixelCircle(x, y, p.radius, p.color);
      });

      // ── ASTRONAUT PHYSICS ──
      const targetX = mouseX || centerX;
      const targetY = (mouseY || H * 0.7) - scrollY * 0.3;

      // smooth follow (inertia)
      vx += (targetX - astroX) * 0.01;
      vy += (targetY - astroY) * 0.01;

      // damping
      vx *= 0.9;
      vy *= 0.9;

      // boost upward force
      if (isBoosting) {
        vy -= 0.3;
      }
      

      astroX += vx;
      astroY += vy;

      drawAstronaut(astroX, astroY, frame);

      // ── PARTICLES ──
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

        ctx.fillStyle = `rgba(167,139,250,${alpha * 0.5})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
}