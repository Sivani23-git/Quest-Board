import React, { useState, useEffect } from 'react';
import { Network, Lock, Unlock, Sparkles, Zap, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export function SkillTreePage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data || []);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleUnlockSkill = async (skillId) => {
    setUnlockingId(skillId);
    try {
      await api.post(`/skills/unlock/${skillId}`);
      fetchSkills();
    } catch (err) {
      alert(err.message || 'Could not unlock skill');
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Network className="w-7 h-7 text-brand-accent" />
          <span>Skill Tree & Progression</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Complete quests in specific domains to funnel 50% of XP into individual skill mastery levels.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const isUnlocked = skill.userProgress?.isUnlocked;
            const level = skill.userProgress?.level || 1;
            const currentXP = skill.userProgress?.xp || 0;

            return (
              <div
                key={skill._id}
                className={`p-6 rounded-2xl bg-bg-card border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-bg-border hover:border-brand-primary hover:shadow-[0_0_20px_rgba(108,99,255,0.2)]'
                    : 'border-bg-border/40 opacity-60 bg-bg-card/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border border-white/10"
                      style={{
                        backgroundColor: `${skill.color || '#6C63FF'}20`,
                        color: skill.color || '#6C63FF',
                      }}
                    >
                      {skill.name.charAt(0)}
                    </div>

                    {isUnlocked ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-accent border border-brand-primary/30">
                        Level {level} Master
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bg-surface text-text-muted border border-bg-border flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1.5">{skill.name}</h3>
                  <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-bg-border/60">
                  {isUnlocked ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Total Domain XP</span>
                        <span className="font-bold text-brand-accent">{currentXP} XP</span>
                      </div>
                      <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(10, (currentXP % 500) / 5))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockSkill(skill._id)}
                      disabled={unlockingId === skill._id}
                      className="w-full btn-secondary text-xs py-2.5 justify-center"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{unlockingId === skill._id ? 'Unlocking...' : 'Unlock Node'}</span>
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
