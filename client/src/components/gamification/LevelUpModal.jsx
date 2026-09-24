import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, X, ArrowRight } from 'lucide-react';
import { LevelBadge } from './LevelBadge';

export function LevelUpModal({ levelData, onClose }) {
  useEffect(() => {
    if (levelData) {
      // Fire festive celebration confetti bursts
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C63FF', '#00D4FF', '#F59E0B', '#22D3A0'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [levelData]);

  if (!levelData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-8 text-center bg-bg-card border-2 border-brand-primary/50 rounded-2xl shadow-[0_0_50px_rgba(108,99,255,0.4)] overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-primary/30 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white p-1 rounded-lg hover:bg-bg-hover transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 mb-4 rounded-2xl bg-brand-primary/20 text-brand-accent border border-brand-primary/30 animate-bounce">
          <Crown className="w-10 h-10 text-yellow-400" />
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center justify-center gap-2">
          <span>LEVEL UP!</span>
          <Sparkles className="w-6 h-6 text-brand-accent animate-spin" />
        </h2>

        <p className="text-text-secondary text-sm mb-6">
          Your unwavering dedication has elevated your rank in the realm of QuestBoard.
        </p>

        <div className="flex items-center justify-center gap-6 my-6 p-4 rounded-xl bg-bg-surface/80 border border-bg-border">
          <div className="text-center">
            <div className="text-xs text-text-muted mb-1">Previous</div>
            <LevelBadge level={levelData.previousLevel} size="md" />
          </div>

          <ArrowRight className="w-6 h-6 text-brand-accent animate-pulse" />

          <div className="text-center">
            <div className="text-xs text-brand-accent font-semibold mb-1">New Rank</div>
            <LevelBadge level={levelData.newLevel} size="lg" />
          </div>
        </div>

        <button onClick={onClose} className="w-full btn-primary py-3 text-base font-semibold">
          Claim Glory & Continue
        </button>
      </div>
    </div>
  );
}
