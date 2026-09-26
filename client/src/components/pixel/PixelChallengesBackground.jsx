import React from 'react';
import {
  PixelCloud,
  PixelStar,
  PixelGrass,
  PixelFlower,
  PixelChest,
} from './PixelArt';

/**
 * Tiny Pixel Art Tournament Banner / Flagpost (🏳️)
 */
function PixelArenaBanner({ color = '#8B5CF6', secondaryColor = '#A78BFA', className = '' }) {
  return (
    <svg
      viewBox="0 0 20 32"
      className={`w-6 h-9 sm:w-7 sm:h-10 shrink-0 drop-shadow-xs ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wooden Flagpole */}
      <rect x="3" y="1" width="2" height="30" fill="#78350F" />
      <rect x="2" y="30" width="4" height="2" fill="#451A03" />

      {/* Golden Finial Cap */}
      <rect x="2" y="0" width="4" height="3" fill="#F59E0B" />
      <rect x="3" y="1" width="2" height="1" fill="#FEF08A" />

      {/* Pennant / Banner */}
      <polygon points="5,3 19,8 5,14" fill={color} />
      <polygon points="5,4 16,8 5,12" fill={secondaryColor} />

      {/* Small Star Crest on Banner */}
      <rect x="8" y="7" width="2" height="3" fill="#FFFFFF" />
      <rect x="7" y="8" width="4" height="1" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Tiny Pixel Art Trophy (🏆)
 */
function PixelMiniTrophy({ className = 'w-7 h-8' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xs motion-safe:animate-pulse" />

      <svg
        viewBox="0 0 18 20"
        className="w-full h-full drop-shadow-xs relative z-10"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Pedestal */}
        <rect x="4" y="16" width="10" height="4" fill="#64748B" />
        <rect x="6" y="14" width="6" height="2" fill="#94A3B8" />

        {/* Trophy Stem */}
        <rect x="8" y="11" width="2" height="3" fill="#D97706" />

        {/* Trophy Cup */}
        <rect x="5" y="4" width="8" height="7" fill="#F59E0B" />
        <rect x="6" y="5" width="6" height="5" fill="#FBBF24" />
        <rect x="7" y="6" width="4" height="3" fill="#FEF08A" />

        {/* Handles */}
        <rect x="3" y="5" width="2" height="4" fill="#D97706" />
        <rect x="13" y="5" width="2" height="4" fill="#D97706" />

        {/* Crown Rim */}
        <rect x="4" y="3" width="10" height="2" fill="#FBBF24" />
      </svg>
    </div>
  );
}

/**
 * Tiny Pixel Sprint Energy Badge (⚡)
 */
function PixelSprintBadge({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 font-mono font-black text-xs shadow-2xs select-none ${className}`}
    >
      ⚡
    </div>
  );
}

/**
 * Dedicated Simple & Cute Pixel-Art Background for Community Challenges
 * 
 * Features:
 * - Soft pastel sky with tournament arena vibes (pastel sky blue, lavender, and mint)
 * - Minimal, high-quality challenge arena elements:
 *   • Top: 2-3 soft clouds, subtle golden/purple sparkles
 *   • Left: tournament event banner (🏳️) & sprint badge (⚡)
 *   • Right: tournament event banner (🏳️) & subtle treasure chest
 *   • Bottom: gentle grass & tiny golden trophy (🏆)
 * - Center kept completely open and calm for live events and sprint cards
 * - Fixed full-page background layer
 * - Motion-reduction safe
 */
export function PixelChallengesBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #BAE6FD 0%, #DCE8FD 20%, #EBEFFD 42%, #F4FAF8 68%, #F0FDF4 85%, #DCFCE7 100%)',
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. TOP PERIMETER: 2-3 Small Clouds & Gentle Sparkles                      */}
      {/* ========================================================================= */}
      {/* Cloud Top-Left */}
      <PixelCloud className="absolute top-4 left-[3%] w-28 h-14 opacity-80 motion-safe:animate-pulse-slow" />
      {/* Cloud Top-Center/Right */}
      <PixelCloud className="absolute top-8 right-[28%] w-22 h-11 opacity-60 hidden lg:block" />
      {/* Cloud Top-Right */}
      <PixelCloud className="absolute top-4 right-[4%] w-30 h-15 opacity-80 motion-safe:animate-pulse-slow" />

      {/* Tiny Sparkles (✨) */}
      <PixelStar className="absolute top-6 left-[20%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#A78BFA" />
      <PixelStar className="absolute top-14 left-[26%] w-3 h-3 motion-safe:animate-pulse-slow" color="#FACC15" />
      <PixelStar className="absolute top-6 right-[20%] w-3.5 h-3.5 motion-safe:animate-pulse" color="#F472B6" />
      <PixelStar className="absolute top-14 right-[12%] w-3 h-3 motion-safe:animate-pulse-slow" color="#38BDF8" />

      {/* ========================================================================= */}
      {/* 2. LEFT PERIMETER: Event Tournament Banner (🏳️) & Sprint Badge (⚡)        */}
      {/* ========================================================================= */}
      {/* Left Upper Arena Banner */}
      <div className="absolute top-[26%] left-3 lg:left-6 hidden sm:flex flex-col items-start gap-1 opacity-85">
        <PixelArenaBanner color="#8B5CF6" secondaryColor="#A78BFA" />
        <PixelSprintBadge className="mt-1 motion-safe:animate-bounce-slow" />
      </div>

      {/* Left Mid Grass & Flower */}
      <div className="absolute top-[58%] left-3 lg:left-6 hidden md:flex flex-col items-start gap-1 opacity-80">
        <PixelGrass className="w-6 h-3" />
        <PixelFlower className="w-3.5 h-3.5" color="#A78BFA" />
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT PERIMETER: Event Tournament Banner (🏳️) & Small Reward Chest     */}
      {/* ========================================================================= */}
      {/* Right Upper Arena Banner */}
      <div className="absolute top-[24%] right-3 lg:right-6 hidden sm:flex flex-col items-end gap-1 opacity-85">
        <PixelArenaBanner color="#F59E0B" secondaryColor="#FDE047" />
        <PixelChest className="w-5 h-5 mt-1 motion-safe:animate-bounce-slow" />
      </div>

      {/* Right Mid Grass */}
      <div className="absolute top-[56%] right-3 lg:right-6 hidden md:flex flex-col items-end gap-1 opacity-80">
        <PixelFlower className="w-3.5 h-3.5" color="#FBBF24" />
        <PixelGrass className="w-6 h-3" />
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM PERIMETER: Ground Border, Subtle Grass & Mini Trophy (🏆)      */}
      {/* ========================================================================= */}
      {/* Ground Line */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-500/30 via-teal-400/20 to-transparent border-t border-emerald-400/30" />

      {/* Bottom Left Corner */}
      <div className="absolute bottom-2 left-4 sm:left-8 flex items-end gap-2 opacity-75">
        <PixelGrass className="w-6 h-4" />
        <PixelFlower className="w-3 h-3" color="#FBBF24" />
      </div>

      {/* Bottom Center: Mini Trophy (🏆) & Scattered Flora */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-5 opacity-80">
        <PixelGrass className="w-5 h-3" />
        <PixelFlower className="w-3 h-3" color="#38BDF8" />
        <PixelMiniTrophy className="w-6 h-7 -mb-0.5" />
        <PixelFlower className="w-3 h-3" color="#A78BFA" />
        <PixelGrass className="w-5 h-3" />
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-2 right-4 sm:right-8 flex items-end gap-2 opacity-75">
        <PixelFlower className="w-3 h-3" color="#F472B6" />
        <PixelGrass className="w-6 h-4" />
      </div>
    </div>
  );
}

export default PixelChallengesBackground;
