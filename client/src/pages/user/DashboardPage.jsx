import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { XPBar } from '../../components/gamification/XPBar';
import { StreakBadge } from '../../components/gamification/StreakBadge';
import { CoinCounter } from '../../components/gamification/CoinCounter';
import {
  Sword,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
  Code2,
  HelpCircle,
  Plus,
  Flame,
} from 'lucide-react';
import api from '../../services/api';

export function DashboardPage() {
  const { user, updateUserMetrics, triggerLevelUp } = useAuth();
  const [overview, setOverview] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [overviewRes, questsRes, recsRes, skillsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/quests?status=in_progress'),
          api.get('/quests/recommendations'),
          api.get('/skills'),
        ]);

        setOverview(overviewRes.data);
        setActiveQuests(questsRes.data || []);
        setRecommendations(recsRes.data || []);
        setSkills(skillsRes.data?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleQuickComplete = async (quest) => {
    if (quest.verificationType !== 'self') {
      return; // Redirect to specialized quiz/coding verification
    }

    setCompletingId(quest._id);
    try {
      const res = await api.post(`/quests/${quest._id}/complete`, {});
      setSuccessToast(`+${res.data.xpAwarded} XP & +${res.data.coinAwarded} Coins Earned!`);

      // Update user context metrics
      updateUserMetrics({
        totalXP: (user.totalXP || 0) + res.data.xpAwarded,
        coinBalance: (user.coinBalance || 0) + res.data.coinAwarded,
        currentStreak: res.data.streak?.currentStreak || user.currentStreak,
        progress: res.data.xpProgress,
      });

      // Trigger level-up modal if applicable
      if (res.data.levelUp) {
        triggerLevelUp(res.data.levelUp);
      }

      // Refresh active quests
      setActiveQuests((prev) => prev.filter((q) => q._id !== quest._id));

      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err.message || 'Could not complete quest.');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading Realm Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/90 text-white shadow-2xl backdrop-blur-md border border-emerald-400 font-bold text-sm animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-bg-card via-bg-surface to-bg-card border border-bg-border overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <LevelBadge level={user?.level || 1} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Hi, {user?.username}!
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-accent border border-brand-primary/30">
                  Level {user?.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Your character has accumulated{' '}
                <span className="text-white font-bold">{user?.totalXP?.toLocaleString()} XP</span>.
                Forge your destiny through today's challenges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link to="/quests" className="btn-primary text-xs sm:text-sm py-2.5">
              <Plus className="w-4 h-4" />
              <span>Create Quest</span>
            </Link>
          </div>
        </div>

        {/* Progress bar inside Hero */}
        <div className="mt-6 pt-6 border-t border-bg-border/60">
          <XPBar progress={user?.progress || {}} />
        </div>
      </div>

      {/* 4 Overview Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-bg-card border border-bg-border flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium mb-1">Quests Completed</div>
            <div className="text-2xl font-black text-white">
              {overview?.totalCompletedQuests || 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-bg-border flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium mb-1">Current Streak</div>
            <div className="text-2xl font-black text-amber-400">
              {user?.currentStreak || 0} Days
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-bg-border flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium mb-1">Weekly XP Earned</div>
            <div className="text-2xl font-black text-brand-accent">
              +{overview?.weeklyXP?.toLocaleString() || 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-primary/15 text-brand-accent flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-bg-border flex items-center justify-between">
          <div>
            <div className="text-xs text-text-muted font-medium mb-1">Coin Balance</div>
            <div className="text-2xl font-black text-yellow-400">
              {user?.coinBalance?.toLocaleString() || 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
            <span className="text-lg">🪙</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid: Left (Active Quests & Recommendations) | Right (Skills & Quick Hub) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Quests & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Quests Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-brand-accent" />
                <span>Active Quests</span>
                <span className="text-xs bg-bg-surface px-2 py-0.5 rounded-full text-text-secondary">
                  {activeQuests.length}
                </span>
              </h2>
              <Link to="/quests" className="text-xs text-brand-accent font-semibold hover:underline">
                View All Quests →
              </Link>
            </div>

            {activeQuests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-bg-card/50 border border-dashed border-bg-border text-center space-y-3">
                <p className="text-sm text-text-secondary">No active quests underway.</p>
                <Link to="/quests" className="btn-secondary text-xs inline-flex py-2 px-4">
                  Select a Quest from the Board
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuests.map((quest) => (
                  <div
                    key={quest._id}
                    className="quest-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
                        <span className="text-xs text-text-muted uppercase font-semibold">
                          {quest.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-white">{quest.title}</h3>
                      <p className="text-xs text-text-secondary line-clamp-1">{quest.description}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-bg-border">
                      <div className="text-right">
                        <div className="text-xs font-bold text-brand-accent">+{quest.xpReward} XP</div>
                        <div className="text-[11px] text-yellow-400">+{quest.coinReward} Coins</div>
                      </div>

                      {quest.verificationType === 'self' ? (
                        <button
                          onClick={() => handleQuickComplete(quest)}
                          disabled={completingId === quest._id}
                          className="btn-primary text-xs py-2 px-3 shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{completingId === quest._id ? 'Verifying...' : 'Complete'}</span>
                        </button>
                      ) : (
                        <Link
                          to={
                            quest.verificationType === 'quiz'
                              ? `/quizzes/${quest.quizId?._id || quest.quizId}`
                              : `/coding/${quest.codingChallengeId?._id || quest.codingChallengeId}`
                          }
                          className="btn-secondary text-xs py-2 px-3 shrink-0"
                        >
                          <span>{quest.verificationType === 'quiz' ? 'Take Quiz' : 'Code Solution'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personalized Recommendations Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Recommended for You</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.slice(0, 4).map((quest) => (
                <div key={quest._id} className="quest-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
                      <span className="text-xs font-bold text-brand-accent">+{quest.xpReward} XP</span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1 line-clamp-1">{quest.title}</h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4">{quest.description}</p>
                  </div>

                  <Link
                    to={`/quests/${quest._id}`}
                    className="text-xs font-semibold text-brand-accent hover:text-white flex items-center justify-between pt-2 border-t border-bg-border/60 transition-colors"
                  >
                    <span>Inspect Quest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Skill Mastery Snapshot & Quick Hub */}
        <div className="space-y-6">
          {/* Skills Progression Card */}
          <div className="p-5 rounded-2xl bg-bg-card border border-bg-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-bg-border">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-accent" />
                <span>Skill Mastery</span>
              </h3>
              <Link to="/skills" className="text-xs text-brand-accent hover:underline font-semibold">
                Tree →
              </Link>
            </div>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">{skill.name}</span>
                    <span className="text-brand-accent font-bold">
                      Lvl {skill.userProgress?.level || 1}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((skill.userProgress?.xp || 0) % 500) / 5)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Realms Hub */}
          <div className="p-5 rounded-2xl bg-bg-card border border-bg-border space-y-3">
            <h3 className="font-bold text-sm text-white mb-2">Adventure Portals</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/coding"
                className="p-3 rounded-xl bg-bg-surface hover:bg-bg-hover border border-bg-border text-center transition-colors group"
              >
                <Code2 className="w-5 h-5 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-text-primary block">Coding Academy</span>
              </Link>

              <Link
                to="/quizzes"
                className="p-3 rounded-xl bg-bg-surface hover:bg-bg-hover border border-bg-border text-center transition-colors group"
              >
                <HelpCircle className="w-5 h-5 text-brand-accent mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-text-primary block">Quiz Trials</span>
              </Link>

              <Link
                to="/rewards"
                className="p-3 rounded-xl bg-bg-surface hover:bg-bg-hover border border-bg-border text-center transition-colors group"
              >
                <span className="text-lg block mb-0.5 group-hover:scale-110 transition-transform">
                  🎁
                </span>
                <span className="text-xs font-semibold text-text-primary block">Reward Shop</span>
              </Link>

              <Link
                to="/leaderboard"
                className="p-3 rounded-xl bg-bg-surface hover:bg-bg-hover border border-bg-border text-center transition-colors group"
              >
                <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-text-primary block">Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
