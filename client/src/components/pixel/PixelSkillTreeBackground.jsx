import React from 'react';
import {
  PixelCloud,
  PixelStar,
  PixelTree,
  PixelGrass,
  PixelFlower,
  PixelChest,
  PixelRock,
  PixelMushroom,
  PixelCrystal,
  PixelBush,
} from './PixelArt';

/**
 * Tiny Floating Pixel Platform (Grass + Earth block)
 */
function PixelSmallPlatform({ className = 'w-16 h-10', children }) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Platform Content (Chest, Plant, Crystal, etc.) */}
      {children && <div className="mb-[-6px] z-10">{children}</div>}

      <svg
        viewBox="0 0 36 20"
        className="w-full h-full drop-shadow-xs"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grass Top */}
        <rect x="2" y="2" width="32" height="4" fill="#4ADE80" />
        <rect x="0" y="4" width="36" height="4" fill="#22C55E" />
        <rect x="4" y="7" width="28" height="2" fill="#16A34A" />

        {/* Dirt Base */}
        <rect x="4" y="8" width="28" height="6" fill="#92400E" />
        <rect x="8" y="14" width="20" height="4" fill="#78350F" />
        <rect x="14" y="18" width="8" height="2" fill="#451A03" />

        {/* Small Root Accents */}
        <rect x="10" y="12" width="2" height="3" fill="#B45309" />
        <rect x="24" y="11" width="2" height="4" fill="#B45309" />
      </svg>
    </div>
  );
}

/**
 * Tiny RPG Skill Question / Lucky Block
 */
function PixelQuestionBlock({ className = 'w-7 h-7' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Block Body */}
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

      {/* Highlight */}
      <rect x="2" y="2" width="11" height="1" fill="#FEF08A" />
      <rect x="2" y="3" width="1" height="10" fill="#FEF08A" />
    </svg>
  );
}

/**
 * Tiny Sprouting Skill Leaf / Vine Accent
 */
function PixelSkillSprout({ className = 'w-5 h-6' }) {
  return (
    <svg
      viewBox="0 0 12 16"
      className={`${className} shrink-0`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <rect x="5" y="6" width="2" height="10" fill="#16A34A" />
      {/* Left Leaf */}
      <rect x="1" y="5" width="4" height="3" fill="#4ADE80" />
      <rect x="2" y="4" width="2" height="1" fill="#86EFAC" />
      {/* Right Leaf */}
      <rect x="7" y="3" width="4" height="3" fill="#22C55E" />
      <rect x="8" y="2" width="2" height="1" fill="#86EFAC" />
      {/* Glowing Bud */}
      <rect x="5" y="2" width="2" height="3" fill="#FDE047" />
      <rect x="5" y="1" width="2" height="1" fill="#FEF08A" />
    </svg>
  );
}

/**
 * Dedicated Pixel-Art RPG Skill Tree Background
 * 
 * Features:
 * - Soft, airy pastel sky blue background
 * - NO mountains, NO heavy scenery, NO distracting elements
 * - Clean, calm, uncluttered open center for optimal card readability
 * - Small perimeter pixel elements:
 *   • Top: small fluffy clouds, gentle sparkles, floating XP orbs
 *   • Left edge: small pixel trees, grass, tiny platform with sprout
 *   • Right edge: small pixel trees, grass, tiny platform with treasure / block
 *   • Bottom edge: simple pixel grass & pastel flowers
 * - Fully responsive and fixed behind scrolling content
 * - Motion reduction safe
 */
export function PixelSkillTreeBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #BAE6FD 0%, #CEEBFD 18%, #E0F2FE 35%, #EFF8FE 60%, #F0FDF4 85%, #DCFCE7 100%)',
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. TOP EDGE: Small Clouds, Gentle Stars & Tiny Floating Skill Particles   */}
      {/* ========================================================================= */}
      {/* Top Left Cloud */}
      <PixelCloud className="absolute top-4 left-[3%] w-28 h-14 opacity-85 motion-safe:animate-pulse-slow" />
      {/* Top Center-Left Cloud */}
      <PixelCloud className="absolute top-10 left-[26%] w-20 h-10 opacity-60 hidden md:block" />
      {/* Top Center-Right Cloud */}
      <PixelCloud className="absolute top-8 right-[24%] w-22 h-11 opacity-65 hidden lg:block" />
      {/* Top Right Cloud */}
      <PixelCloud className="absolute top-4 right-[4%] w-32 h-16 opacity-80 motion-safe:animate-pulse-slow" />

      {/* Tiny Stars / Sparkles near top perimeter */}
      <PixelStar className="absolute top-5 left-[16%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#FACC15" />
      <PixelStar className="absolute top-12 left-[20%] w-3 h-3 motion-safe:animate-pulse-slow" color="#38BDF8" />
      <PixelStar className="absolute top-6 right-[18%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#F472B6" />
      <PixelStar className="absolute top-14 right-[12%] w-3 h-3 motion-safe:animate-pulse-slow" color="#FACC15" />

      {/* Floating XP / Skill Particles */}
      <div className="absolute top-16 left-[8%] w-2 h-2 rounded-xs bg-amber-400 opacity-70 motion-safe:animate-bounce-slow shadow-xs" />
      <div className="absolute top-20 right-[10%] w-2 h-2 rounded-xs bg-sky-400 opacity-70 motion-safe:animate-bounce-slow shadow-xs" />
      <div className="absolute top-24 left-[14%] w-1.5 h-1.5 rounded-xs bg-emerald-400 opacity-60 motion-safe:animate-pulse" />
      <div className="absolute top-28 right-[16%] w-1.5 h-1.5 rounded-xs bg-purple-400 opacity-60 motion-safe:animate-pulse-slow" />

      {/* ========================================================================= */}
      {/* 2. LEFT PERIMETER: Small Trees, Sprout & Tiny Floating Platform          */}
      {/* ========================================================================= */}
      {/* Left Upper Floating Platform with Glowing Sprout */}
      <div className="absolute top-[22%] left-3 lg:left-6 hidden sm:block opacity-90">
        <PixelSmallPlatform className="w-14 h-9">
          <PixelSkillSprout className="w-4 h-5" />
        </PixelSmallPlatform>
      </div>

      {/* Left Mid Trees & Vegetation */}
      <div className="absolute top-[48%] left-2 lg:left-5 hidden md:flex flex-col items-start gap-1 opacity-80">
        <PixelTree variant="oak" className="w-10 h-16" />
        <div className="flex items-end gap-1 mt-[-6px]">
          <PixelGrass className="w-7 h-4" />
          <PixelFlower className="w-3.5 h-3.5" color="#38BDF8" />
        </div>
      </div>

      {/* Left Lower Tree & Sprout Accent */}
      <div className="absolute bottom-[20%] left-3 lg:left-6 hidden lg:flex items-end gap-2 opacity-85">
        <PixelTree variant="pine" className="w-9 h-14" />
        <div className="flex flex-col items-center">
          <PixelCrystal className="w-4 h-5 mb-0.5" color="#38BDF8" />
          <PixelGrass className="w-6 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT PERIMETER: Small Trees, Platform with Lucky Block / Chest        */}
      {/* ========================================================================= */}
      {/* Right Upper Floating Platform with Lucky Block */}
      <div className="absolute top-[20%] right-3 lg:right-6 hidden sm:block opacity-90">
        <PixelSmallPlatform className="w-14 h-9">
          <PixelQuestionBlock className="w-6 h-6" />
        </PixelSmallPlatform>
      </div>

      {/* Right Mid Platform with Tiny Chest */}
      <div className="absolute top-[46%] right-3 lg:right-6 hidden md:block opacity-85">
        <PixelSmallPlatform className="w-13 h-8">
          <PixelChest className="w-5 h-5" />
        </PixelSmallPlatform>
      </div>

      {/* Right Lower Tree & Vegetation */}
      <div className="absolute bottom-[18%] right-2 lg:right-5 hidden md:flex flex-col items-end gap-1 opacity-80">
        <PixelTree variant="pine" className="w-10 h-16" />
        <div className="flex items-end gap-1 mt-[-6px]">
          <PixelFlower className="w-3.5 h-3.5" color="#F472B6" />
          <PixelGrass className="w-7 h-4" />
          <PixelMushroom className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM PERIMETER: Soft Ground Layer, Grass & Flowers                  */}
      {/* ========================================================================= */}
      {/* Bottom Ground Border */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-emerald-500/40 via-green-400/30 to-transparent border-t-2 border-emerald-400/40" />

      {/* Bottom Left Corner Plants */}
      <div className="absolute bottom-2 left-4 sm:left-8 flex items-end gap-2 opacity-85">
        <PixelBush className="w-8 h-5 hidden sm:block" />
        <PixelGrass className="w-7 h-4" />
        <PixelFlower className="w-3.5 h-3.5" color="#FBBF24" />
        <PixelSkillSprout className="w-4 h-5 hidden md:block" />
      </div>

      {/* Bottom Center Scattered Grass */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-6 opacity-75">
        <PixelGrass className="w-6 h-4" />
        <PixelFlower className="w-3 h-3" color="#A78BFA" />
        <PixelRock className="w-4 h-3" />
        <PixelFlower className="w-3 h-3" color="#38BDF8" />
        <PixelGrass className="w-6 h-4" />
      </div>

      {/* Bottom Right Corner Plants */}
      <div className="absolute bottom-2 right-4 sm:right-8 flex items-end gap-2 opacity-85">
        <PixelSkillSprout className="w-4 h-5 hidden md:block" />
        <PixelFlower className="w-3.5 h-3.5" color="#F472B6" />
        <PixelGrass className="w-7 h-4" />
        <PixelBush className="w-8 h-5 hidden sm:block" />
      </div>
    </div>
  );
}
