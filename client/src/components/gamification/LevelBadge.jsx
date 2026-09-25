import React from 'react';
import { Shield } from 'lucide-react';

export function LevelBadge({ level = 1, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-9 h-9 text-sm font-bold',
    lg: 'w-14 h-14 text-xl font-extrabold',
    xl: 'w-20 h-20 text-3xl font-black',
  };

  return (
    <div className="relative inline-flex items-center justify-center group">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white flex items-center justify-center shadow-sm shadow-blue-500/25 border border-white/30 transition-transform duration-300 group-hover:scale-105`}
      >
        <span>L{level}</span>
      </div>
    </div>
  );
}
