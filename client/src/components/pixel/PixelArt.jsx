import React from 'react';

/**
 * Clean SVG-based pixel art assets that scale crisply with shape-rendering: crispEdges
 */

export function PixelAdventurer({ className = "w-20 h-24" }) {
  return (
    <svg
      viewBox="0 0 32 36"
      className={`${className} shrink-0`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <rect x="6" y="33" width="20" height="3" fill="#94A3B8" opacity="0.4" rx="1" />
      
      {/* Cape */}
      <rect x="7" y="14" width="3" height="12" fill="#E11D48" />
      <rect x="5" y="16" width="3" height="11" fill="#BE123C" />
      <rect x="22" y="14" width="3" height="12" fill="#E11D48" />
      <rect x="24" y="16" width="3" height="11" fill="#BE123C" />

      {/* Boots */}
      <rect x="9" y="29" width="5" height="5" fill="#78350F" />
      <rect x="18" y="29" width="5" height="5" fill="#78350F" />
      <rect x="8" y="32" width="6" height="2" fill="#451A03" />
      <rect x="18" y="32" width="6" height="2" fill="#451A03" />

      {/* Legs / Pants */}
      <rect x="10" y="23" width="4" height="7" fill="#1E293B" />
      <rect x="18" y="23" width="4" height="7" fill="#1E293B" />
      <rect x="12" y="23" width="8" height="3" fill="#334155" />

      {/* Body / Tunic */}
      <rect x="9" y="13" width="14" height="11" fill="#2563EB" />
      <rect x="11" y="14" width="10" height="9" fill="#3B82F6" />
      {/* Gold belt */}
      <rect x="9" y="21" width="14" height="3" fill="#D97706" />
      <rect x="14" y="21" width="4" height="3" fill="#FBBF24" />
      {/* Chestplate Emblem */}
      <rect x="14" y="15" width="4" height="4" fill="#FACC15" />
      <rect x="15" y="16" width="2" height="2" fill="#FEF08A" />

      {/* Head / Skin */}
      <rect x="10" y="5" width="12" height="9" fill="#FED7AA" />
      <rect x="11" y="6" width="10" height="8" fill="#FFEDD5" />
      {/* Eyes */}
      <rect x="12" y="8" width="2" height="3" fill="#0F172A" />
      <rect x="18" y="8" width="2" height="3" fill="#0F172A" />
      <rect x="12" y="8" width="1" height="1" fill="#FFFFFF" />
      <rect x="18" y="8" width="1" height="1" fill="#FFFFFF" />
      {/* Blush */}
      <rect x="10" y="11" width="2" height="1" fill="#FDA4AF" />
      <rect x="20" y="11" width="2" height="1" fill="#FDA4AF" />
      {/* Smile */}
      <rect x="14" y="12" width="4" height="1" fill="#B45309" />

      {/* Golden Hair */}
      <rect x="9" y="3" width="14" height="4" fill="#F59E0B" />
      <rect x="8" y="4" width="3" height="6" fill="#D97706" />
      <rect x="21" y="4" width="3" height="6" fill="#F59E0B" />
      <rect x="11" y="2" width="10" height="2" fill="#FBBF24" />
      <rect x="13" y="1" width="6" height="2" fill="#FEF08A" />

      {/* Knight Helmet / Crown Feather */}
      <rect x="15" y="0" width="2" height="3" fill="#EC4899" />
      <rect x="14" y="0" width="1" height="2" fill="#F472B6" />

      {/* Sword in Hand */}
      <rect x="25" y="13" width="2" height="12" fill="#94A3B8" />
      <rect x="25" y="12" width="2" height="2" fill="#CBD5E1" />
      <rect x="25" y="10" width="2" height="2" fill="#E2E8F0" />
      <rect x="24" y="20" width="4" height="2" fill="#D97706" />
      <rect x="25" y="22" width="2" height="4" fill="#78350F" />
      <rect x="25" y="26" width="2" height="2" fill="#F59E0B" />

      {/* Shield in Hand */}
      <rect x="3" y="14" width="6" height="9" fill="#0284C7" />
      <rect x="4" y="15" width="4" height="7" fill="#38BDF8" />
      <rect x="5" y="17" width="2" height="3" fill="#FACC15" />
    </svg>
  );
}

export function PixelCloud({ className = "w-24 h-12" }) {
  return (
    <svg
      viewBox="0 0 48 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="12" width="32" height="10" fill="#FFFFFF" />
      <rect x="12" y="6" width="20" height="16" fill="#FFFFFF" />
      <rect x="20" y="2" width="14" height="20" fill="#FFFFFF" />
      <rect x="4" y="14" width="38" height="6" fill="#FFFFFF" />
      {/* Soft shadow base */}
      <rect x="6" y="18" width="36" height="4" fill="#E0F2FE" />
      <rect x="10" y="20" width="28" height="2" fill="#BAE6FD" />
    </svg>
  );
}

export function PixelFloatingIsland({ className = "w-32 h-24" }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tree on island */}
      <rect x="18" y="10" width="10" height="10" fill="#22C55E" />
      <rect x="16" y="12" width="14" height="6" fill="#16A34A" />
      <rect x="20" y="6" width="6" height="6" fill="#4ADE80" />
      <rect x="22" y="18" width="2" height="6" fill="#78350F" />

      {/* Small pixel flower */}
      <rect x="36" y="18" width="3" height="3" fill="#F472B6" />
      <rect x="37" y="19" width="1" height="1" fill="#FDE047" />
      <rect x="37" y="21" width="1" height="3" fill="#15803D" />

      {/* Island Top / Grass */}
      <rect x="8" y="22" width="48" height="6" fill="#4ADE80" />
      <rect x="6" y="24" width="52" height="4" fill="#22C55E" />
      <rect x="10" y="27" width="44" height="2" fill="#16A34A" />

      {/* Dirt Layer */}
      <rect x="10" y="28" width="44" height="6" fill="#92400E" />
      <rect x="14" y="34" width="36" height="5" fill="#78350F" />
      <rect x="20" y="39" width="24" height="4" fill="#581C87" opacity="0.6" />
      <rect x="26" y="43" width="12" height="3" fill="#451A03" />
      <rect x="30" y="46" width="4" height="2" fill="#451A03" />

      {/* Roots / Crystals */}
      <rect x="16" y="32" width="3" height="4" fill="#B45309" />
      <rect x="42" y="31" width="4" height="3" fill="#38BDF8" />
      <rect x="43" y="32" width="2" height="1" fill="#E0F2FE" />
    </svg>
  );
}

export function PixelCastle({ className = "w-20 h-24" }) {
  return (
    <svg
      viewBox="0 0 40 48"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Banner on Left Tower */}
      <rect x="8" y="0" width="2" height="8" fill="#475569" />
      <polygon points="10,2 18,5 10,8" fill="#EC4899" />

      {/* Banner on Right Tower */}
      <rect x="30" y="0" width="2" height="8" fill="#475569" />
      <polygon points="32,2 40,5 32,8" fill="#3B82F6" />

      {/* Left Tower */}
      <rect x="4" y="8" width="10" height="34" fill="#94A3B8" />
      <rect x="4" y="6" width="3" height="4" fill="#64748B" />
      <rect x="8" y="6" width="3" height="4" fill="#64748B" />
      <rect x="12" y="6" width="2" height="4" fill="#64748B" />
      <rect x="7" y="16" width="4" height="6" fill="#1E293B" rx="1" />

      {/* Right Tower */}
      <rect x="26" y="8" width="10" height="34" fill="#94A3B8" />
      <rect x="26" y="6" width="3" height="4" fill="#64748B" />
      <rect x="30" y="6" width="3" height="4" fill="#64748B" />
      <rect x="34" y="6" width="2" height="4" fill="#64748B" />
      <rect x="29" y="16" width="4" height="6" fill="#1E293B" rx="1" />

      {/* Center Keep */}
      <rect x="14" y="16" width="12" height="26" fill="#CBD5E1" />
      <rect x="14" y="14" width="3" height="3" fill="#94A3B8" />
      <rect x="19" y="14" width="3" height="3" fill="#94A3B8" />
      <rect x="23" y="14" width="3" height="3" fill="#94A3B8" />

      {/* Gate */}
      <rect x="17" y="30" width="6" height="12" fill="#451A03" rx="1" />
      <rect x="18" y="31" width="4" height="11" fill="#78350F" />
      <rect x="19" y="34" width="2" height="4" fill="#F59E0B" />
    </svg>
  );
}

export function PixelStar({ className = "", color = "#FACC15" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-4 h-4 shrink-0 ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="7" y="1" width="2" height="14" fill={color} />
      <rect x="1" y="7" width="14" height="2" fill={color} />
      <rect x="5" y="5" width="6" height="6" fill={color} />
      <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelScroll({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scroll Rolled Ends */}
      <rect x="2" y="3" width="20" height="3" fill="#FDE68A" />
      <rect x="2" y="18" width="20" height="3" fill="#FDE68A" />
      <rect x="1" y="2" width="3" height="5" fill="#D97706" />
      <rect x="20" y="2" width="3" height="5" fill="#D97706" />
      <rect x="1" y="17" width="3" height="5" fill="#D97706" />
      <rect x="20" y="17" width="3" height="5" fill="#D97706" />

      {/* Parchment Body */}
      <rect x="4" y="5" width="16" height="14" fill="#FEF3C7" />
      <rect x="6" y="8" width="12" height="2" fill="#D97706" opacity="0.6" />
      <rect x="6" y="11" width="10" height="2" fill="#D97706" opacity="0.6" />
      <rect x="6" y="14" width="8" height="2" fill="#D97706" opacity="0.6" />

      {/* Wax Seal */}
      <rect x="14" y="13" width="5" height="5" fill="#E11D48" />
      <rect x="15" y="14" width="3" height="3" fill="#FDA4AF" />
    </svg>
  );
}

export function PixelFlame({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Red Flame */}
      <rect x="8" y="16" width="8" height="6" fill="#DC2626" />
      <rect x="6" y="12" width="12" height="7" fill="#EA580C" />
      <rect x="8" y="7" width="8" height="8" fill="#F97316" />
      <rect x="10" y="3" width="4" height="6" fill="#F97316" />
      <rect x="12" y="1" width="2" height="3" fill="#FB923C" />

      {/* Inner Yellow Core */}
      <rect x="9" y="13" width="6" height="7" fill="#FBBF24" />
      <rect x="10" y="9" width="4" height="6" fill="#FDE047" />
      <rect x="11" y="12" width="2" height="5" fill="#FEF08A" />
      <rect x="11" y="14" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelGem({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top facet */}
      <rect x="7" y="4" width="10" height="4" fill="#C084FC" />
      <rect x="5" y="8" width="14" height="4" fill="#A855F7" />
      {/* Lower point */}
      <rect x="7" y="12" width="10" height="4" fill="#9333EA" />
      <rect x="9" y="16" width="6" height="3" fill="#7E22CE" />
      <rect x="11" y="19" width="2" height="2" fill="#6B21A8" />
      {/* Sparkle highlights */}
      <rect x="8" y="5" width="3" height="2" fill="#F3E8FF" />
      <rect x="6" y="9" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelCoin({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Coin Outer Rim */}
      <rect x="6" y="3" width="12" height="18" fill="#D97706" />
      <rect x="3" y="6" width="18" height="12" fill="#D97706" />
      <rect x="4" y="4" width="16" height="16" fill="#F59E0B" />

      {/* Coin Face */}
      <rect x="6" y="5" width="12" height="14" fill="#FBBF24" />
      <rect x="5" y="6" width="14" height="12" fill="#FBBF24" />

      {/* Crest in center */}
      <rect x="11" y="7" width="2" height="10" fill="#D97706" />
      <rect x="9" y="9" width="6" height="2" fill="#D97706" />
      <rect x="9" y="13" width="6" height="2" fill="#D97706" />

      {/* Shine highlight */}
      <rect x="6" y="6" width="2" height="4" fill="#FEF08A" />
      <rect x="7" y="5" width="4" height="2" fill="#FEF08A" />
    </svg>
  );
}

export function PixelChest({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chest Lid */}
      <rect x="3" y="4" width="18" height="6" fill="#92400E" />
      <rect x="2" y="6" width="20" height="4" fill="#B45309" />
      <rect x="2" y="4" width="3" height="6" fill="#F59E0B" />
      <rect x="19" y="4" width="3" height="6" fill="#F59E0B" />

      {/* Chest Base */}
      <rect x="3" y="10" width="18" height="10" fill="#78350F" />
      <rect x="2" y="10" width="3" height="10" fill="#D97706" />
      <rect x="19" y="10" width="3" height="10" fill="#D97706" />
      <rect x="3" y="18" width="18" height="2" fill="#451A03" />

      {/* Golden Lock & Bands */}
      <rect x="10" y="8" width="4" height="5" fill="#FACC15" />
      <rect x="11" y="10" width="2" height="2" fill="#1E293B" />
      <rect x="5" y="5" width="2" height="13" fill="#FBBF24" />
      <rect x="17" y="5" width="2" height="13" fill="#FBBF24" />
    </svg>
  );
}

export function PixelTree({ className = "w-16 h-24", variant = "pine" }) {
  if (variant === "oak") {
    return (
      <svg
        viewBox="0 0 32 40"
        className={className}
        style={{ shapeRendering: 'crispEdges' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <rect x="13" y="24" width="6" height="14" fill="#78350F" />
        <rect x="11" y="36" width="10" height="3" fill="#451A03" />
        {/* Foliage */}
        <rect x="6" y="8" width="20" height="18" fill="#16A34A" />
        <rect x="4" y="12" width="24" height="10" fill="#22C55E" />
        <rect x="8" y="4" width="16" height="8" fill="#4ADE80" />
        <rect x="10" y="2" width="12" height="4" fill="#86EFAC" />
        {/* Shadow */}
        <rect x="6" y="22" width="20" height="4" fill="#15803D" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 32 44"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <rect x="14" y="32" width="4" height="10" fill="#78350F" />
      <rect x="12" y="40" width="8" height="3" fill="#451A03" />
      {/* Bottom Tier */}
      <rect x="4" y="26" width="24" height="8" fill="#16A34A" />
      <rect x="6" y="24" width="20" height="4" fill="#22C55E" />
      {/* Middle Tier */}
      <rect x="8" y="16" width="16" height="10" fill="#16A34A" />
      <rect x="10" y="14" width="12" height="4" fill="#22C55E" />
      {/* Top Tier */}
      <rect x="12" y="6" width="8" height="10" fill="#22C55E" />
      <rect x="14" y="2" width="4" height="6" fill="#4ADE80" />
      <rect x="15" y="0" width="2" height="3" fill="#86EFAC" />
    </svg>
  );
}

export function PixelMountain({ className = "w-48 h-32" }) {
  return (
    <svg
      viewBox="0 0 80 50"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain Base */}
      <polygon points="40,6 76,48 4,48" fill="#93C5FD" opacity="0.4" />
      <polygon points="40,6 58,48 22,48" fill="#60A5FA" opacity="0.5" />
      {/* Snow Peak */}
      <polygon points="40,6 48,20 44,18 40,22 36,18 32,20" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export function PixelGrass({ className = "w-10 h-6" }) {
  return (
    <svg
      viewBox="0 0 20 12"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="2" height="8" fill="#22C55E" />
      <rect x="6" y="2" width="2" height="10" fill="#4ADE80" />
      <rect x="10" y="5" width="2" height="7" fill="#16A34A" />
      <rect x="14" y="1" width="2" height="11" fill="#4ADE80" />
      <rect x="18" y="6" width="2" height="6" fill="#22C55E" />
    </svg>
  );
}

export function PixelCottage({ className = "w-20 h-20" }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chimney & Smoke */}
      <rect x="24" y="2" width="4" height="8" fill="#94A3B8" />
      <rect x="26" y="0" width="2" height="2" fill="#E2E8F0" />
      {/* Roof */}
      <polygon points="18,6 34,18 2,18" fill="#E11D48" />
      <polygon points="18,8 30,17 6,17" fill="#FB7185" />
      {/* Walls */}
      <rect x="6" y="18" width="24" height="16" fill="#FEF3C7" />
      <rect x="6" y="32" width="24" height="3" fill="#B45309" />
      {/* Door */}
      <rect x="14" y="23" width="8" height="11" fill="#78350F" />
      <rect x="15" y="24" width="6" height="10" fill="#92400E" />
      <rect x="20" y="28" width="1" height="2" fill="#FACC15" />
      {/* Windows */}
      <rect x="8" y="22" width="4" height="5" fill="#38BDF8" />
      <rect x="24" y="22" width="4" height="5" fill="#38BDF8" />
    </svg>
  );
}

export function PixelSignpost({ className = "w-10 h-14" }) {
  return (
    <svg
      viewBox="0 0 24 32"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Post */}
      <rect x="10" y="10" width="4" height="22" fill="#78350F" />
      <rect x="8" y="30" width="8" height="2" fill="#451A03" />
      {/* Sign Plank 1 */}
      <rect x="2" y="4" width="18" height="6" fill="#D97706" />
      <polygon points="20,4 23,7 20,10" fill="#D97706" />
      <rect x="4" y="6" width="12" height="2" fill="#FEF3C7" />
      {/* Sign Plank 2 */}
      <rect x="6" y="12" width="16" height="6" fill="#B45309" />
      <polygon points="6,12 3,15 6,18" fill="#B45309" />
      <rect x="8" y="14" width="10" height="2" fill="#FDE68A" />
    </svg>
  );
}

export function PixelMushroom({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="8" width="4" height="7" fill="#FEF3C7" />
      <rect x="2" y="2" width="12" height="7" fill="#EF4444" rx="2" />
      <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" />
      <rect x="10" y="4" width="2" height="2" fill="#FFFFFF" />
      <rect x="7" y="6" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelCrystal({ className = "w-6 h-8", color = "#38BDF8" }) {
  return (
    <svg
      viewBox="0 0 16 20"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="8,1 14,8 11,18 5,18 2,8" fill={color} />
      <polygon points="8,3 12,8 9,16 7,16 4,8" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

export function PixelHills({ className = "w-full h-24" }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      preserveAspectRatio="none"
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back Layer Hill */}
      <polygon points="0,30 30,12 80,12 120,28 170,16 200,22 200,40 0,40" fill="#86EFAC" opacity="0.45" />
      {/* Front Layer Hill */}
      <polygon points="0,36 40,20 90,20 130,34 160,24 200,32 200,40 0,40" fill="#4ADE80" opacity="0.6" />
      {/* Grass Edge Accents */}
      <rect x="34" y="10" width="4" height="2" fill="#22C55E" />
      <rect x="74" y="10" width="4" height="2" fill="#22C55E" />
      <rect x="164" y="14" width="4" height="2" fill="#22C55E" />
    </svg>
  );
}

export function PixelFlower({ className = "w-4 h-4", color = "#F472B6" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="1" width="2" height="10" fill="#15803D" />
      <rect x="3" y="2" width="6" height="6" fill={color} />
      <rect x="5" y="4" width="2" height="2" fill="#FDE047" />
    </svg>
  );
}

export function PixelRock({ className = "w-6 h-5", color = "#64748B" }) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="8" height="2" fill="#94A3B8" />
      <rect x="2" y="4" width="12" height="6" fill={color} />
      <rect x="4" y="4" width="4" height="2" fill="#CBD5E1" />
      <rect x="1" y="8" width="14" height="4" fill="#475569" />
    </svg>
  );
}

export function PixelTower({ className = "w-12 h-20" }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flag */}
      <rect x="11" y="0" width="2" height="6" fill="#64748B" />
      <polygon points="13,1 19,3 13,5" fill="#3B82F6" />
      {/* Roof */}
      <polygon points="12,6 20,14 4,14" fill="#3B82F6" />
      {/* Tower Body */}
      <rect x="6" y="14" width="12" height="24" fill="#94A3B8" />
      <rect x="7" y="15" width="10" height="23" fill="#CBD5E1" />
      <rect x="10" y="20" width="4" height="6" fill="#1E293B" rx="1" />
      <rect x="9" y="32" width="6" height="8" fill="#451A03" />
    </svg>
  );
}

export function PixelBush({ className = "w-10 h-6" }) {
  return (
    <svg
      viewBox="0 0 20 12"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="12" height="8" fill="#22C55E" />
      <rect x="2" y="5" width="16" height="6" fill="#16A34A" />
      <rect x="6" y="1" width="8" height="3" fill="#4ADE80" />
      <rect x="4" y="8" width="12" height="4" fill="#15803D" />
      {/* Berry */}
      <rect x="7" y="4" width="2" height="2" fill="#E11D48" />
      <rect x="13" y="6" width="2" height="2" fill="#E11D48" />
    </svg>
  );
}

export function PixelPath({ className = "w-full h-16" }) {
  return (
    <svg
      viewBox="0 0 200 30"
      className={className}
      preserveAspectRatio="none"
      style={{ shapeRendering: 'crispEdges' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0,20 Q60,5 120,22 T200,10" stroke="#FDE68A" strokeWidth="6" strokeDasharray="6 4" opacity="0.4" fill="none" />
      <path d="M0,20 Q60,5 120,22 T200,10" stroke="#D97706" strokeWidth="2" strokeDasharray="4 6" opacity="0.3" fill="none" />
    </svg>
  );
}



