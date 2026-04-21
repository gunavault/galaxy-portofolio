"use client";

import { useEffect, useRef } from "react";

interface Shape {
  x: number; y: number;
  size: number;
  type: number;
  color: string;
  rot: number;
  rotSpeed: number;
  vx: number; vy: number;
  alpha: number;
}

export default function GeoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const shapesRef = useRef<Shape[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const colors = ["#D9D2C6", "#B7A996", "#8C7864", "#4E4034"];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();

    function initShapes() {
      const W = canvas!.width, H = canvas!.height;
      shapesRef.current = Array.from({ length: 22 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 60 + 20,
        type: Math.floor(Math.random() * 3),
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.05,
      }));
    }
    initShapes();

    function draw() {
      const W = canvas!.width, H = canvas!.height;
      ctx.clearRect(0, 0, W, H);

      shapesRef.current.forEach((s) => {
        s.rot += s.rotSpeed;
        s.x += s.vx; s.y += s.vy;
        if (s.x < -100) s.x = W + 100;
        if (s.x > W + 100) s.x = -100;
        if (s.y < -100) s.y = H + 100;
        if (s.y > H + 100) s.y = -100;

        const dx = (mouseRef.current.x / W - 0.5) * 18 * (s.size / 80);
        const dy = (mouseRef.current.y / H - 0.5) * 18 * (s.size / 80);
        const sx = s.x + dx;
        const sy = s.y + dy + scrollRef.current * 0.08 * (s.size / 80);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(s.rot);
        ctx.globalAlpha = s.alpha * 0.35;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;

        if (s.type === 0) {
          ctx.beginPath();
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(s.size / 2, s.size / 2);
          ctx.lineTo(-s.size / 2, s.size / 2);
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        }
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onResize = () => { resize(); initShapes(); };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
