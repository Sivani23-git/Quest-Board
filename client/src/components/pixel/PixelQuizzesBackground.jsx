import React from 'react';
import {
  PixelCloud,
  PixelStar,
  PixelGrass,
  PixelFlower,
} from './PixelArt';

/**
 * Pixel Art Question Block (❓)
 */
function PixelQuestionMarkBlock({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Border */}
      <rect x="0" y="0" width="16" height="16" fill="#D97706" />
      <rect x="1" y="1" width="14" height="14" fill="#F59E0B" />
      <rect x="2" y="2" width="12" height="12" fill="#FBBF24" />

      {/* Rivets */}
      <rect x="2" y="2" width="1" height="1" fill="#78350F" />
      <rect x="13" y="2" width="1" height="1" fill="#78350F" />
      <rect x="2" y="13" width="1" height="1" fill="#78350F" />
      <rect x="13" y="13" width="1" height="1" fill="#78350F" />

      {/* Question Symbol '?' */}
      <rect x="6" y="4" width="4" height="2" fill="#78350F" />
      <rect x="9" y="5" width="2" height="3" fill="#78350F" />
      <rect x="7" y="7" width="2" height="2" fill="#78350F" />
      <rect x="7" y="10" width="2" height="2" fill="#78350F" />

      {/* Highlight Shine */}
      <rect x="2" y="2" width="11" height="1" fill="#FEF08A" />
      <rect x="2" y="3" width="1" height="10" fill="#FEF08A" />
    </svg>
  );
}

/**
 * Pixel Art Knowledge Lightbulb (💡)
 */
function PixelKnowledgeLightbulb({ className = 'w-8 h-10' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-yellow-400/25 rounded-full blur-xs motion-safe:animate-pulse" />

      <svg
        viewBox="0 0 16 20"
        className="w-full h-full drop-shadow-xs relative z-10"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glass Dome */}
        <rect x="4" y="2" width="8" height="2" fill="#FDE047" />
        <rect x="2" y="4" width="12" height="6" fill="#FACC15" />
        <rect x="3" y="3" width="10" height="8" fill="#FEF08A" />

        {/* Highlight */}
        <rect x="4" y="4" width="2" height="4" fill="#FFFFFF" />
        <rect x="6" y="4" width="2" height="2" fill="#FFFFFF" />

        {/* Glowing Filament */}
        <rect x="7" y="6" width="2" height="4" fill="#EA580C" />
        <rect x="6" y="7" width="4" height="2" fill="#F97316" />

        {/* Taper to base */}
        <rect x="4" y="10" width="8" height="2" fill="#EAB308" />
        <rect x="5" y="12" width="6" height="2" fill="#CA8A04" />

        {/* Screw Base */}
        <rect x="5" y="14" width="6" height="2" fill="#94A3B8" />
        <rect x="6" y="16" width="4" height="2" fill="#64748B" />
        <rect x="7" y="18" width="2" height="1" fill="#334155" />
      </svg>
    </div>
  );
}

/**
 * Pixel Art Stack of Books (📚)
 */
function PixelBookStack({ className = 'w-10 h-9' }) {
  return (
    <svg
      viewBox="0 0 20 18"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom Book (Blue) */}
      <rect x="1" y="12" width="18" height="5" fill="#2563EB" rx="1" />
      <rect x="3" y="13" width="14" height="3" fill="#FEF3C7" />
      <rect x="1" y="12" width="3" height="5" fill="#1D4ED8" />
      <rect x="2" y="13" width="1" height="3" fill="#FACC15" />

      {/* Middle Book (Amber / Orange) */}
      <rect x="3" y="7" width="15" height="5" fill="#D97706" rx="1" />
      <rect x="5" y="8" width="11" height="3" fill="#FEF3C7" />
      <rect x="3" y="7" width="3" height="5" fill="#B45309" />
      <rect x="12" y="9" width="4" height="1" fill="#DC2626" />

      {/* Top Book (Emerald / Green) */}
      <rect x="2" y="2" width="14" height="5" fill="#16A34A" rx="1" />
      <rect x="4" y="3" width="10" height="3" fill="#FEF3C7" />
      <rect x="2" y="2" width="3" height="5" fill="#15803D" />
      {/* Top Bookmark */}
      <rect x="7" y="1" width="2" height="4" fill="#EF4444" />
    </svg>
  );
}

/**
 * Dedicated Minimal & Cute Pixel-Art Background for Knowledge Quizzes
 * 
 * Features:
 * - Soft pastel sky blue gradient (#BAE6FD -> #DCFCE7)
 * - Minimal, high-quality knowledge decorations (2-3 clouds, 1 question block, 1 lightbulb, 1 bookstack, sparkles, grass)
 * - Center kept clean and spacious for maximum focus on quiz trials & statistics
 * - Full-page fixed background layer
 * - Motion-reduction safe
 */
export function PixelQuizzesBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #BAE6FD 0%, #D8F0FE 22%, #EAF5FE 45%, #F4FAF8 70%, #F0FDF4 85%, #DCFCE7 100%)',
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. TOP PERIMETER: 2 Soft Pixel Clouds & Tiny Sparkles                     */}
      {/* ========================================================================= */}
      {/* Cloud Top-Left */}
      <PixelCloud className="absolute top-4 left-[4%] w-28 h-14 opacity-80 motion-safe:animate-pulse-slow" />
      {/* Cloud Top-Right */}
      <PixelCloud className="absolute top-5 right-[5%] w-30 h-15 opacity-80 motion-safe:animate-pulse-slow" />

      {/* Sparkles (✨) near top edge */}
      <PixelStar className="absolute top-6 left-[22%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#FACC15" />
      <PixelStar className="absolute top-14 right-[24%] w-3.5 h-3.5 motion-safe:animate-pulse-slow" color="#38BDF8" />

      {/* ========================================================================= */}
      {/* 2. LEFT PERIMETER: Question Mark Block (❓) & Stack of Books (📚)         */}
      {/* ========================================================================= */}
      {/* Question Block Left-Upper */}
      <div className="absolute top-[28%] left-3 lg:left-6 hidden sm:block opacity-85">
        <PixelQuestionMarkBlock className="w-7 h-7 motion-safe:animate-bounce-slow" />
      </div>

      {/* Stack of Books Left-Mid */}
      <div className="absolute top-[58%] left-3 lg:left-6 hidden md:flex flex-col items-start gap-1 opacity-85">
        <PixelBookStack className="w-9 h-8" />
        <PixelGrass className="w-6 h-3 mt-[-4px]" />
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT PERIMETER: Knowledge Lightbulb (💡) & Question Block (❓)        */}
      {/* ========================================================================= */}
      {/* Knowledge Lightbulb Right-Upper */}
      <div className="absolute top-[26%] right-3 lg:right-6 hidden sm:block opacity-90">
        <PixelKnowledgeLightbulb className="w-8 h-10 motion-safe:animate-bounce-slow" />
      </div>

      {/* Question Block Right-Mid */}
      <div className="absolute top-[60%] right-3 lg:right-6 hidden md:flex flex-col items-end gap-1 opacity-80">
        <PixelQuestionMarkBlock className="w-6 h-6" />
        <PixelGrass className="w-6 h-3 mt-[-4px]" />
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM PERIMETER: Simple Green Grass & Subtle Flowers                  */}
      {/* ========================================================================= */}
      {/* Ground Line */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-500/30 via-teal-400/20 to-transparent border-t border-emerald-400/30" />

      {/* Bottom Left Corner Plants */}
      <div className="absolute bottom-2 left-4 sm:left-8 flex items-end gap-2 opacity-75">
        <PixelGrass className="w-6 h-4" />
        <PixelFlower className="w-3 h-3" color="#FBBF24" />
      </div>

      {/* Bottom Center Plants */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6 opacity-70">
        <PixelGrass className="w-5 h-3" />
        <PixelFlower className="w-3 h-3" color="#38BDF8" />
        <PixelGrass className="w-5 h-3" />
      </div>

      {/* Bottom Right Corner Plants */}
      <div className="absolute bottom-2 right-4 sm:right-8 flex items-end gap-2 opacity-75">
        <PixelFlower className="w-3 h-3" color="#F472B6" />
        <PixelGrass className="w-6 h-4" />
      </div>
    </div>
  );
}
