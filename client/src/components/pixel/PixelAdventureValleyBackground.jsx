import React, { useState } from 'react';
import {
  PixelAdventurer,
  PixelCloud,
  PixelStar,
  PixelChest,
  PixelTree,
  PixelRock,
  PixelGrass,
  PixelFlower,
  PixelCrystal,
  PixelBush,
  PixelMushroom,
} from './PixelArt';

/**
 * Pixel Art Milestone Flag & Checkpoint Post
 */
export function PixelMilestoneMarker({
  number = 1,
  color = '#3B82F6',
  badgeColor = '#60A5FA',
  label = 'Milestone',
  className = '',
}) {
  return (
    <div className={`group relative flex flex-col items-center cursor-pointer ${className}`}>
      {/* Hover Tooltip Badge */}
      <div className="absolute -top-8 px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-white text-[10px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform group-hover:-translate-y-1 shadow-md border border-slate-700 z-30">
        ★ {label} #{number}
      </div>

      <svg
        viewBox="0 0 28 36"
        className="w-7 h-9 sm:w-8 sm:h-10 shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Post */}
        <rect x="12" y="2" width="4" height="32" fill="#78350F" />
        <rect x="10" y="32" width="8" height="4" fill="#451A03" />

        {/* Flag Pole Finial */}
        <rect x="11" y="0" width="6" height="4" fill="#F59E0B" />
        <rect x="13" y="1" width="2" height="2" fill="#FEF08A" />

        {/* Flag Banner */}
        <polygon points="12,4 28,10 12,16" fill={color} />
        <polygon points="12,5 24,10 12,14" fill={badgeColor} />

        {/* Milestone Number Plate */}
        <rect x="3" y="18" width="10" height="10" fill="#1E293B" rx="1" />
        <rect x="4" y="19" width="8" height="8" fill="#F8FAFC" />
        {/* Star in plate */}
        <rect x="7" y="21" width="2" height="4" fill="#F59E0B" />
        <rect x="6" y="22" width="4" height="2" fill="#F59E0B" />
      </svg>
    </div>
  );
}

/**
 * Pixel Quest Notice Board
 */
export function PixelQuestNoticeBoard({ className = '' }) {
  return (
    <svg
      viewBox="0 0 32 36"
      className={`w-8 h-9 shrink-0 drop-shadow-sm ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Posts */}
      <rect x="4" y="14" width="3" height="20" fill="#78350F" />
      <rect x="25" y="14" width="3" height="20" fill="#78350F" />
      {/* Board Plank */}
      <rect x="2" y="4" width="28" height="18" fill="#B45309" />
      <rect x="4" y="6" width="24" height="14" fill="#D97706" />
      {/* Pinned Parchments */}
      <rect x="6" y="8" width="8" height="10" fill="#FEF3C7" />
      <rect x="9" y="7" width="2" height="2" fill="#EF4444" />
      <rect x="7" y="10" width="6" height="1" fill="#D97706" />
      <rect x="7" y="12" width="5" height="1" fill="#D97706" />

      <rect x="17" y="9" width="9" height="9" fill="#FEF3C7" />
      <rect x="21" y="8" width="2" height="2" fill="#3B82F6" />
      <rect x="18" y="11" width="7" height="1" fill="#D97706" />
      <rect x="18" y="13" width="6" height="1" fill="#D97706" />
      {/* Roof trim */}
      <polygon points="16,0 32,5 0,5" fill="#78350F" />
    </svg>
  );
}

/**
 * Final Goal Destination: Radiant Golden Trophy & Achievement Shrine
 */
export function PixelGoalShrine({ className = '' }) {
  return (
    <div className={`group relative flex flex-col items-center cursor-pointer ${className}`}>
      {/* Victory Tooltip */}
      <div className="absolute -top-10 px-3 py-1 rounded-xl bg-amber-900/90 text-yellow-300 text-[11px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform group-hover:-translate-y-1 shadow-lg border border-yellow-500/50 z-30">
        🏆 FINAL GOAL SUMMIT: MASTERY
      </div>

      {/* Radiant Aura / Halos */}
      <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-md group-hover:bg-amber-400/35 transition-all duration-300 animate-pulse" />

      <svg
        viewBox="0 0 48 56"
        className="w-14 h-16 sm:w-16 sm:h-20 shrink-0 drop-shadow-md transition-transform duration-300 group-hover:scale-110 relative z-10"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shrine Pedestal Base */}
        <rect x="8" y="44" width="32" height="10" fill="#64748B" />
        <rect x="6" y="48" width="36" height="6" fill="#475569" />
        <rect x="10" y="45" width="28" height="2" fill="#94A3B8" />

        {/* Pillars */}
        <rect x="6" y="24" width="6" height="20" fill="#94A3B8" />
        <rect x="36" y="24" width="6" height="20" fill="#94A3B8" />
        <rect x="5" y="22" width="8" height="3" fill="#CBD5E1" />
        <rect x="35" y="22" width="8" height="3" fill="#CBD5E1" />

        {/* Shrine Arch Top */}
        <polygon points="24,6 46,20 2,20" fill="#0284C7" />
        <polygon points="24,9 42,19 6,19" fill="#38BDF8" />
        <rect x="22" y="2" width="4" height="6" fill="#FACC15" />
        <rect x="23" y="3" width="2" height="3" fill="#FEF08A" />

        {/* Grand Golden Trophy in Center */}
        {/* Trophy Cup */}
        <rect x="18" y="20" width="12" height="10" fill="#F59E0B" />
        <rect x="19" y="21" width="10" height="8" fill="#FBBF24" />
        <rect x="20" y="22" width="8" height="6" fill="#FEF08A" />
        {/* Trophy Handles */}
        <rect x="15" y="22" width="3" height="6" fill="#D97706" />
        <rect x="30" y="22" width="3" height="6" fill="#D97706" />
        {/* Trophy Stem */}
        <rect x="22" y="30" width="4" height="6" fill="#D97706" />
        <rect x="20" y="36" width="8" height="4" fill="#F59E0B" />

        {/* Star Badge on Trophy */}
        <rect x="23" y="23" width="2" height="4" fill="#DC2626" />
        <rect x="22" y="24" width="4" height="2" fill="#DC2626" />
      </svg>
    </div>
  );
}

/**
 * Start Banner Stone
 */
export function PixelStartCamp({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 36 28"
        className="w-10 h-8 sm:w-11 sm:h-9 shrink-0 drop-shadow-xs"
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Start Stone Marker */}
        <rect x="6" y="8" width="24" height="18" fill="#64748B" rx="1" />
        <rect x="8" y="10" width="20" height="14" fill="#94A3B8" />
        <rect x="10" y="12" width="16" height="10" fill="#CBD5E1" />

        {/* Text "START" */}
        <rect x="11" y="14" width="14" height="2" fill="#1E293B" />
        <rect x="12" y="17" width="12" height="2" fill="#2563EB" />

        {/* Flag Pole on Marker */}
        <rect x="26" y="0" width="2" height="10" fill="#78350F" />
        <polygon points="28,1 36,4 28,7" fill="#10B981" />
      </svg>
    </div>
  );
}

/**
 * Full-Page Pixel-Art RPG Goal Journey & Achievement Path Background
 * Tells the visual story: START ➔ MILESTONE 1 ➔ MILESTONE 2 ➔ MILESTONE 3 ➔ GOAL SUMMIT
 */
export function PixelGoalJourneyBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #BAE6FD 0%, #CEEBFD 16%, #E0F2FE 30%, #EBF8FE 45%, #DCFCE7 65%, #BBF7D0 82%, #86EFAC 100%)',
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. SKY REALM: Clouds, Sparkles, and High-Altitude Goal Summit             */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-0 right-0 h-[28%]">
        {/* Drifting Clouds */}
        <PixelCloud className="absolute top-3 left-[4%] w-36 h-18 opacity-85 animate-pulse-slow" />
        <PixelCloud className="absolute top-10 left-[34%] w-28 h-14 opacity-75 hidden md:block" />
        <PixelCloud className="absolute top-4 right-[6%] w-40 h-20 opacity-80" />
        <PixelCloud className="absolute top-16 right-[38%] w-24 h-12 opacity-65 hidden sm:block" />

        {/* Sky Stars & Golden Sparkles */}
        <PixelStar className="absolute top-4 left-[16%] w-4 h-4 animate-pulse" color="#FACC15" />
        <PixelStar className="absolute top-12 left-[28%] w-3.5 h-3.5 animate-pulse-slow" color="#38BDF8" />
        <PixelStar className="absolute top-6 right-[24%] w-4 h-4 animate-pulse" color="#F472B6" />
        <PixelStar className="absolute top-14 right-[12%] w-3.5 h-3.5 animate-pulse-slow" color="#FACC15" />
        <PixelStar className="absolute top-20 left-[50%] w-4 h-4 animate-pulse" color="#A78BFA" />
      </div>

      {/* ========================================================================= */}
      {/* 2. THE GOAL PATHWAY (SVG WINDING JOURNEY TRAIL ACROSS THE ENTIRE WORLD)   */}
      {/* Winding from Bottom-Left (START) -> Mid -> Upper-Right (GOAL SHRINE)      */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <defs>
          <linearGradient id="goalPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#A78BFA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Winding Cobblestone Road Ribbon */}
        <path
          d="M 60,900 C 140,820 180,740 280,680 C 380,620 620,680 720,560 C 820,440 760,320 860,220 C 920,160 1020,120 1140,90"
          fill="none"
          stroke="#FEF3C7"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.65"
          className="hidden lg:block"
        />
        <path
          d="M 60,900 C 140,820 180,740 280,680 C 380,620 620,680 720,560 C 820,440 760,320 860,220 C 920,160 1020,120 1140,90"
          fill="none"
          stroke="#D97706"
          strokeWidth="3"
          strokeDasharray="8 6"
          opacity="0.45"
          className="hidden lg:block"
        />
        <path
          d="M 60,900 C 140,820 180,740 280,680 C 380,620 620,680 720,560 C 820,440 760,320 860,220 C 920,160 1020,120 1140,90"
          fill="none"
          stroke="url(#goalPathGrad)"
          strokeWidth="6"
          strokeDasharray="12 12"
          opacity="0.8"
          className="hidden lg:block"
        />
      </svg>

      {/* ========================================================================= */}
      {/* 3. MILESTONE CHECKPOINTS ALONG THE GOAL PATH                              */}
      {/* ========================================================================= */}

      {/* [STEP 1: START BASE CAMP] - Bottom Left */}
      <div className="absolute bottom-5 left-4 sm:left-8 lg:left-12 flex items-end gap-3 z-10 pointer-events-auto">
        <div className="flex flex-col items-center">
          <PixelStartCamp />
          <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300 shadow-2xs mt-1 uppercase">
            [0%] START
          </span>
        </div>

        {/* Hero Character Ready for Journey */}
        <div className="hover:scale-110 transition-transform duration-200 cursor-pointer" title="Adventurer at Journey Start">
          <PixelAdventurer className="w-14 h-18 sm:w-16 sm:h-20 drop-shadow-sm" />
        </div>

        {/* Starting Quest Notice Board */}
        <PixelQuestNoticeBoard className="hidden sm:block" />
      </div>

      {/* [STEP 2: MILESTONE 1 - "INITIATION"] - Lower-Mid Left (25% progress) */}
      <div className="absolute bottom-[28%] left-[18%] lg:left-[22%] hidden md:flex items-end gap-2.5 z-10 pointer-events-auto">
        <div className="flex flex-col items-center">
          <PixelMilestoneMarker
            number={1}
            color="#3B82F6"
            badgeColor="#60A5FA"
            label="Milestone 1: Initiation"
          />
          <span className="text-[9px] font-mono font-bold text-blue-800 bg-blue-100/90 px-1.5 py-0.5 rounded border border-blue-300 shadow-2xs mt-1">
            25% TRACK
          </span>
        </div>
        <PixelChest className="w-6 h-6 hover:scale-110 transition-transform cursor-pointer" />
        <PixelFlower className="w-4 h-4" color="#38BDF8" />
      </div>

      {/* [STEP 3: MILESTONE 2 - "MOMENTUM"] - Mid-Right (50% progress) */}
      <div className="absolute top-[48%] right-[14%] lg:right-[20%] hidden md:flex items-end gap-2.5 z-10 pointer-events-auto">
        <div className="flex flex-col items-center">
          <PixelMilestoneMarker
            number={2}
            color="#8B5CF6"
            badgeColor="#A78BFA"
            label="Milestone 2: Momentum"
          />
          <span className="text-[9px] font-mono font-bold text-purple-800 bg-purple-100/90 px-1.5 py-0.5 rounded border border-purple-300 shadow-2xs mt-1">
            50% HALFWAY
          </span>
        </div>
        <PixelCrystal className="w-5 h-7" color="#A78BFA" />
        <PixelChest className="w-6 h-6 hover:scale-110 transition-transform cursor-pointer" />
      </div>

      {/* [STEP 4: MILESTONE 3 - "MASTERY SPRINT"] - Upper-Mid Left/Center (75% progress) */}
      <div className="absolute top-[26%] left-[10%] lg:left-[14%] hidden lg:flex items-end gap-2.5 z-10 pointer-events-auto">
        <div className="flex flex-col items-center">
          <PixelMilestoneMarker
            number={3}
            color="#F59E0B"
            badgeColor="#FDE047"
            label="Milestone 3: Mastery Sprint"
          />
          <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-2xs mt-1">
            75% FINAL SPRINT
          </span>
        </div>
        <PixelStar className="w-5 h-5 animate-pulse" color="#FACC15" />
      </div>

      {/* [STEP 5: FINAL GOAL DESTINATION - "ACHIEVEMENT SUMMIT"] - Top Right (100% Mastery) */}
      <div className="absolute top-4 right-4 sm:right-10 lg:right-16 flex flex-col items-center z-10 pointer-events-auto">
        <PixelGoalShrine />
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] font-mono font-black text-amber-900 bg-gradient-to-r from-amber-200 to-yellow-300 px-2.5 py-0.5 rounded-full border border-amber-400 shadow-xs uppercase tracking-wider">
            ★ [100%] GOAL SUMMIT
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ENVIRONMENTAL RPG PROPS: Trees, Foliage, Crystals & Stepping Stones    */}
      {/* ========================================================================= */}
      {/* Bottom Ground Border */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-600/40 via-green-500/30 to-transparent border-t-2 border-emerald-400/50" />

      {/* Bottom Center Stepping Stones & Flower Accents */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-4 opacity-85">
        <PixelGrass className="w-8 h-5" />
        <PixelFlower className="w-4 h-4" color="#F472B6" />
        <PixelRock className="w-5 h-4" />
        <PixelFlower className="w-4 h-4" color="#FBBF24" />
        <PixelGrass className="w-8 h-5" />
      </div>

      {/* Mid Left Tree Grove */}
      <div className="absolute top-[52%] left-4 hidden xl:flex items-end gap-1 opacity-75">
        <PixelTree variant="pine" className="w-10 h-16" />
        <PixelTree variant="oak" className="w-12 h-18" />
      </div>

      {/* Mid Right Foliage */}
      <div className="absolute top-[65%] right-6 hidden xl:flex items-end gap-2 opacity-75">
        <PixelBush className="w-12 h-8" />
        <PixelMushroom className="w-5 h-5" />
      </div>
    </div>
  );
}
