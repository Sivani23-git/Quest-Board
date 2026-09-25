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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-500" />
            <span>Realm Hall of Fame</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Top adventurers ranked by verified XP accumulation and daily consistency.
          </p>
        </div>

        {/* Period Switcher */}
        <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1">
          {['all-time', 'monthly', 'weekly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Adventurer</th>
                  <th className="py-3 px-4 text-center">Level</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right">XP Bounty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {leaderboard.map((item) => {
                  let rankBadge = `${item.rank}`;
                  if (item.rank === 1) rankBadge = '🥇 1';
                  if (item.rank === 2) rankBadge = '🥈 2';
                  if (item.rank === 3) rankBadge = '🥉 3';

                  return (
                    <tr key={item.userId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-700">{rankBadge}</td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/profile/${item.username}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
                            {item.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              @{item.username}
                            </span>
                            <span className="text-xs text-slate-400 block line-clamp-1">
                              {item.bio}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                        Lvl {item.level}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-orange-500">
                        {item.currentStreak || 0}d
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-amber-600">
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
