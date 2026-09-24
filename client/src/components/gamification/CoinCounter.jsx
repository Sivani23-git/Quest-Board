import React from 'react';
import { Coins } from 'lucide-react';

export function CoinCounter({ amount = 0 }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
      title="Virtual Coins"
    >
      <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="font-bold text-sm tracking-wide">{amount.toLocaleString()}</span>
    </div>
  );
}
