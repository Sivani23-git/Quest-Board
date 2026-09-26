import React, { useEffect, useRef } from 'react';
import {
  PixelCloud,
  PixelFloatingIsland,
  PixelStar,
  PixelCoin,
  PixelTree,
  PixelMountain,
  PixelGem,
} from './PixelArt';

export function PixelAuthBackground() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#60A5FA', '#34D399', '#FBBF24', '#C084FC', '#38BDF8'];
    const count = Math.min(30, Math.floor(window.innerWidth / 40));

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() > 0.6 ? 4 : 3,
      speedY: -(0.15 + Math.random() * 0.35),
      speedX: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.25 + Math.random() * 0.35,
      offset: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.offset) * 0.2;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base Pastel Horizon Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            'linear-gradient(180deg, #F0FDF4 0%, #F0F9FF 45%, #FAF5FF 100%)',
        }}
      />

      {/* 2. Distant Subtle Mountains & Floating Islands on Outer Flanks */}
      <div className="absolute top-[18%] -left-8 opacity-25 hidden sm:block">
        <PixelMountain className="w-56 sm:w-72 h-auto" />
      </div>
      <div className="absolute top-[22%] -right-10 opacity-25 hidden sm:block">
        <PixelMountain className="w-60 sm:w-80 h-auto" />
      </div>

      <div className="absolute top-[14%] left-[4%] opacity-45 hidden md:block">
        <PixelFloatingIsland className="w-24 sm:w-32 h-auto" />
      </div>
      <div className="absolute top-[62%] right-[5%] opacity-40 hidden md:block">
        <PixelFloatingIsland className="w-24 sm:w-28 h-auto" />
      </div>

      {/* 3. Soft Floating Pixel Clouds */}
      <div className="absolute top-[8%] left-[8%] opacity-50">
        <PixelCloud className="w-28 sm:w-36 h-auto" />
      </div>
      <div className="absolute top-[12%] right-[10%] opacity-50">
        <PixelCloud className="w-32 sm:w-40 h-auto" />
      </div>
      <div className="absolute top-[68%] left-[6%] opacity-35 hidden sm:block">
        <PixelCloud className="w-24 sm:w-32 h-auto" />
      </div>

      {/* 4. Pine Trees along lower sides */}
      <div className="absolute bottom-6 left-[6%] opacity-30 hidden sm:block">
        <PixelTree className="w-10 sm:w-14 h-auto" variant="pine" />
      </div>
      <div className="absolute bottom-10 right-[8%] opacity-30 hidden sm:block">
        <PixelTree className="w-12 sm:w-16 h-auto" variant="oak" />
      </div>

      {/* 5. Ambient Floating Pixel Items (Stars, Gems, Coins) */}
      <div className="absolute top-[16%] left-[24%] opacity-55 animate-float hidden sm:block" style={{ animationDelay: '0.5s' }}>
        <PixelCoin className="w-5 h-5" />
      </div>
      <div className="absolute top-[22%] right-[22%] opacity-50 animate-float hidden sm:block" style={{ animationDelay: '1.5s' }}>
        <PixelStar className="w-4 h-4" color="#F59E0B" />
      </div>
      <div className="absolute top-[72%] left-[18%] opacity-45 animate-float hidden sm:block" style={{ animationDelay: '2.2s' }}>
        <PixelGem className="w-5 h-5" />
      </div>
      <div className="absolute top-[78%] right-[20%] opacity-50 animate-float hidden sm:block" style={{ animationDelay: '1.0s' }}>
        <PixelStar className="w-4 h-4" color="#3B82F6" />
      </div>

      {/* 6. Canvas Particle Dust */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 7. Soft Central Radial Glow for Form Readability */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 75% at 50% 50%, rgba(255, 255, 255, 0.35) 0%, rgba(248, 250, 252, 0.70) 100%)',
        }}
      />
    </div>
  );
}
