import React, { useRef, useEffect } from 'react';

const PASTEL_COLORS = [
  '#FFB5C5', // Pastel Pink
  '#FF8E8E', // Pastel Red / Coral
  '#D8B4F8', // Pastel Purple
  '#A0E7E5', // Pastel Blue
  '#B4F8C8', // Pastel Green
  '#FFF4A3', // Pastel Yellow
  '#FFCF96', // Pastel Orange
  '#C499F6', // Pastel Lavender
  '#A8E6CF', // Pastel Mint
  '#FFA6C9', // Pastel Rose
];

// Pixel sprite patterns (1 = filled pixel, 0 = empty)
const SPRITE_PATTERNS = {
  heart: [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
  star: [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
  ],
  gem: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
  sparkle: [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  bubble: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  sprinkle: [
    [1, 1, 1, 1],
  ],
};

const SPRITE_KEYS = Object.keys(SPRITE_PATTERNS);

export function PixelPastelBackground({
  animation = 'interactive',
  density = 'normal',
  pixelScale = 2,
  backgroundColor = '#FFFFFF',
  speed = 1,
  className = '',
  children,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 120 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getCanvasDimensions = () => {
      const isLg = window.innerWidth >= 1024;
      const w = window.innerWidth - (isLg ? 256 : 0);
      const h = window.innerHeight - 64;
      return { width: Math.max(300, w), height: Math.max(300, h) };
    };

    let { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      const dims = getCanvasDimensions();
      width = canvas.width = dims.width;
      height = canvas.height = dims.height;
    };

    window.addEventListener('resize', handleResize);

    // Particle Count based on density and full main content dimensions
    const densityMap = { low: 35, normal: 70, high: 110 };
    const baseCount = densityMap[density] || 70;
    const count = Math.max(30, Math.floor((width * height) / (1920 * 1080) * baseCount));

    const particles = Array.from({ length: count }, () => {
      const type = SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4 * speed,
        vy: -(Math.random() * 0.5 + 0.25) * speed,
        type,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        scale: Math.max(1, Math.round(pixelScale * (0.85 + Math.random() * 0.45))),
        alpha: 0.4 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
      };
    });

    const handleMouseMove = (e) => {
      if (animation !== 'interactive' || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic floating motion
        p.x += p.vx + Math.sin(time + p.floatOffset) * 0.25;
        p.y += p.vy;

        // Interactive mouse dispersion
        if (animation === 'interactive') {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRef.current.radius) {
            const force = (1 - dist / mouseRef.current.radius) * 2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Boundary wrap
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        // Draw 8-bit pixel sprite
        const sprite = SPRITE_PATTERNS[p.type];
        if (sprite) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          const pScale = p.scale;
          const spriteH = sprite.length;
          const spriteW = sprite[0].length;
          const startX = Math.round(p.x - (spriteW * pScale) / 2);
          const startY = Math.round(p.y - (spriteH * pScale) / 2);

          for (let r = 0; r < spriteH; r++) {
            for (let c = 0; c < spriteW; c++) {
              if (sprite[r][c] === 1) {
                ctx.fillRect(startX + c * pScale, startY + r * pScale, pScale, pScale);
              }
            }
          }
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animation, density, pixelScale, backgroundColor, speed]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Full-width & Full-height Canvas: Extends from beside sidebar to right viewport edge and below navbar */}
      <canvas
        ref={canvasRef}
        className="fixed top-16 left-0 lg:left-64 right-0 bottom-0 pointer-events-none z-0"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Existing Centered Trophy Room UI Content Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
