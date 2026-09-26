import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Trophy,
  Shield,
  Lock,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  Coins,
  Flame,
  Search,
  Filter,
  Star,
  Target,
  Gift,
  Compass,
  Code,
  Terminal,
  Crown,
  BookOpen,
  Layers,
  Cpu,
  TrendingUp,
  X,
  ChevronRight,
  ArrowRight,
  Check,
  AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import { PixelPastelBackground } from '../../components/pixel/PixelPastelBackground';

const STATUS_FILTERS = ['ALL', 'UNLOCKED', 'CLAIMED', 'LOCKED'];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Categories' },
  { id: 'quests', label: 'Quests' },
  { id: 'coding', label: 'Coding' },
  { id: 'academy', label: 'Coding Academy' },
  { id: 'quizzes', label: 'Quizzes' },
  { id: 'streak', label: 'Streak' },
  { id: 'level', label: 'Level' },
  { id: 'skills', label: 'Skills' },
];

export function AchievementsPage() {
  const { user, refreshUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    unlockedCount: 0,
    claimedCount: 0,
    achievementXP: 0,
    overallPercentage: 0,
  });
  const [recentlyUnlocked, setRecentlyUnlocked] = useState([]);
  const [nextTrophies, setNextTrophies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Celebrations
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);

  async function loadAchievements() {
    setError(null);
    try {
      const res = await api.get('/achievements');
      // Axios interceptor returns response.data directly: { success: true, data: [...], stats: {...}, ... }
      const achList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.achievements)
        ? res.achievements
        : Array.isArray(res)
        ? res
        : [];

      const statsObj = res?.stats || {};
      const totalCount = statsObj.totalCount ?? achList.length;
      const unlockedCount = statsObj.unlockedCount ?? achList.filter((a) => a.isUnlocked).length;
      const claimedCount = statsObj.claimedCount ?? achList.filter((a) => a.isClaimed).length;
      const achievementXP = statsObj.achievementXP ?? achList.filter((a) => a.isClaimed).reduce((sum, a) => sum + (a.xpReward || 0), 0);
      const overallPercentage = statsObj.overallPercentage ?? (totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0);

      setAchievements(achList);
      setStats({
        totalCount,
        unlockedCount,
        claimedCount,
        achievementXP,
        overallPercentage,
      });

      if (Array.isArray(res?.recentlyUnlocked)) {
        setRecentlyUnlocked(res.recentlyUnlocked);
      } else {
        setRecentlyUnlocked(
          achList
            .filter((a) => a.isUnlocked)
            .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
            .slice(0, 5)
        );
      }

      if (Array.isArray(res?.nextTrophies)) {
        setNextTrophies(res.nextTrophies);
      } else {
        setNextTrophies(
          achList
            .filter((a) => !a.isUnlocked)
            .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
            .slice(0, 4)
        );
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError(err.message || 'Failed to load achievements. Please check connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleClaim = async (achievement, e) => {
    if (e) e.stopPropagation();
    if (claimingId || achievement.isClaimed) return;

    setClaimingId(achievement._id);
    try {
      const res = await api.post(`/achievements/${achievement._id}/claim`);
      const payload = res.data || res;

      // Update state locally
      setAchievements((prev) =>
        prev.map((a) =>
          a._id === achievement._id
            ? { ...a, isClaimed: true, claimedAt: new Date() }
            : a
        )
      );

      if (selectedAchievement?._id === achievement._id) {
        setSelectedAchievement((prev) => ({ ...prev, isClaimed: true }));
      }

      // Show celebration dialog
      setCelebrationData({
        name: achievement.name,
        description: achievement.description,
        xpReward: achievement.xpReward,
        coinReward: achievement.coinReward,
        rarity: achievement.rarity,
      });

      // Refresh global user state to update Navbar XP and coins immediately
      if (refreshUser) refreshUser();

      // Refresh overview stats
      loadAchievements();
    } catch (err) {
      console.error('Claim failed:', err);
      alert(err.message || 'Failed to claim achievement reward.');
    } finally {
      setClaimingId(null);
    }
  };

  const getRarityConfig = (rarity) => {
    const r = (rarity || 'common').toLowerCase();
    switch (r) {
      case 'legendary':
        return {
          label: 'Legendary',
          badge: 'bg-amber-50 text-amber-800 border-amber-300 font-black',
          cardBorder: 'border-amber-300 hover:border-amber-400 bg-amber-50/10',
          iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20',
          accent: 'text-amber-600',
        };
      case 'epic':
        return {
          label: 'Epic',
          badge: 'bg-purple-50 text-purple-800 border-purple-200 font-bold',
          cardBorder: 'border-purple-200 hover:border-purple-300 bg-purple-50/10',
          iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
          accent: 'text-purple-600',
        };
      case 'rare':
        return {
          label: 'Rare',
          badge: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
          cardBorder: 'border-blue-200 hover:border-blue-300 bg-blue-50/10',
          iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-blue-500/20',
          accent: 'text-blue-600',
        };
      default:
        return {
          label: 'Common',
          badge: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
          cardBorder: 'border-slate-200 hover:border-slate-300',
          iconBg: 'bg-slate-700 text-white',
          accent: 'text-slate-600',
        };
    }
  };

  const renderIcon = (iconName, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'footprints':
      case 'compass':
        return <Compass className={className} />;
      case 'code':
        return <Code className={className} />;
      case 'terminal':
      case 'sword':
        return <Terminal className={className} />;
      case 'globe':
      case 'book-open':
        return <BookOpen className={className} />;
      case 'sparkles':
      case 'star':
        return <Sparkles className={className} />;
      case 'help-circle':
        return <Award className={className} />;
      case 'target':
        return <Target className={className} />;
      case 'flame':
      case 'sun':
        return <Flame className={className} />;
      case 'trending-up':
        return <TrendingUp className={className} />;
      case 'shield-check':
      case 'shield':
        return <Shield className={className} />;
      case 'crown':
        return <Crown className={className} />;
      case 'cpu':
      case 'layers':
        return <Cpu className={className} />;
      default:
        return <Trophy className={className} />;
    }
  };

  const filteredAchievements = achievements.filter((ach) => {
    // 1. Status Filter
    if (statusFilter === 'UNLOCKED' && !ach.isUnlocked) return false;
    if (statusFilter === 'CLAIMED' && !ach.isClaimed) return false;
    if (statusFilter === 'LOCKED' && ach.isUnlocked) return false;

    // 2. Category Filter
    if (categoryFilter !== 'all' && ach.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    // 3. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = ach.name.toLowerCase().includes(q);
      const matchDesc = ach.description?.toLowerCase().includes(q);
      const matchCat = ach.category?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  return (
    <PixelPastelBackground
      animation="interactive"
      density="normal"
      pixelScale={1.5}
      backgroundColor="#FFFFFF"
      speed={1}
      className="min-h-full"
    >
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner (Part 1) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Achievement Hall • Progression & Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
            <span>Trophy Room</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Unlock rare badges by reaching productivity milestones, solving algorithms, passing knowledge trials, and maintaining active streaks.
          </p>
        </div>

        {/* Header Right: Overall Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Overall Mastery</span>
            <span className="text-blue-600">
              {stats.unlockedCount} of {stats.totalCount} Unlocked
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallPercentage || 0}%` }}
            />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
            {stats.overallPercentage}% Completed
          </div>
        </div>
      </div>

      {/* Part 2: Compact Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Achievements
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalCount || 23}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Unlocked
            </div>
            <div className="text-2xl font-black text-blue-600 mt-0.5">
              {stats.unlockedCount || 0}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Claimed
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {stats.claimedCount || 0}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Achievement XP
            </div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {stats.achievementXP || 0} XP
            </div>
          </div>
        </div>
      </div>

      {/* Part 12: Next Trophies / Closest to Unlocking */}
      {nextTrophies.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Next Trophies in Reach</h2>
            </div>
            <span className="text-xs font-bold text-blue-700">
              Keep progressing to unlock
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nextTrophies.map((ach) => {
              const rConfig = getRarityConfig(ach.rarity);
              return (
                <div
                  key={ach._id}
                  onClick={() => setSelectedAchievement(ach)}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {ach.category}
                    </span>
                    <span className="text-[10px] font-black text-blue-600">
                      {ach.percentage}%
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 line-clamp-1">
                    {ach.name}
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${ach.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{ach.currentProgress} / {ach.target}</span>
                      <span>+{ach.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Part 3: Filters, Categories & Search */}
      <div className="space-y-4">
        {/* Top Controls: Status Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isSelected = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 5: Responsive Achievement Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Trophy Room...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-red-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Unable to load achievements
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {error}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              loadAchievements();
            }}
            className="btn-secondary text-xs px-4 py-2 mt-2"
          >
            Retry
          </button>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No achievements found matching your filters.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your status or category filters to explore the full catalog of QuestBoard trophies.
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs px-4 py-2 mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map((ach) => {
            const rConfig = getRarityConfig(ach.rarity);
            const isUnlocked = ach.isUnlocked;
            const isClaimed = ach.isClaimed;

            return (
              <div
                key={ach._id}
                onClick={() => setSelectedAchievement(ach)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                  isClaimed
                    ? 'bg-white border-emerald-300/80 shadow-sm hover:shadow-md'
                    : isUnlocked
                    ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/20 hover:border-amber-400'
                    : `bg-white ${rConfig.cardBorder} shadow-sm hover:shadow-md`
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Top: Icon, Category & Rarity */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                        isUnlocked ? rConfig.iconBg : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {renderIcon(ach.icon, 'w-6 h-6')}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {ach.category}
                      </span>
                      <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${rConfig.badge}`}>
                        {rConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <span>{ach.name}</span>
                      {isClaimed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  {/* Real Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-600">
                        Progress: {ach.currentProgress} / {ach.target}
                      </span>
                      <span className="font-black text-slate-800">{ach.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isClaimed
                            ? 'bg-emerald-500'
                            : isUnlocked
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${ach.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rewards & CTA */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      +{ach.xpReward} XP
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-100/80">
                      <Coins className="w-3 h-3 text-amber-500" />
                      +{ach.coinReward}
                    </span>
                  </div>

                  {/* Claim Button / Status */}
                  {isClaimed ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </span>
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      onClick={(e) => handleClaim(ach, e)}
                      disabled={claimingId === ach._id}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all animate-pulse"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{claimingId === ach._id ? 'Claiming...' : 'Claim Reward'}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Part 11: Recently Unlocked Feed */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Recently Unlocked Trophies</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {recentlyUnlocked.length} Unlocked
          </span>
        </div>

        {recentlyUnlocked.length === 0 ? (
          <div className="py-8 text-center text-slate-500 space-y-1">
            <p className="text-sm font-medium">
              No achievements unlocked yet. Complete quests, coding challenges, quizzes, and streaks to earn your first trophy.
            </p>
            <p className="text-xs text-slate-400">
              Every milestone completed in QuestBoard advances your character progression.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentlyUnlocked.map((ach) => (
              <div
                key={ach._id}
                onClick={() => setSelectedAchievement(ach)}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                  {renderIcon(ach.icon, 'w-5 h-5')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {ach.name}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    +{ach.xpReward} XP • +{ach.coinReward} Coins
                  </div>
                </div>
                {ach.isClaimed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part 8: Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
                  selectedAchievement.isUnlocked
                    ? getRarityConfig(selectedAchievement.rarity).iconBg
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {renderIcon(selectedAchievement.icon, 'w-8 h-8')}
              </div>

              <div className="space-y-1 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {selectedAchievement.category}
                  </span>
                  <span
                    className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${
                      getRarityConfig(selectedAchievement.rarity).badge
                    }`}
                  >
                    {selectedAchievement.rarity}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedAchievement.name}
                </h3>
              </div>
            </div>

            {/* Description & Condition */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Description
                </span>
                <p className="text-slate-700 text-sm mt-0.5 leading-relaxed">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Unlock Requirement
                </span>
                <p className="text-slate-800 font-semibold mt-0.5">
                  Reach {selectedAchievement.target} {selectedAchievement.requirements?.type?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            {/* Progress Bar in Detail */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Current Progress</span>
                <span>
                  {selectedAchievement.currentProgress} / {selectedAchievement.target} (
                  {selectedAchievement.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedAchievement.isClaimed
                      ? 'bg-emerald-500'
                      : selectedAchievement.isUnlocked
                      ? 'bg-amber-500'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${selectedAchievement.percentage}%` }}
                />
              </div>
            </div>

            {/* Reward Summary */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <span className="text-xs font-bold text-amber-900">Achievement Rewards:</span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-black text-amber-600">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  +{selectedAchievement.xpReward} XP
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800">
                  <Coins className="w-4 h-4 text-amber-500" />
                  +{selectedAchievement.coinReward} Coins
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="btn-secondary text-xs px-4 py-2.5"
              >
                Close
              </button>

              {selectedAchievement.isClaimed ? (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Rewards Claimed</span>
                </div>
              ) : selectedAchievement.isUnlocked ? (
                <button
                  onClick={() => handleClaim(selectedAchievement)}
                  disabled={claimingId === selectedAchievement._id}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all"
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    {claimingId === selectedAchievement._id
                      ? 'Claiming...'
                      : 'Claim Reward Now'}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Part 10: Unlock Celebration Modal */}
      {celebrationData && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setCelebrationData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl border border-amber-300 shadow-2xl p-7 text-center space-y-5 animate-scale-up"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Trophy className="w-9 h-9" />
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
                🎉 Trophy Rewards Claimed!
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {celebrationData.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {celebrationData.description}
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm text-sm font-black text-slate-900">
              <span className="flex items-center gap-1 text-amber-600">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                +{celebrationData.xpReward} XP
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-amber-800">
                <Coins className="w-4 h-4 text-amber-500" />
                +{celebrationData.coinReward} Coins
              </span>
            </div>

            <button
              onClick={() => setCelebrationData(null)}
              className="w-full btn-primary py-3 text-xs font-bold"
            >
              Continue Your Journey
            </button>
          </div>
        </div>
      )}
      </div>
    </PixelPastelBackground>
  );
}
