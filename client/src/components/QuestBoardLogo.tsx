import React, { useId } from 'react';

export interface QuestBoardLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  stackText?: boolean;
  showGlow?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_CONFIGS = {
  sm: {
    iconSize: 26,
    textSize: 10,
    gap: 6,
    viewBoxWidth: 160,
    viewBoxHeight: 32,
    badgeRadius: 6,
  },
  md: {
    iconSize: 34,
    textSize: 13,
    gap: 8,
    viewBoxWidth: 190,
    viewBoxHeight: 38,
    badgeRadius: 8,
  },
  lg: {
    iconSize: 44,
    textSize: 16,
    gap: 10,
    viewBoxWidth: 230,
    viewBoxHeight: 48,
    badgeRadius: 10,
  },
  xl: {
    iconSize: 56,
    textSize: 20,
    gap: 12,
    viewBoxWidth: 280,
    viewBoxHeight: 60,
    badgeRadius: 12,
  },
};

export const QuestBoardLogo: React.FC<QuestBoardLogoProps> = ({
  variant = 'full',
  size = 'md',
  stackText = false,
  showGlow = false,
  className = '',
  onClick,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  const qBgId = `qBg-${uniqueId}`;
  const qDitherId = `qDither-${uniqueId}`;
  const qTextGradId = `qTextGrad-${uniqueId}`;
  const bTextGradId = `bTextGrad-${uniqueId}`;
  const glowFilterId = `qGlow-${uniqueId}`;
  const swordGrad1 = `qSword1-${uniqueId}`;
  const swordGrad2 = `qSword2-${uniqueId}`;

  // Crossed Swords Icon SVG Component
  const renderIcon = (iconDimension: number) => (
    <svg
      width={iconDimension}
      height={iconDimension}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
      style={{ imageRendering: 'pixelated' }}
    >
      <defs>
        {/* Pastel RPG Badge Background Gradient */}
        <linearGradient id={qBgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Subtle Pixel Dither / Grid Overlay */}
        <pattern id={qDitherId} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="white" fillOpacity="0.08" />
          <rect x="2" y="2" width="2" height="2" fill="white" fillOpacity="0.08" />
        </pattern>

        {/* Steel Blade Gradient */}
        <linearGradient id={swordGrad1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id={swordGrad2} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        {showGlow && (
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.35" />
          </filter>
        )}
      </defs>

      {/* Pastel Gaming Background Tile */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="9"
        fill={`url(#${qBgId})`}
        stroke="#60A5FA"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        filter={showGlow ? `url(#${glowFilterId})` : undefined}
      />

      {/* Dither pattern overlay */}
      <rect x="2" y="2" width="36" height="36" rx="9" fill={`url(#${qDitherId})`} />

      {/* Outer Pixel Border Accent */}
      <rect x="4" y="4" width="32" height="32" rx="7" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1" />

      {/* Pixel Art Crossed Swords */}
      {/* Sword 1: Top-Left to Bottom-Right (\) */}
      {/* Blade Tip */}
      <rect x="9" y="9" width="3" height="3" fill="#FFFFFF" />
      <rect x="12" y="10" width="3" height="3" fill="#F1F5F9" />
      <rect x="10" y="12" width="3" height="3" fill="#CBD5E1" />
      {/* Blade Mid */}
      <rect x="13" y="13" width="3" height="3" fill={`url(#${swordGrad1})`} />
      <rect x="16" y="14" width="3" height="3" fill="#F8FAFC" />
      <rect x="14" y="16" width="3" height="3" fill="#94A3B8" />
      {/* Blade Center */}
      <rect x="17" y="17" width="3" height="3" fill="#E2E8F0" />
      <rect x="20" y="18" width="3" height="3" fill="#FFFFFF" />
      <rect x="18" y="20" width="3" height="3" fill="#64748B" />
      {/* Crossguard 1 (Gold/Amber) */}
      <rect x="22" y="19" width="3" height="3" fill="#F59E0B" />
      <rect x="23" y="17" width="2" height="3" fill="#FDE68A" />
      <rect x="19" y="22" width="3" height="3" fill="#D97706" />
      <rect x="17" y="23" width="3" height="2" fill="#B45309" />
      <rect x="21" y="21" width="3" height="3" fill="#FBBF24" />
      {/* Hilt / Handle 1 */}
      <rect x="24" y="24" width="3" height="3" fill="#92400E" />
      <rect x="26" y="26" width="3" height="3" fill="#78350F" />
      {/* Pommel 1 (Gold/Ruby Gem) */}
      <rect x="28" y="28" width="3" height="3" fill="#F59E0B" />
      <rect x="29" y="29" width="2" height="2" fill="#EF4444" />

      {/* Sword 2: Top-Right to Bottom-Left (/) */}
      {/* Blade Tip */}
      <rect x="28" y="9" width="3" height="3" fill="#FFFFFF" />
      <rect x="25" y="10" width="3" height="3" fill="#F1F5F9" />
      <rect x="27" y="12" width="3" height="3" fill="#CBD5E1" />
      {/* Blade Mid */}
      <rect x="24" y="13" width="3" height="3" fill={`url(#${swordGrad2})`} />
      <rect x="21" y="14" width="3" height="3" fill="#F8FAFC" />
      <rect x="23" y="16" width="3" height="3" fill="#94A3B8" />
      {/* Blade Center Crossing */}
      <rect x="19" y="18" width="2" height="2" fill="#FFFFFF" />
      {/* Crossguard 2 (Gold/Amber) */}
      <rect x="15" y="19" width="3" height="3" fill="#F59E0B" />
      <rect x="15" y="17" width="2" height="3" fill="#FDE68A" />
      <rect x="18" y="22" width="3" height="3" fill="#D97706" />
      <rect x="20" y="23" width="3" height="2" fill="#B45309" />
      <rect x="16" y="21" width="3" height="3" fill="#FBBF24" />
      {/* Hilt / Handle 2 */}
      <rect x="13" y="24" width="3" height="3" fill="#92400E" />
      <rect x="11" y="26" width="3" height="3" fill="#78350F" />
      {/* Pommel 2 (Gold/Ruby Gem) */}
      <rect x="9" y="28" width="3" height="3" fill="#F59E0B" />
      <rect x="9" y="29" width="2" height="2" fill="#EF4444" />

      {/* Sparkle Glint at Center Cross */}
      <rect x="19" y="19" width="2" height="2" fill="#FFFFFF" />
      <rect x="20" y="18" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
      <rect x="20" y="20" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
      <rect x="18" y="19" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
      <rect x="21" y="19" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );

  // Pixel Text Component
  const renderText = () => (
    <span
      className={`inline-flex ${
        stackText ? 'flex-col items-start leading-none' : 'items-baseline leading-none'
      } select-none tracking-tight`}
      style={{
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        fontSize: `${config.textSize}px`,
        textRendering: 'geometricPrecision',
      }}
    >
      {/* "Quest" with clean RPG Slate/Dark Outline */}
      <span
        className="font-bold text-slate-900 transition-colors"
        style={{
          letterSpacing: '-0.5px',
          textShadow: '1px 1px 0px rgba(255,255,255,0.8), 0px 1px 1px rgba(15,23,42,0.15)',
        }}
      >
        Quest
      </span>

      {/* "Board" with Blue Brand Gradient Treatment */}
      <span
        className="font-bold text-blue-600 transition-colors"
        style={{
          letterSpacing: '-0.5px',
          textShadow: '1px 1px 0px rgba(255,255,255,0.8), 0px 1px 1px rgba(37,99,235,0.2)',
        }}
      >
        Board
      </span>
    </span>
  );

  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        title="QuestBoard"
      >
        {renderIcon(config.iconSize)}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div
        className={`inline-flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {renderText()}
      </div>
    );
  }

  // variant === 'full'
  return (
    <div
      className={`inline-flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ gap: `${config.gap}px` }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title="QuestBoard"
    >
      {renderIcon(config.iconSize)}
      {renderText()}
    </div>
  );
};

export default QuestBoardLogo;
