import React from 'react';
import { Flame } from 'lucide-react';

export function StreakBadge({ streak = 0, size = 'md' }) {
  const isZero = streak === 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
        isZero
          ? 'bg-bg-surface text-text-muted border-bg-border'
          : 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
      }`}
      title={`${streak} Day Streak`}
    >
      <Flame
        className={`w-4 h-4 ${
          isZero ? 'text-text-muted' : 'text-amber-400 fill-amber-400 animate-pulse-slow'
        }`}
      />
      <span className="font-bold text-sm">{streak}</span>
      <span className="text-xs text-text-secondary hidden sm:inline">Days</span>
    </div>
  );
}
