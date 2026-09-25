import React from 'react';
import { PixelCoin } from '../pixel/PixelArt';

export function CoinCounter({ amount = 0 }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border-2 border-amber-200 shadow-xs"
      title="Virtual Gold Coins"
    >
      <PixelCoin className="w-4 h-4" />
      <span className="font-mono font-bold text-sm tracking-wide">{amount.toLocaleString()}</span>
    </div>
  );
}
