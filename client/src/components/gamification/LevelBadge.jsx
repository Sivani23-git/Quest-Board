import React from 'react';
import { Shield } from 'lucide-react';

export function LevelBadge({ level = 1, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm font-bold',
    lg: 'w-14 h-14 text-xl font-extrabold',
    xl: 'w-20 h-20 text-3xl font-black',
  };

  return (
    <div className="relative inline-flex items-center justify-center group">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent text-white flex items-center justify-center shadow-lg shadow-brand-primary/30 border border-white/20 transition-transform duration-300 group-hover:scale-105`}
      >
        <span className="drop-shadow-md">L{level}</span>
      </div>
    </div>
  );
}
