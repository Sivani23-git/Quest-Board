import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Flame, Zap, Trophy, Shield } from 'lucide-react';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import api from '../../services/api';

export function LeaderboardPage() {
  const [period, setPeriod] = useState('all-time');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        const res = await api.get(`/leaderboard?period=${period}`);
        setLeaderboard(res.data || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-yellow-400" />
            <span>Realm Hall of Fame</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Top adventurers ranked by verified XP accumulation and daily consistency.
          </p>
        </div>

        {/* Period Switcher */}
        <div className="p-1 rounded-xl bg-bg-card border border-bg-border flex items-center gap-1">
          {['all-time', 'monthly', 'weekly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="rounded-2xl bg-bg-card border border-bg-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-bg-border bg-bg-surface/50 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Adventurer</th>
                  <th className="py-3 px-4 text-center">Level</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right">XP Bounty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border/60 text-xs sm:text-sm">
                {leaderboard.map((item) => {
                  let rankBadge = `${item.rank}`;
                  if (item.rank === 1) rankBadge = '🥇 1';
                  if (item.rank === 2) rankBadge = '🥈 2';
                  if (item.rank === 3) rankBadge = '🥉 3';

                  return (
                    <tr key={item.userId} className="hover:bg-bg-surface/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-text-secondary">{rankBadge}</td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/profile/${item.username}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
                            {item.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-brand-accent transition-colors">
                              @{item.username}
                            </span>
                            <span className="text-xs text-text-muted block line-clamp-1">
                              {item.bio}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-brand-accent">
                        Lvl {item.level}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                        {item.currentStreak || 0}d
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-brand-accent">
                        {item.xp?.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
