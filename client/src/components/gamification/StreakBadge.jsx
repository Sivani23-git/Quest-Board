import React from 'react';
import { PixelFlame } from '../pixel/PixelArt';

export function StreakBadge({ streak = 0 }) {
  const isZero = streak === 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 transition-all ${
        isZero
          ? 'bg-slate-50 text-slate-400 border-slate-200'
          : 'bg-orange-50 text-orange-700 border-orange-200 shadow-xs'
      }`}
      title={`${streak} Day Streak`}
    >
      <PixelFlame className={`w-4 h-4 ${isZero ? 'opacity-40 grayscale' : 'animate-pulse-slow'}`} />
      <span className="font-mono font-bold text-sm">{streak}</span>
      <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Days</span>
    </div>
  );
}
