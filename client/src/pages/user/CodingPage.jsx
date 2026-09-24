import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, CheckCircle2, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import api from '../../services/api';

export function CodingPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenges() {
      try {
        const res = await api.get('/coding');
        setChallenges(res.data || []);
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Code2 className="w-7 h-7 text-amber-400" />
          <span>Coding Arena & Sandbox</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Solve algorithmic programming challenges executed in an isolated runtime sandbox.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge._id} className="quest-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge-${challenge.difficulty}`}>{challenge.difficulty}</span>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {challenge.category}
                    </span>
                  </div>

                  {challenge.isSolved && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solved</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="pt-4 border-t border-bg-border/60 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-brand-accent">+{challenge.xpReward} XP</span>
                  <span className="text-yellow-400 font-semibold ml-2">
                    +{challenge.coinReward} Coins
                  </span>
                </div>

                <Link
                  to={`/coding/${challenge._id}`}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{challenge.isSolved ? 'Solve Again' : 'Enter Sandbox'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
