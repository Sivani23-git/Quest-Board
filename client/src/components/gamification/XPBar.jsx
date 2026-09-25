import React from 'react';
import { Zap } from 'lucide-react';

export function XPBar({ progress = {}, showLabel = true }) {
  const {
    currentLevel = 1,
    nextLevel = 2,
    totalXP = 0,
    xpIntoCurrentLevel = 0,
    xpNeededForNextLevel = 100,
    progressPercent = 0,
  } = progress;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
          <span className="flex items-center gap-1 text-amber-600">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Level {currentLevel} Progress</span>
          </span>
          <span className="text-slate-500">
            {xpIntoCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP{' '}
            <span className="text-amber-600 font-bold">({progressPercent}%)</span>
          </span>
        </div>
      )}

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="xp-bar-fill h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(3, Math.min(100, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
