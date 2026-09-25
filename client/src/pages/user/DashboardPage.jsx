import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { XPBar } from '../../components/gamification/XPBar';
import {
  PixelAdventurer,
  PixelCloud,
  PixelFloatingIsland,
  PixelCastle,
  PixelMountain,
  PixelHills,
  PixelTree,
  PixelSignpost,
  PixelMushroom,
  PixelCrystal,
  PixelCottage,
  PixelGrass,
  PixelFlower,
  PixelStar,
  PixelScroll,
  PixelFlame,
  PixelGem,
  PixelCoin,
  PixelChest,
  PixelRock,
  PixelTower,
  PixelBush,
  PixelPath,
} from '../../components/pixel/PixelArt';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
  Code2,
  Plus,
  Flame,
  Zap,
  Coins,
  Gift,
  Compass,
  Lock,
  Terminal,
} from 'lucide-react';
import api from '../../services/api';

const LANGUAGE_META = {
  python: { name: 'Python', icon: '🐍', tag: 'Python Fundamentals' },
  javascript: { name: 'JavaScript', icon: '🟨', tag: 'JavaScript Web Core' },
  java: { name: 'Java', icon: '☕', tag: 'Java OOP Foundations' },
  cpp: { name: 'C++', icon: '⚡', tag: 'C++ Systems & STL' },
};

export function DashboardPage() {
  const { user, updateUserMetrics, triggerLevelUp } = useAuth();
  const [overview, setOverview] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [codingLanguages, setCodingLanguages] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          overviewRes,
          questsRes,
          skillsRes,
          codingRes,
          challengesRes,
          achievementsRes,
          rewardsRes,
        ] = await Promise.allSettled([
          api.get('/analytics/overview'),
          api.get('/quests?status=in_progress'),
          api.get('/skills'),
          api.get('/coding/languages'),
          api.get('/challenges'),
          api.get('/achievements'),
          api.get('/rewards'),
        ]);

        if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value.data);
        if (questsRes.status === 'fulfilled') setActiveQuests(questsRes.value.data || []);
        if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value.data?.slice(0, 4) || []);
        if (codingRes.status === 'fulfilled') setCodingLanguages(codingRes.value.data || []);
        if (challengesRes.status === 'fulfilled') setChallenges(challengesRes.value.data || []);
        if (achievementsRes.status === 'fulfilled') setAchievements(achievementsRes.value.data || []);
        if (rewardsRes.status === 'fulfilled') setRewards(rewardsRes.value.data || []);
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
      return;
    }

    setCompletingId(quest._id);
    try {
      const res = await api.post(`/quests/${quest._id}/complete`, {});
      setSuccessToast(`+${res.data.xpAwarded} XP & +${res.data.coinAwarded} Coins Earned!`);

      updateUserMetrics({
        totalXP: (user.totalXP || 0) + res.data.xpAwarded,
        coinBalance: (user.coinBalance || 0) + res.data.coinAwarded,
        currentStreak: res.data.streak?.currentStreak || user.currentStreak,
        progress: res.data.xpProgress,
      });

      if (res.data.levelUp) {
        triggerLevelUp(res.data.levelUp);
      }

      setActiveQuests((prev) => prev.filter((q) => q._id !== quest._id));
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err.message || 'Could not complete quest.');
    } finally {
      setCompletingId(null);
    }
  };

  // Identify active / most engaged coding language
  const activeLang =
    codingLanguages.find((l) => l.userProgress?.isStarted) ||
    codingLanguages[0] ||
    null;

  // Identify featured daily challenge or fallback to active challenge
  const todayChallenge = challenges.find((c) => !c.isCompleted) || challenges[0] || null;

  // Filter earned achievements
  const earnedAchievements = achievements.filter((a) => a.isEarned);
  const recentAchievements = earnedAchievements.length > 0
    ? earnedAchievements.slice(0, 3)
    : achievements.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">LOADING REALM DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* FULL-WIDTH CONTINUOUS PIXEL-ART RPG WORLD BACKGROUND LAYER                 */}
      {/* ========================================================================= */}
      <div
        className="fixed top-16 left-0 lg:left-64 right-0 bottom-0 pointer-events-none overflow-hidden select-none z-0"
        style={{
          background:
            'linear-gradient(180deg, #E0F2FE 0%, #E8F5FE 15%, #EDFAF5 35%, #F0FDF4 65%, #FEFCE8 90%, #FEF9C3 100%)',
        }}
      >
        {/* 1. TOP SKY REALM (0% - 25%) */}
        <PixelCloud className="absolute top-4 left-8 w-32 h-16 opacity-85" />
        <PixelCloud className="absolute top-10 right-20 w-36 h-18 opacity-80 hidden sm:block" />
        <PixelCloud className="absolute top-24 left-1/4 w-24 h-12 opacity-65 hidden md:block" />
        <PixelFloatingIsland className="absolute top-6 right-72 w-36 h-28 opacity-70 hidden lg:block" />
        <PixelCastle className="absolute top-8 right-12 w-24 h-28 opacity-60 hidden xl:block" />
        <PixelStar className="absolute top-4 left-12 w-4 h-4 animate-pulse" color="#FACC15" />
        <PixelStar className="absolute top-8 right-1/4 w-4 h-4 animate-pulse-slow" color="#38BDF8" />
        <PixelStar className="absolute top-20 right-8 w-4 h-4" color="#F472B6" />

        {/* 2. UPPER-MID MOUNTAINS & ROLLING HILLS (25% - 55%) */}
        <PixelHills className="absolute top-[28%] left-0 right-0 w-full h-28 opacity-35" />
        <PixelMountain className="absolute top-[24%] -left-8 w-64 h-40 opacity-30 hidden md:block" />
        <PixelMountain className="absolute top-[28%] -right-8 w-72 h-44 opacity-30 hidden md:block" />
        <PixelTower className="absolute top-[32%] right-16 w-10 h-16 opacity-50 hidden lg:block" />
        <PixelTree variant="pine" className="absolute top-[34%] left-4 w-12 h-20 opacity-75 hidden xl:block" />
        <PixelTree variant="oak" className="absolute top-[40%] right-4 w-14 h-20 opacity-75 hidden xl:block" />
        <PixelRock className="absolute top-[38%] left-16 w-5 h-4 opacity-60 hidden sm:block" />
        <PixelRock className="absolute top-[44%] right-20 w-6 h-5 opacity-60 hidden sm:block" />
        <PixelStar className="absolute top-[36%] left-1/3 w-4 h-4 animate-pulse" color="#A78BFA" />
        <PixelStar className="absolute top-[46%] right-1/3 w-4 h-4 animate-pulse-slow" color="#FACC15" />

        {/* 3. LOWER ENCHANTED FOREST & VILLAGE REALM (55% - 100%) */}
        <PixelPath className="absolute top-[60%] left-0 right-0 w-full h-16 opacity-30 hidden md:block" />
        <PixelHills className="absolute top-[68%] left-0 right-0 w-full h-28 opacity-40" />
        <PixelSignpost className="absolute top-[58%] left-6 w-10 h-14 opacity-80 hidden xl:block" />
        <PixelMushroom className="absolute top-[66%] left-8 w-6 h-6 opacity-85 hidden xl:block" />
        <PixelCrystal className="absolute top-[62%] right-8 w-6 h-8 opacity-85 hidden xl:block" color="#38BDF8" />
        <PixelBush className="absolute top-[70%] right-20 w-10 h-6 opacity-75 hidden md:block" />
        <PixelTree variant="oak" className="absolute top-[74%] left-4 w-14 h-20 opacity-75 hidden xl:block" />
        <PixelTree variant="pine" className="absolute top-[78%] right-4 w-12 h-20 opacity-70 hidden xl:block" />
        <PixelCottage className="absolute top-[80%] -right-2 w-20 h-20 opacity-65 hidden xl:block" />
        <PixelChest className="absolute bottom-10 right-14 w-7 h-7 opacity-75 hidden lg:block" />
        <PixelRock className="absolute bottom-8 left-6 w-6 h-5 opacity-70 hidden sm:block" />
        <PixelGrass className="absolute bottom-6 left-12 w-10 h-6 opacity-85 hidden sm:block" />
        <PixelGrass className="absolute bottom-6 right-24 w-10 h-6 opacity-85 hidden sm:block" />
        <PixelFlower className="absolute bottom-7 left-24 w-4 h-4 opacity-90 hidden sm:block" color="#F472B6" />
        <PixelFlower className="absolute bottom-7 right-36 w-4 h-4 opacity-90 hidden sm:block" color="#FBBF24" />
        <PixelStar className="absolute bottom-16 left-1/4 w-4 h-4 animate-pulse" color="#F472B6" />
        <PixelStar className="absolute bottom-20 right-1/4 w-4 h-4 animate-pulse-slow" color="#38BDF8" />

        {/* BOTTOM PIXEL GROUND CONTOUR */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-emerald-400/60 via-green-400/50 to-teal-400/60 border-t-2 border-emerald-500/50" />
      </div>

      {/* ========================================================================= */}
      {/* CENTERED DASHBOARD UI CONTENT LAYER                                        */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">

      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl border-2 border-emerald-400 font-bold text-sm animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PIXEL RPG HERO / ADVENTURE HEADER                                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <LevelBadge level={user?.level || 1} size="lg" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Hi, {user?.username}!
                </h1>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 shadow-xs uppercase tracking-wider">
                  LEVEL {user?.level || 1} ADVENTURER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1.5 max-w-xl leading-relaxed">
                Your character has accumulated{' '}
                <span className="text-blue-700 font-black">{user?.totalXP?.toLocaleString() || 0} XP</span>.
                Forge your destiny through today's challenges.
              </p>
            </div>
          </div>

          {/* Right Hero Cluster: Pixel Mascot + Create Quest CTA */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="hidden sm:block hover:scale-105 transition-transform duration-200 cursor-pointer" title="Your RPG Hero">
              <PixelAdventurer className="w-16 h-20" />
            </div>

            <Link
              to="/quests"
              className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quest</span>
            </Link>
          </div>
        </div>

        {/* RPG Progression Bar */}
        <div className="mt-6 pt-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold font-mono">
              <span className="flex items-center gap-1.5 text-blue-700 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                <span>LEVEL {user?.level || 1} PROGRESS</span>
              </span>
              <span className="text-slate-600">
                {(user?.progress?.xpIntoCurrentLevel || 0).toLocaleString()} / {(user?.progress?.xpNeededForNextLevel || 100).toLocaleString()} XP{' '}
                <span className="text-blue-600 font-black">({user?.progress?.progressPercent || 0}%)</span>
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${Math.max(3, Math.min(100, user?.progress?.progressPercent || 0))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RPG STAT HUD (4 CARDS)                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* [ COMPLETED ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-emerald-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
              [ COMPLETED ]
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {overview?.totalCompletedQuests || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Quests Verified</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelScroll className="w-8 h-8" />
          </div>
        </div>

        {/* [ STREAK ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-orange-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-orange-700 uppercase tracking-wider mb-1">
              [ STREAK ]
            </div>
            <div className="text-2xl font-black text-orange-600">
              {user?.currentStreak || 0} Days
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Active Flame</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelFlame className="w-8 h-8" />
          </div>
        </div>

        {/* [ WEEKLY XP ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-purple-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-wider mb-1">
              [ WEEKLY XP ]
            </div>
            <div className="text-2xl font-black text-purple-600">
              +{overview?.weeklyXP?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Exp Gained</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelGem className="w-8 h-8" />
          </div>
        </div>

        {/* [ COIN VAULT ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-amber-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider mb-1">
              [ COIN VAULT ]
            </div>
            <div className="text-2xl font-black text-amber-500">
              {user?.coinBalance?.toLocaleString() || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Gold Coins</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelCoin className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 & 4. MAIN 2-COLUMN SECTION: ACTIVE QUESTS (LEFT) + SKILL MASTERY (RIGHT)*/}
      {/* ========================================================================= */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: ACTIVE QUESTS (MAIN FOCUS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>⚔️</span>
                <span>ACTIVE QUESTS</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-200 font-mono">
                  {activeQuests.length} ACTIVE
                </span>
              </h2>
              <Link to="/quests" className="text-xs text-blue-600 font-bold hover:underline font-mono">
                VIEW ALL →
              </Link>
            </div>

            {activeQuests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50/70 border-2 border-dashed border-blue-200 text-center space-y-3 shadow-xs">
                <div className="text-4xl">🗺️</div>
                <h3 className="font-bold text-slate-900 text-base">Your quest board is empty!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Pick an adventure and start earning XP.
                </p>
                <div className="pt-2">
                  <Link to="/quests" className="btn-primary text-xs inline-flex py-2 px-4 shadow-sm">
                    <span>Browse Quests →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuests.map((quest) => (
                  <div
                    key={quest._id}
                    className="quest-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border-2 border-slate-200/80 hover:border-blue-300 transition-all shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
                        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider font-mono">
                          {quest.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                        <span>⚔️</span>
                        <span>{quest.title}</span>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{quest.description}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-600 font-mono">+{quest.xpReward} XP</div>
                        <div className="text-[11px] font-semibold text-amber-500 font-mono flex items-center gap-0.5 justify-end">
                          <span>🪙</span>
                          <span>{quest.coinReward}</span>
                        </div>
                      </div>

                      {quest.verificationType === 'self' ? (
                        <button
                          onClick={() => handleQuickComplete(quest)}
                          disabled={completingId === quest._id}
                          className="btn-primary text-xs py-2 px-4 shrink-0 shadow-xs"
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
                          className="btn-secondary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5 shadow-xs"
                        >
                          <span>{quest.verificationType === 'quiz' ? 'Take Quiz' : 'Continue'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 1 COL: SKILL MASTERY */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <span>🌳</span>
                <span>SKILL MASTERY</span>
              </h3>
              <Link to="/skills" className="text-xs text-blue-600 hover:underline font-bold font-mono">
                [TREE →]
              </Link>
            </div>

            {skills.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-500">No skill proficiencies tracked yet.</p>
                <Link to="/skills" className="text-xs text-blue-600 font-bold hover:underline">
                  Explore Skill Tree →
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {skills.map((skill, idx) => {
                  const gradients = [
                    'from-amber-400 to-orange-500',
                    'from-teal-400 to-emerald-500',
                    'from-blue-500 to-indigo-600',
                    'from-pink-500 to-purple-600',
                  ];
                  const gradient = gradients[idx % gradients.length];
                  const level = skill.userProgress?.level || 1;
                  const percent = Math.min(100, Math.max(15, ((skill.userProgress?.xp || 0) % 500) / 5));

                  return (
                    <div key={skill._id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{skill.name}</span>
                        <span className="text-blue-700 font-black font-mono px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[11px]">
                          LVL {level}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                        <div
                          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 shadow-xs`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CONTINUE YOUR JOURNEY (CODING ACADEMY INTEGRATION)                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">CONTINUE YOUR JOURNEY</h2>
          </div>
          <Link to="/coding" className="text-xs text-blue-600 font-bold hover:underline font-mono">
            CODING ACADEMY →
          </Link>
        </div>

        {activeLang ? (
          <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-slate-50/90 border-2 border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{LANGUAGE_META[activeLang.id]?.icon || activeLang.icon || '💻'}</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {LANGUAGE_META[activeLang.id]?.name || activeLang.name} Learning Path
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                  Stage {activeLang.userProgress?.currentStage || 1} — {LANGUAGE_META[activeLang.id]?.tag || `${activeLang.name} Fundamentals`}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {activeLang.userProgress?.completedCount || 0} / {activeLang.totalChallenges || 32} challenges completed
              </p>

              {/* Progress Bar */}
              <div className="pt-1 w-full max-w-md">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mb-1">
                  <span>PATH PROGRESS</span>
                  <span className="text-blue-600 font-black">{activeLang.userProgress?.progressPercent || 0}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${Math.max(5, Math.min(100, activeLang.userProgress?.progressPercent || 0))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
              <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-mono">
                +75 Language XP available
              </div>

              <Link
                to={`/coding?lang=${activeLang.id}`}
                className="btn-primary text-xs py-2.5 px-5 shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">Choose a language and begin your coding journey.</p>
            <Link to="/coding" className="btn-primary text-xs py-2 px-5 inline-flex">
              Explore Coding Academy →
            </Link>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6 & 7. TWO-COLUMN SECTION: TODAY'S CHALLENGE (LEFT) + RECENT ACHIEVEMENTS (RIGHT)*/}
      {/* ========================================================================= */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8">
        {/* LEFT: TODAY'S CHALLENGE */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>✨</span>
                <span>TODAY'S CHALLENGE</span>
              </h2>
              <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                DAILY SPRINT
              </span>
            </div>

            {todayChallenge ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{todayChallenge.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {todayChallenge.description || 'Complete one coding challenge today to keep your daily momentum alive.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Keep your streak alive</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono font-bold">
                    <span className="text-purple-600">⚡ +{todayChallenge.xpReward || 50} XP</span>
                    <span className="text-amber-500">🪙 +{todayChallenge.coinReward || 10} Coins</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">Complete one coding challenge today.</h3>
                <div className="flex items-center gap-3 text-xs font-mono font-bold">
                  <span className="text-orange-600">🔥 Keep your streak alive</span>
                  <span className="text-purple-600">⚡ +50 XP</span>
                  <span className="text-amber-500">🪙 +10 Coins</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to={todayChallenge ? '/challenges' : '/coding'}
              className="btn-primary w-full text-xs py-2.5 text-center justify-center inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT: RECENT ACHIEVEMENTS */}
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>🏆</span>
                <span>RECENT ACHIEVEMENTS</span>
              </h2>
              <Link to="/achievements" className="text-xs text-blue-600 hover:underline font-bold font-mono">
                VIEW ALL →
              </Link>
            </div>

            {recentAchievements.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                <div className="text-3xl">🏆</div>
                <h4 className="font-bold text-slate-900 text-sm">No badges earned yet.</h4>
                <p className="text-xs text-slate-500">Complete quests to unlock your first achievement!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentAchievements.map((ach) => (
                  <div
                    key={ach._id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg border border-amber-200 shrink-0">
                        {ach.isEarned ? '🏅' : '🔒'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{ach.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{ach.description}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/achievements"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between transition-colors font-mono"
            >
              <span>[ View All Achievements → ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. REWARD SHOP PREVIEW                                                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">REWARD SHOP</h2>
          </div>
          <Link to="/rewards" className="text-xs text-blue-600 font-bold hover:underline font-mono">
            [ VISIT SHOP → ]
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl border border-amber-200 shadow-xs">
              🪙
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase font-mono">Vault Balance</div>
              <div className="text-sm font-black text-slate-900">
                You have {user?.coinBalance?.toLocaleString() || 0} coins available.
              </div>
            </div>
          </div>

          <Link
            to="/rewards"
            className="btn-primary text-xs py-2 px-4 shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Visit Shop →</span>
          </Link>
        </div>

        {rewards.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {rewards.slice(0, 3).map((reward) => (
              <div
                key={reward._id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{reward.title}</h4>
                    <span className="text-[11px] font-mono font-bold text-amber-600">
                      🪙 {reward.coinCost} Coins
                    </span>
                  </div>
                </div>

                <Link
                  to="/rewards"
                  className="text-xs text-blue-600 font-bold hover:underline font-mono shrink-0"
                >
                  Redeem →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}



