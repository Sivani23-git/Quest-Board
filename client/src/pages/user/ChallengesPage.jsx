import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Code2,
  BookOpen,
  Flame,
  Sparkles,
  Compass,
  Trophy,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Target,
  HelpCircle,
  Lock,
  Calendar,
  Award,
  Users,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORY_STYLES = {
  quests: {
    name: 'Quests',
    badge: 'bg-purple-100/70 text-purple-700 border-purple-200/80',
    icon: Zap,
    iconColor: 'text-purple-600',
    progressGradient: 'from-purple-600 via-indigo-600 to-purple-500',
    borderHover: 'hover:border-purple-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(168,85,247,0.22)]',
    ambientGlow: 'bg-purple-500/10',
    route: '/quests',
    actionLabel: 'Complete Quests',
  },
  coding: {
    name: 'Coding',
    badge: 'bg-sky-100/70 text-sky-700 border-sky-200/80',
    icon: Code2,
    iconColor: 'text-sky-600',
    progressGradient: 'from-sky-500 via-blue-500 to-cyan-500',
    borderHover: 'hover:border-sky-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(56,189,248,0.22)]',
    ambientGlow: 'bg-sky-500/10',
    route: '/coding',
    actionLabel: 'Solve Challenges',
  },
  quizzes: {
    name: 'Quizzes',
    badge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/80',
    icon: BookOpen,
    iconColor: 'text-emerald-600',
    progressGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    borderHover: 'hover:border-emerald-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(16,185,129,0.22)]',
    ambientGlow: 'bg-emerald-500/10',
    route: '/quizzes',
    actionLabel: 'Take Quizzes',
  },
  streak: {
    name: 'Streak',
    badge: 'bg-orange-100/70 text-orange-700 border-orange-200/80',
    icon: Flame,
    iconColor: 'text-orange-600',
    progressGradient: 'from-orange-500 via-rose-500 to-red-500',
    borderHover: 'hover:border-orange-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(249,115,22,0.22)]',
    ambientGlow: 'bg-orange-500/10',
    route: '/quests',
    actionLabel: 'Maintain Streak',
  },
  xp: {
    name: 'XP',
    badge: 'bg-amber-100/70 text-amber-800 border-amber-300/80',
    icon: Sparkles,
    iconColor: 'text-amber-600',
    progressGradient: 'from-amber-500 via-yellow-500 to-amber-600',
    borderHover: 'hover:border-amber-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.22)]',
    ambientGlow: 'bg-amber-500/10',
    route: '/quests',
    actionLabel: 'Earn XP',
  },
  exploration: {
    name: 'Exploration',
    badge: 'bg-pink-100/70 text-pink-700 border-pink-200/80',
    icon: Compass,
    iconColor: 'text-pink-600',
    progressGradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
    borderHover: 'hover:border-pink-400/80',
    glowHover: 'hover:shadow-[0_20px_45px_-10px_rgba(236,72,153,0.22)]',
    ambientGlow: 'bg-pink-500/10',
    route: '/quests',
    actionLabel: 'Explore Quests',
  },
};

function getCategoryConfig(categoryStr = '') {
  const cat = (categoryStr || 'quests').toLowerCase().trim();
  if (cat.includes('cod')) return CATEGORY_STYLES.coding;
  if (cat.includes('quiz')) return CATEGORY_STYLES.quizzes;
  if (cat.includes('streak')) return CATEGORY_STYLES.streak;
  if (cat.includes('xp')) return CATEGORY_STYLES.xp;
  if (cat.includes('explor')) return CATEGORY_STYLES.exploration;
  return CATEGORY_STYLES.quests;
}

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
      await fetchChallenges();
    } catch (err) {
      alert(err.message || 'Could not join challenge');
    } finally {
      setJoiningId(null);
    }
  };

  const formatRemainingTime = (endDate) => {
    if (!endDate) return 'Limited Time';
    const diff = new Date(endDate).getTime() - new Date().getTime();
    if (diff <= 0) return 'Ending soon';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  const formatStartsIn = (startDate) => {
    if (!startDate) return 'Coming Soon';
    const diff = new Date(startDate).getTime() - new Date().getTime();
    if (diff <= 0) return 'Starting Soon';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `Starts in ${days}d ${hours}h`;
    if (hours > 0) return `Starts in ${hours}h`;
    return 'Starting Soon';
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-medium">Loading Community Challenges...</p>
      </div>
    );
  }

  // Segment challenges into Active, Upcoming, and Completed
  const activeChallenges = challenges.filter((c) => !c.isUpcoming && !c.isExpired);
  const upcomingChallenges = challenges.filter((c) => c.isUpcoming);
  const completedChallenges = challenges.filter((c) => c.isCompleted);

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* 1. HERO SECTION */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50/80 via-blue-50/60 to-indigo-50/70 border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-xs font-bold text-purple-700 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span>LIVE COMMUNITY EVENT HUB</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span>Community Challenges</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Take on limited-time community quests and earn bonus XP, coins, and rare rewards. Compete alongside fellow questors in live sprints across coding, quizzes, and quests.
            </p>
          </div>

          <div className="shrink-0 bg-white/95 backdrop-blur-md border border-purple-200/80 rounded-2xl p-4 shadow-sm space-y-2 min-w-[210px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Hub</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {activeChallenges.length} Active Sprints
              </span>
            </div>
            <div className="text-sm font-black text-slate-900">
              Weekly Challenge Arena
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Refreshes Weekly</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE CHALLENGES SECTION */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600 fill-purple-600" />
              <span>Active Sprints</span>
            </h2>
            <p className="text-xs text-slate-500">
              Join active community events, track your real-time progress, and claim milestone rewards.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            {activeChallenges.length} Ongoing
          </span>
        </div>

        {activeChallenges.length === 0 ? (
          <div className="p-8 text-center bg-white/70 backdrop-blur-md rounded-[18px] border border-white/80 shadow-sm space-y-2">
            <Zap className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-800">No active challenges at the moment</div>
            <p className="text-xs text-slate-500">Check upcoming events below to see what is starting soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeChallenges.map((challenge) => {
              const catConfig = getCategoryConfig(challenge.category);
              const IconComponent = catConfig.icon;
              const target = challenge.requirement?.target || 1;
              const progress = challenge.currentProgress || 0;
              const percent = Math.min(100, Math.round((progress / target) * 100));

              return (
                <div
                  key={challenge._id}
                  className={`group relative rounded-[18px] bg-white/65 backdrop-blur-md border border-white/85 shadow-[12px_17px_51px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${catConfig.borderHover} ${catConfig.glowHover}`}
                >
                  {/* Category Ambient Glow Blob */}
                  <div
                    className={`absolute -top-10 -right-10 w-36 h-36 rounded-full ${catConfig.ambientGlow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                  />

                  {/* Top Category Badge & Time Remaining */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 backdrop-blur-xs transition-colors duration-300 ${catConfig.badge}`}>
                        <IconComponent className="w-3 h-3" />
                        <span>{challenge.category || catConfig.name}</span>
                      </span>

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatRemainingTime(challenge.endDate)}</span>
                      </div>
                    </div>

                    {/* Challenge Header & Title */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-slate-950 transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>

                    {/* Rewards Badges */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50/90 px-2 py-0.5 rounded-md border border-amber-200/90 shadow-xs">
                        +{challenge.xpReward} XP
                      </span>
                      <span className="text-xs font-bold text-yellow-700 bg-yellow-50/90 px-2 py-0.5 rounded-md border border-yellow-200/90 shadow-xs">
                        +{challenge.coinReward} Coins
                      </span>
                      {challenge.badgeName && (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50/90 px-2 py-0.5 rounded-md border border-purple-200/90 flex items-center gap-1 shadow-xs truncate">
                          <Trophy className="w-3 h-3 text-purple-600" />
                          <span className="truncate">{challenge.badgeName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress & Interactive Action Area */}
                  <div className="relative z-10 space-y-3 pt-3 border-t border-slate-100/90">
                    {/* Progress Bar (Real Data) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Target className="w-3 h-3 text-slate-400" />
                          <span>Progress</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {challenge.isJoined ? (
                            <span>{progress} / {target} ({percent}%)</span>
                          ) : (
                            <span className="text-slate-400 font-medium">Goal: {target}</span>
                          )}
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100/90 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${catConfig.progressGradient}`}
                          style={{ width: `${challenge.isJoined ? percent : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      {challenge.isCompleted ? (
                        <div className="w-full py-2 px-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>✓ Sprint Completed</span>
                        </div>
                      ) : challenge.isJoined ? (
                        <Link
                          to={catConfig.route}
                          className="w-full btn-primary text-xs py-2 px-3 font-bold flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>{catConfig.actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleJoin(challenge._id)}
                          disabled={joiningId === challenge._id}
                          className="w-full btn-secondary hover:bg-white text-xs py-2 px-3 font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Zap className="w-3.5 h-3.5 text-purple-600" />
                          <span>{joiningId === challenge._id ? 'Joining...' : 'Join Challenge →'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. UPCOMING CHALLENGES SECTION */}
      {upcomingChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Upcoming Challenges</span>
              </h2>
              <p className="text-xs text-slate-500">
                Preview upcoming community events and prepare your strategies in advance.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Coming Soon
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingChallenges.map((challenge) => {
              const catConfig = getCategoryConfig(challenge.category);
              const IconComponent = catConfig.icon;

              return (
                <div
                  key={challenge._id}
                  className={`group relative rounded-[18px] bg-white/50 backdrop-blur-md border border-white/80 shadow-[12px_17px_51px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.02)] p-5 space-y-4 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/70 overflow-hidden ${catConfig.borderHover}`}
                >
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${catConfig.ambientGlow} blur-2xl pointer-events-none opacity-50`}
                  />

                  <div className="relative z-10 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${catConfig.badge}`}>
                        <IconComponent className="w-3 h-3" />
                        <span>{challenge.category || catConfig.name}</span>
                      </span>

                      <span className="text-xs text-blue-700 font-bold bg-blue-50/90 px-2 py-0.5 rounded-md border border-blue-200/80">
                        {formatStartsIn(challenge.startDate)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600">
                        +{challenge.xpReward} XP
                      </span>
                      <span className="text-xs font-bold text-yellow-700">
                        +{challenge.coinReward} Coins
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. COMPLETED CHALLENGES (If Any) */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Your Completed Sprints</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {completedChallenges.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChallenges.map((challenge) => (
              <div
                key={challenge._id}
                className="p-4 rounded-[18px] bg-emerald-50/40 backdrop-blur-md border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-800">{challenge.title}</div>
                  <div className="text-[11px] text-slate-500">
                    +{challenge.xpReward} XP • +{challenge.coinReward} Coins Earned
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. "HOW IT WORKS" SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>How Community Challenges Work</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Community events bring together quests, coding challenges, and quizzes with bonus reward multipliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/60 space-y-2 relative shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md">
                01 — JOIN
              </span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Choose a Challenge</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select any active community challenge above to register your sprint participation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/60 space-y-2 relative shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                02 — COMPLETE
              </span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Complete Activities</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete the required verified quests, coding solutions, or quizzes before reset.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/60 space-y-2 relative shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                03 — EARN
              </span>
              <Trophy className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Claim Rewards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive bonus XP, coins, and community badges automatically upon reaching the goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
