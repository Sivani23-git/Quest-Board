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
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="flex items-center gap-1 text-brand-accent">
            <Zap className="w-3.5 h-3.5 fill-brand-accent" />
            <span>Level {currentLevel} Progress</span>
          </span>
          <span className="text-text-secondary">
            {xpIntoCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP{' '}
            <span className="text-brand-accent font-semibold">({progressPercent}%)</span>
          </span>
        </div>
      )}

      <div className="w-full h-2.5 bg-bg-surface rounded-full overflow-hidden p-0.5 border border-bg-border shadow-inner">
        <div
          className="xp-bar-fill h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(3, Math.min(100, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
