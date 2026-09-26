import React from 'react';
import {
  PixelCloud,
  PixelStar,
  PixelTree,
  PixelGrass,
  PixelFlower,
  PixelBush,
} from './PixelArt';

/**
 * Tiny Pixel Art Book
 */
function PixelMiniBook({ className = 'w-6 h-6', color = '#3B82F6' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book Cover */}
      <rect x="2" y="2" width="12" height="12" fill={color} />
      <rect x="3" y="1" width="10" height="1" fill="#1E293B" />
      <rect x="2" y="14" width="12" height="1" fill="#1E293B" />
      <rect x="1" y="2" width="1" height="12" fill="#1E293B" />
      {/* Pages Edging */}
      <rect x="13" y="3" width="2" height="10" fill="#FEF3C7" />
      <rect x="14" y="4" width="1" height="8" fill="#FDE68A" />
      {/* Cover Emblem */}
      <rect x="5" y="5" width="6" height="6" fill="#FFFFFF" opacity="0.8" />
      <rect x="6" y="6" width="4" height="4" fill={color} />
      {/* Bookmark Ribbon */}
      <rect x="7" y="1" width="2" height="6" fill="#EF4444" />
    </svg>
  );
}

/**
 * Tiny Pixel Art Laptop
 */
function PixelMiniLaptop({ className = 'w-8 h-7' }) {
  return (
    <svg
      viewBox="0 0 20 16"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Screen Frame */}
      <rect x="3" y="1" width="14" height="10" fill="#334155" rx="1" />
      {/* Screen Display */}
      <rect x="4" y="2" width="12" height="8" fill="#0F172A" />
      {/* Code syntax glow on screen */}
      <rect x="5" y="3" width="4" height="1" fill="#38BDF8" />
      <rect x="10" y="3" width="3" height="1" fill="#F472B6" />
      <rect x="6" y="5" width="6" height="1" fill="#4ADE80" />
      <rect x="6" y="7" width="4" height="1" fill="#FBBF24" />
      <rect x="11" y="7" width="2" height="1" fill="#38BDF8" />
      {/* Base / Keyboard */}
      <rect x="1" y="11" width="18" height="3" fill="#64748B" />
      <rect x="0" y="13" width="20" height="2" fill="#475569" />
      {/* Trackpad */}
      <rect x="8" y="12" width="4" height="1" fill="#94A3B8" />
    </svg>
  );
}

/**
 * Tiny Pixel Code Badge Symbol (e.g. </>, { }, [ ])
 */
function PixelCodeBadge({ symbol = '</>', color = '#0284C7', className = '' }) {
  return (
    <div
      className={`inline-flex items-center justify-center font-mono font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs select-none ${className}`}
      style={{ color }}
    >
      {symbol}
    </div>
  );
}

/**
 * Dedicated Full-Page Pixel-Art Background for Coding Academy
 * 
 * Features:
 * - Soft pastel sky with airy mint / sky-blue tones
 * - Center kept open and clean to frame the 3D interactive library
 * - Subtle coding decorations: tiny books, laptops, code symbols, sparkles, clouds
 * - Fixed full-page background layer
 * - Motion-reduction safe
 */
export function PixelCodingAcademyBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #BAE6FD 0%, #D4F4E7 20%, #E2F8F0 40%, #EBF7FE 65%, #EFFBF6 85%, #DCFCE7 100%)',
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. TOP EDGE: Small Clouds, Stars, Subtle Code Symbols & Floating Books    */}
      {/* ========================================================================= */}
      {/* Top Left Cloud & Code Symbol */}
      <div className="absolute top-4 left-[3%] flex items-center gap-2 opacity-85 motion-safe:animate-pulse-slow">
        <PixelCloud className="w-28 h-14" />
        <PixelCodeBadge symbol="</>" color="#0284C7" className="hidden sm:inline-flex -ml-6 z-10" />
      </div>

      {/* Top Center-Left Particle */}
      <div className="absolute top-12 left-[28%] hidden md:flex items-center gap-2 opacity-75">
        <PixelMiniBook className="w-5 h-5 motion-safe:animate-bounce-slow" color="#3B82F6" />
        <PixelStar className="w-3.5 h-3.5 motion-safe:animate-pulse" color="#FACC15" />
      </div>

      {/* Top Center-Right Floating Elements */}
      <div className="absolute top-8 right-[28%] hidden lg:flex items-center gap-2 opacity-75">
        <PixelStar className="w-3.5 h-3.5 motion-safe:animate-pulse-slow" color="#38BDF8" />
        <PixelCodeBadge symbol="{ }" color="#8B5CF6" className="z-10" />
      </div>

      {/* Top Right Cloud & Book */}
      <div className="absolute top-4 right-[4%] flex items-center gap-2 opacity-85 motion-safe:animate-pulse-slow">
        <PixelMiniBook className="w-5 h-5 hidden sm:block -mr-4 z-10 motion-safe:animate-bounce-slow" color="#10B981" />
        <PixelCloud className="w-32 h-16" />
      </div>

      {/* Tiny Sparkles & XP Orbs */}
      <PixelStar className="absolute top-6 left-[18%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#FACC15" />
      <PixelStar className="absolute top-16 left-[22%] w-3 h-3 motion-safe:animate-pulse-slow" color="#38BDF8" />
      <PixelStar className="absolute top-6 right-[18%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#F472B6" />
      <PixelStar className="absolute top-18 right-[14%] w-3 h-3 motion-safe:animate-pulse-slow" color="#FACC15" />

      {/* Floating 01 Binary Particles */}
      <div className="absolute top-20 left-[10%] font-mono font-bold text-[10px] text-teal-600/60 hidden sm:block select-none motion-safe:animate-pulse">
        0101
      </div>
      <div className="absolute top-24 right-[10%] font-mono font-bold text-[10px] text-sky-600/60 hidden sm:block select-none motion-safe:animate-pulse-slow">
        1010
      </div>

      {/* ========================================================================= */}
      {/* 2. LEFT PERIMETER: Mini Laptop, Tree, Book, Code Syntax Accents           */}
      {/* ========================================================================= */}
      {/* Left Upper Laptop */}
      <div className="absolute top-[28%] left-3 lg:left-6 hidden sm:flex flex-col items-start gap-1 opacity-85">
        <PixelMiniLaptop className="w-7 h-6 motion-safe:animate-bounce-slow" />
        <PixelCodeBadge symbol="fn()" color="#0284C7" className="mt-1" />
      </div>

      {/* Left Mid Tree & Flora */}
      <div className="absolute top-[55%] left-2 lg:left-5 hidden md:flex flex-col items-start gap-1 opacity-75">
        <PixelTree variant="oak" className="w-10 h-16" />
        <div className="flex items-end gap-1 mt-[-6px]">
          <PixelGrass className="w-7 h-4" />
          <PixelFlower className="w-3.5 h-3.5" color="#38BDF8" />
        </div>
      </div>

      {/* Left Lower Book & Sprout */}
      <div className="absolute bottom-[20%] left-3 lg:left-6 hidden lg:flex items-end gap-2 opacity-80">
        <PixelMiniBook className="w-5 h-5" color="#E76F51" />
        <PixelGrass className="w-6 h-4" />
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT PERIMETER: Mini Bookshelf Decor, Code Brackets, Tree             */}
      {/* ========================================================================= */}
      {/* Right Upper Bracket Badge */}
      <div className="absolute top-[26%] right-3 lg:right-6 hidden sm:flex flex-col items-end gap-1 opacity-85">
        <PixelCodeBadge symbol="[ ]" color="#D97706" />
        <PixelMiniBook className="w-5 h-5 mt-1 motion-safe:animate-bounce-slow" color="#F59E0B" />
      </div>

      {/* Right Mid Laptop & Tree */}
      <div className="absolute top-[52%] right-2 lg:right-5 hidden md:flex flex-col items-end gap-1 opacity-75">
        <PixelTree variant="pine" className="w-10 h-16" />
        <div className="flex items-end gap-1 mt-[-6px]">
          <PixelFlower className="w-3.5 h-3.5" color="#F472B6" />
          <PixelGrass className="w-7 h-4" />
        </div>
      </div>

      {/* Right Lower Coding Tag */}
      <div className="absolute bottom-[18%] right-3 lg:right-6 hidden lg:flex flex-col items-end gap-1 opacity-80">
        <PixelCodeBadge symbol="const" color="#10B981" />
        <PixelGrass className="w-6 h-4" />
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM PERIMETER: Ground Contour, Grass, Flowers, Small Books          */}
      {/* ========================================================================= */}
      {/* Ground Border */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-emerald-500/35 via-teal-400/25 to-transparent border-t-2 border-emerald-400/35" />

      {/* Bottom Left Corner */}
      <div className="absolute bottom-2 left-4 sm:left-8 flex items-end gap-2 opacity-80">
        <PixelBush className="w-8 h-5 hidden sm:block" />
        <PixelGrass className="w-7 h-4" />
        <PixelMiniBook className="w-4 h-4 hidden md:block" color="#2563EB" />
        <PixelFlower className="w-3.5 h-3.5" color="#FBBF24" />
      </div>

      {/* Bottom Center Scattered Grass & Star */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6 opacity-75">
        <PixelGrass className="w-6 h-4" />
        <PixelFlower className="w-3 h-3" color="#38BDF8" />
        <PixelStar className="w-3 h-3 motion-safe:animate-pulse" color="#FACC15" />
        <PixelFlower className="w-3 h-3" color="#A78BFA" />
        <PixelGrass className="w-6 h-4" />
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-2 right-4 sm:right-8 flex items-end gap-2 opacity-80">
        <PixelFlower className="w-3.5 h-3.5" color="#F472B6" />
        <PixelGrass className="w-7 h-4" />
        <PixelBush className="w-8 h-5 hidden sm:block" />
      </div>
    </div>
  );
}
