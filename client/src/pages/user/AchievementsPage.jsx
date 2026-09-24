import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../../services/api';

export function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [earnedCount, setEarnedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await api.get('/achievements');
        setAchievements(res.data || []);
        setEarnedCount(res.earnedCount || 0);
        setTotalCount(res.totalCount || 0);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <span>Trophy Room</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Unlock rare badges by reaching productivity milestones, solving algorithms, and maintaining streaks.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-bg-card border border-bg-border text-xs font-bold text-brand-accent">
          {earnedCount} of {totalCount} Badges Claimed
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const isEarned = ach.isEarned;

            return (
              <div
                key={ach._id}
                className={`p-6 rounded-2xl bg-bg-card border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isEarned
                    ? 'border-yellow-500/40 shadow-[0_0_25px_rgba(234,179,8,0.15)]'
                    : 'border-bg-border/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                        isEarned
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          : 'bg-bg-surface text-text-muted border border-bg-border'
                      }`}
                    >
                      {isEarned ? '🏆' : '🔒'}
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-bg-surface border border-bg-border text-text-secondary">
                      {ach.rarity}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1.5">{ach.name}</h3>
                  <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-bg-border/60 flex items-center justify-between text-xs">
                  <div className="font-semibold text-brand-accent">
                    +{ach.xpReward} XP / +{ach.coinReward} Coins
                  </div>

                  {isEarned ? (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-text-muted flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
