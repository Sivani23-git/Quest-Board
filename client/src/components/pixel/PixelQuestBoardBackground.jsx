import React from 'react';
import {
  PixelCloud,
  PixelStar,
  PixelGrass,
  PixelFlower,
  PixelSignpost,
  PixelScroll,
  PixelChest,
  PixelFloatingIsland,
} from './PixelArt';

/**
 * Tiny Pixel Art Adventure Map (🗺️)
 */
function PixelQuestMap({ className = 'w-7 h-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Map Parchment Base */}
      <rect x="3" y="4" width="18" height="16" fill="#FEF3C7" />
      <rect x="2" y="5" width="20" height="14" fill="#FDE68A" />
      
      {/* Map Border / Creases */}
      <rect x="4" y="3" width="16" height="1" fill="#D97706" />
      <rect x="4" y="20" width="16" height="1" fill="#D97706" />
      <rect x="2" y="5" width="1" height="14" fill="#D97706" />
      <rect x="21" y="5" width="1" height="14" fill="#D97706" />

      {/* Dotted Trail */}
      <rect x="6" y="8" width="2" height="2" fill="#B45309" />
      <rect x="9" y="10" width="2" height="2" fill="#B45309" />
      <rect x="12" y="9" width="2" height="2" fill="#B45309" />
      <rect x="15" y="12" width="2" height="2" fill="#B45309" />

      {/* Red X Destination Marker */}
      <rect x="17" y="14" width="3" height="1" fill="#EF4444" />
      <rect x="18" y="13" width="1" height="3" fill="#EF4444" />
      <rect x="17" y="13" width="1" height="1" fill="#DC2626" />
      <rect x="19" y="15" width="1" height="1" fill="#DC2626" />

      {/* Mountain Icon on Map */}
      <polygon points="7,15 10,12 13,15" fill="#65A30D" />
      <polygon points="10,16 12,13 14,16" fill="#84CC16" />
    </svg>
  );
}

/**
 * Tiny Pixel Art Adventure Blade / Dagger (⚔️)
 */
function PixelMiniSword({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${className} shrink-0 drop-shadow-xs`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blade */}
      <rect x="13" y="3" width="2" height="3" fill="#FFFFFF" />
      <rect x="11" y="5" width="2" height="4" fill="#E2E8F0" />
      <rect x="9" y="7" width="2" height="4" fill="#CBD5E1" />
      <rect x="7" y="9" width="2" height="4" fill="#94A3B8" />

      {/* Crossguard */}
      <rect x="4" y="12" width="5" height="2" fill="#F59E0B" />
      <rect x="6" y="10" width="2" height="5" fill="#F59E0B" />
      <rect x="5" y="11" width="3" height="3" fill="#FBBF24" />

      {/* Handle */}
      <rect x="3" y="14" width="2" height="3" fill="#78350F" />
      {/* Pommel */}
      <rect x="2" y="17" width="2" height="2" fill="#F59E0B" />
    </svg>
  );
}

/**
 * Dedicated Simple, Cute Pixel-Art Background for Quest Board Page
 * 
 * Features:
 * - Soft pastel sky (soft sky-blue, mint green, and pale yellow gradient)
 * - Minimal, spacious RPG Quest World decorations:
 *   • Top: 2-3 gentle pixel clouds, tiny twinkling achievement stars
 *   • Left Edge: Wooden quest signpost (🪧), adventurer sword (⚔️), subtle grass
 *   • Right Edge: Quest scroll (📜), treasure map (🗺️), tiny floating island in corner
 *   • Bottom Edge: Soft green ground fringe, flowers, and tiny treasure chest (💰)
 * - Spacious Center: Kept totally clean to frame the Quest Board cards and controls
 * - Full Page: Fixed edge-to-edge behind all content, pointer-events-none
 */
export function PixelQuestBoardBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. SOFT PASTEL SKY & ADVENTURE AMBIENCE                                  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE] via-[#EFF6FF] via-45% to-[#F0FDF4]" />

      {/* Soft Ambient Glows */}
      <div className="absolute -top-12 left-1/4 w-96 h-64 bg-blue-300/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-16 w-80 h-72 bg-amber-200/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-96 h-72 bg-emerald-200/20 rounded-full blur-3xl" />

      {/* ========================================================================= */}
      {/* 2. TOP SKY: 2–3 Soft Pixel Clouds & Subtle Twinkling Stars               */}
      {/* ========================================================================= */}
      {/* Top Left Cloud */}
      <div className="absolute top-4 left-[6%] sm:left-[10%] opacity-85 motion-safe:animate-float-slow">
        <PixelCloud className="w-20 h-10 sm:w-28 sm:h-12 drop-shadow-xs" />
      </div>

      {/* Top Center-Right Cloud */}
      <div className="absolute top-8 right-[8%] sm:right-[14%] opacity-80 motion-safe:animate-float-delayed">
        <PixelCloud className="w-16 h-8 sm:w-24 sm:h-10 drop-shadow-xs" />
      </div>

      {/* Tiny Sparkles / Stars (Near Outer Tops) */}
      <div className="absolute top-6 left-[22%] hidden md:block opacity-65 motion-safe:animate-pulse">
        <PixelStar className="w-3.5 h-3.5 text-amber-400" color="#FBBF24" />
      </div>
      <div className="absolute top-14 right-[28%] hidden lg:block opacity-60 motion-safe:animate-pulse">
        <PixelStar className="w-3 h-3 text-sky-400" color="#38BDF8" />
      </div>

      {/* ========================================================================= */}
      {/* 3. LEFT MARGIN: Wooden Signpost (🪧) & Mini Blade (⚔️)                    */}
      {/* ========================================================================= */}
      <div className="absolute top-[28%] left-3 lg:left-6 hidden sm:flex flex-col items-start gap-2 opacity-85">
        <PixelSignpost className="w-9 h-12 lg:w-11 lg:h-14 drop-shadow-xs motion-safe:hover:rotate-1 transition-transform" />
        <div className="flex items-center gap-1.5 pl-1">
          <PixelMiniSword className="w-5 h-5 -rotate-12 opacity-80" />
          <PixelFlower className="w-3 h-3" color="#F472B6" />
        </div>
      </div>

      {/* Mid Left Subtle Foliage */}
      <div className="absolute top-[62%] left-3 lg:left-6 hidden md:flex flex-col items-start gap-1 opacity-75">
        <PixelGrass className="w-6 h-3" />
        <PixelFlower className="w-3.5 h-3.5" color="#FBBF24" />
      </div>

      {/* ========================================================================= */}
      {/* 4. RIGHT MARGIN: Floating Island, Quest Scroll (📜) & Map (🗺️)            */}
      {/* ========================================================================= */}
      {/* Tiny Floating Island in Upper-Right Corner */}
      <div className="absolute top-[18%] right-2 lg:right-6 hidden sm:block opacity-85 motion-safe:animate-float-slow">
        <PixelFloatingIsland className="w-20 h-16 lg:w-24 lg:h-18 drop-shadow-xs" />
      </div>

      {/* Right Mid: Quest Parchment Scroll & Exploration Map */}
      <div className="absolute top-[52%] right-3 lg:right-6 hidden sm:flex flex-col items-end gap-2 opacity-85">
        <div className="flex items-center gap-1.5">
          <PixelStar className="w-2.5 h-2.5" color="#A78BFA" />
          <PixelQuestMap className="w-6 h-6 lg:w-7 lg:h-7 drop-shadow-xs motion-safe:animate-bounce-slow" />
        </div>
        <PixelScroll className="w-6 h-6 lg:w-7 lg:h-7 opacity-90" />
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PERIMETER: Ground Border, Subtle Grass & Treasure Chest (💰)   */}
      {/* ========================================================================= */}
      {/* Ground Line */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-emerald-500/30 via-teal-400/20 to-transparent border-t border-emerald-400/30" />

      {/* Bottom Left: Grass & Flower */}
      <div className="absolute bottom-2 left-4 sm:left-8 flex items-end gap-2 opacity-80">
        <PixelGrass className="w-6 h-4" />
        <PixelFlower className="w-3.5 h-3.5" color="#38BDF8" />
      </div>

      {/* Bottom Center-Right: Tiny Treasure Chest (💰) & Grass Accents */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-5 opacity-85">
        <PixelGrass className="w-5 h-3" />
        <PixelFlower className="w-3 h-3" color="#A78BFA" />
        <div className="relative group">
          <PixelChest className="w-6 h-6 drop-shadow-xs motion-safe:animate-bounce-slow" />
          <div className="absolute -top-2 -right-2">
            <PixelStar className="w-2.5 h-2.5" color="#FACC15" />
          </div>
        </div>
        <PixelFlower className="w-3 h-3" color="#F472B6" />
        <PixelGrass className="w-5 h-3" />
      </div>

      {/* Bottom Right: Grass & Flower */}
      <div className="absolute bottom-2 right-4 sm:right-8 flex items-end gap-2 opacity-80">
        <PixelFlower className="w-3 h-3" color="#FBBF24" />
        <PixelGrass className="w-6 h-4" />
      </div>
    </div>
  );
}

export default PixelQuestBoardBackground;
