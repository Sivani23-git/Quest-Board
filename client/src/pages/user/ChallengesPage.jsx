import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/challenges');
      setChallenges(res.data || []);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (id) => {
    setJoiningId(id);
    try {
      await api.post(`/challenges/${id}/join`);
      fetchChallenges();
    } catch (err) {
      alert(err.message || 'Could not join challenge');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-purple-400" />
          <span>Community Challenges</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Participate in limited-time community sprints to earn massive bonus XP and rare badges.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const target = challenge.requirement?.target || 5;
            const progress = challenge.currentProgress || 0;
            const percent = Math.min(100, Math.round((progress / target) * 100));

            return (
              <div key={challenge._id} className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2 inline-block">
                      Active Sprint
                    </span>
                    <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-brand-accent">+{challenge.xpReward} XP</div>
                    <div className="text-[11px] text-yellow-400">+{challenge.coinReward} Coins</div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{challenge.description}</p>

                {challenge.isJoined && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Sprint Progress</span>
                      <span className="font-bold text-purple-400">
                        {progress} / {target} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-primary to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-bg-border/60 flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>Active Community Event</span>
                  </span>

                  {challenge.isCompleted ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed!</span>
                    </span>
                  ) : challenge.isJoined ? (
                    <span className="text-xs font-semibold text-brand-accent bg-brand-primary/10 px-3 py-1.5 rounded-xl">
                      Participating
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoin(challenge._id)}
                      disabled={joiningId === challenge._id}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      {joiningId === challenge._id ? 'Joining...' : 'Join Challenge'}
                    </button>
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
