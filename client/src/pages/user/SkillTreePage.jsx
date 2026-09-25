import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Atom,
  Server,
  Cpu,
  Flame,
  Layers,
  Award,
  BookOpen,
  Compass,
} from 'lucide-react';
import {
  PixelScroll,
  PixelGem,
  PixelCoin,
} from '../../components/pixel/PixelArt';
import api from '../../services/api';

const SKILL_LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 6000];

function getSkillLevelInfo(xp = 0) {
  let level = 1;
  for (let i = SKILL_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= SKILL_LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const currentBase = SKILL_LEVEL_THRESHOLDS[level - 1] || 0;
  const nextTarget = SKILL_LEVEL_THRESHOLDS[level] || currentBase + 1000;
  const xpInLevel = xp - currentBase;
  const neededInLevel = nextTarget - currentBase;
  const percent = Math.min(100, Math.max(0, Math.round((xpInLevel / neededInLevel) * 100)));
  return { level, xpInLevel, neededInLevel, nextTarget, percent };
}

function getSkillState(skill) {
  const isUnlocked = skill?.userProgress?.isUnlocked;
  const xp = skill?.userProgress?.xp || 0;
  const level = skill?.userProgress?.level || 1;

  if (!isUnlocked) return 'LOCKED';
  if (level >= 10 || xp >= 4500) return 'MASTERED';
  if (xp > 0) return 'IN_PROGRESS';
  return 'UNLOCKED';
}

const SKILL_ICONS = {
  'Productivity & Habits': <Zap className="w-5 h-5 text-purple-600" />,
  'Data Structures & Algorithms': <Cpu className="w-5 h-5 text-amber-500" />,
  'Web Fundamentals': <Globe className="w-5 h-5 text-cyan-600" />,
  'React Ecosystem': <Atom className="w-5 h-5 text-sky-500" />,
  'Node.js & Backend': <Server className="w-5 h-5 text-emerald-600" />,
};

const DOMAIN_THEMES = {
  'Productivity & Habits': {
    accent: '#8B5CF6',
    borderUnlocked: 'border-purple-300 hover:border-purple-400',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    barGradient: 'from-purple-400 to-indigo-500',
  },
  'Data Structures & Algorithms': {
    accent: '#F59E0B',
    borderUnlocked: 'border-amber-300 hover:border-amber-400',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    barGradient: 'from-amber-400 to-orange-500',
  },
  'Web Fundamentals': {
    accent: '#0284C7',
    borderUnlocked: 'border-sky-300 hover:border-sky-400',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    barGradient: 'from-sky-400 to-blue-500',
  },
  'React Ecosystem': {
    accent: '#0EA5E9',
    borderUnlocked: 'border-cyan-300 hover:border-cyan-400',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    barGradient: 'from-cyan-400 to-sky-500',
  },
  'Node.js & Backend': {
    accent: '#10B981',
    borderUnlocked: 'border-emerald-300 hover:border-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barGradient: 'from-teal-400 to-emerald-500',
  },
};

export function SkillTreePage() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      const loadedSkills = res.data || [];
      setSkills(loadedSkills);

      if (loadedSkills.length > 0) {
        setSelectedSkill((prev) => {
          if (prev) {
            return loadedSkills.find((s) => s._id === prev._id) || loadedSkills[0];
          }
          return loadedSkills[0];
        });
      }
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
      const res = await api.post(`/skills/unlock/${skillId}`);
      setSuccessToast(res.data?.message || 'Skill unlocked successfully!');
      await fetchSkills();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err.message || 'Could not unlock skill');
    } finally {
      setUnlockingId(null);
    }
  };

  // Compute exact Skill Tree Statistics from real application data (5 skills total)
  const totalSkills = skills.length;
  const unlockedSkills = skills.filter((s) => s.userProgress?.isUnlocked);
  const unlockedCount = unlockedSkills.length;
  const inProgressCount = skills.filter(
    (s) => s.userProgress?.isUnlocked && (s.userProgress?.xp || 0) > 0
  ).length;
  const totalSkillXP = skills.reduce((sum, s) => sum + (s.userProgress?.xp || 0), 0);

  // Identify all 5 core skills from real data
  const productivitySkill = skills.find((s) => s.name === 'Productivity & Habits');
  const dsaSkill = skills.find((s) => s.name === 'Data Structures & Algorithms');
  const webFundamentals = skills.find((s) => s.name === 'Web Fundamentals');
  const reactSkill = skills.find((s) => s.name === 'React Ecosystem');
  const nodeSkill = skills.find((s) => s.name === 'Node.js & Backend');

  // Compute what to focus on or unlock next across all 5 skills
  const lockedSkills = skills.filter((s) => !s.userProgress?.isUnlocked);
  const unlockableNext = lockedSkills.filter((s) => {
    const prereqIds = (s.prerequisiteSkillIds || []).map((id) =>
      typeof id === 'object' ? id._id || id : id
    );
    if (prereqIds.length === 0) return true;
    return prereqIds.every((pId) =>
      unlockedSkills.some((us) => us._id.toString() === pId.toString())
    );
  });

  // For unlocked skills, sort by lowest XP / closest to next milestone
  const activeRecommendations = unlockedSkills
    .map((s) => {
      const { level, percent } = getSkillLevelInfo(s.userProgress?.xp || 0);
      return { ...s, level, percent };
    })
    .sort((a, b) => (a.userProgress?.xp || 0) - (b.userProgress?.xp || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">CALIBRATING SKILL MAP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl border-2 border-emerald-400 font-bold text-sm animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PAGE HEADER                                                             */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-xs shrink-0">
            <span className="text-3xl">🌳</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Skill Tree
              </h1>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs uppercase tracking-wider">
                {unlockedCount} of {totalSkills} Skills Unlocked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Build your character by mastering skills, unlocking new paths, and growing your abilities.
              Completing verified quests funnels 50% of XP into individual skill domains.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHARACTER SKILL SUMMARY (4 STAT HUD CARDS)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* [ TOTAL SKILLS ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-blue-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
              [ TOTAL SKILLS ]
            </div>
            <div className="text-2xl font-black text-blue-600">{totalSkills}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Known Disciplines</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* [ UNLOCKED ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-emerald-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
              [ UNLOCKED ]
            </div>
            <div className="text-2xl font-black text-emerald-600">{unlockedCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Available Skills</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelScroll className="w-8 h-8" />
          </div>
        </div>

        {/* [ IN PROGRESS ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-purple-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-wider mb-1">
              [ IN PROGRESS ]
            </div>
            <div className="text-2xl font-black text-purple-600">{inProgressCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Skills with XP</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelGem className="w-8 h-8" />
          </div>
        </div>

        {/* [ TOTAL SKILL XP ] */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-amber-300 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group">
          <div>
            <div className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider mb-1">
              [ TOTAL SKILL XP ]
            </div>
            <div className="text-2xl font-black text-amber-500">
              +{totalSkillXP.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Domain Mastery</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs group-hover:scale-110 transition-transform">
            <PixelCoin className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 & 4. BALANCED CHARACTER SKILL MAP + INTERACTIVE SKILL INSPECTOR          */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* LEFT 2 COLS: UNIFIED CHARACTER SKILL MAP (ALL 5 SKILLS BALANCED) */}
        <div className="lg:col-span-2 space-y-6">
          {/* DOMAIN ROW 1: PERSONAL DEVELOPMENT & PROBLEM SOLVING (2 EQUAL CARDS) */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* 1. PERSONAL DEVELOPMENT: Productivity & Habits */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                    Personal Development
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  DISCIPLINE
                </span>
              </div>

              {productivitySkill && (
                <SkillNodeCard
                  skill={productivitySkill}
                  allSkills={skills}
                  isSelected={selectedSkill?._id === productivitySkill._id}
                  onSelect={() => setSelectedSkill(productivitySkill)}
                  onUnlock={() => handleUnlockSkill(productivitySkill._id)}
                  isUnlocking={unlockingId === productivitySkill._id}
                />
              )}
            </div>

            {/* 2. PROBLEM SOLVING: Data Structures & Algorithms */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                    Problem Solving
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ALGORITHMS
                </span>
              </div>

              {dsaSkill && (
                <SkillNodeCard
                  skill={dsaSkill}
                  allSkills={skills}
                  isSelected={selectedSkill?._id === dsaSkill._id}
                  onSelect={() => setSelectedSkill(dsaSkill)}
                  onUnlock={() => handleUnlockSkill(dsaSkill._id)}
                  isUnlocking={unlockingId === dsaSkill._id}
                />
              )}
            </div>
          </div>

          {/* DOMAIN ROW 2: WEB DEVELOPMENT (3 BALANCED CARDS: CORE, FRONTEND, BACKEND) */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                  Web Development
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                3 DISCIPLINES
              </span>
            </div>

            {/* 3. Web Fundamentals (Core) */}
            {webFundamentals && (
              <div>
                <SkillNodeCard
                  skill={webFundamentals}
                  allSkills={skills}
                  isSelected={selectedSkill?._id === webFundamentals._id}
                  onSelect={() => setSelectedSkill(webFundamentals)}
                  onUnlock={() => handleUnlockSkill(webFundamentals._id)}
                  isUnlocking={unlockingId === webFundamentals._id}
                />
              </div>
            )}

            {/* 4 & 5. React Ecosystem (Frontend) & Node.js Backend (Backend) Side-by-Side */}
            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              {reactSkill && (
                <SkillNodeCard
                  skill={reactSkill}
                  allSkills={skills}
                  isSelected={selectedSkill?._id === reactSkill._id}
                  onSelect={() => setSelectedSkill(reactSkill)}
                  onUnlock={() => handleUnlockSkill(reactSkill._id)}
                  isUnlocking={unlockingId === reactSkill._id}
                />
              )}
              {nodeSkill && (
                <SkillNodeCard
                  skill={nodeSkill}
                  allSkills={skills}
                  isSelected={selectedSkill?._id === nodeSkill._id}
                  onSelect={() => setSelectedSkill(nodeSkill)}
                  onUnlock={() => handleUnlockSkill(nodeSkill._id)}
                  isUnlocking={unlockingId === nodeSkill._id}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: SKILL DETAILS & PROGRESSION INSPECTOR */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Skill Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                SELECTED NODE
              </span>
            </div>

            {selectedSkill ? (
              <SkillInspectorPanel
                skill={selectedSkill}
                allSkills={skills}
                onUnlock={() => handleUnlockSkill(selectedSkill._id)}
                isUnlocking={unlockingId === selectedSkill._id}
              />
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select any skill node on the map to inspect mastery metrics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. WHAT'S NEXT? (WORKS ACROSS ALL 5 SKILLS)                               */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              WHAT'S NEXT?
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {unlockableNext.length > 0
              ? `${unlockableNext.length} Available to Unlock`
              : 'Recommended Skill Focus'}
          </span>
        </div>

        {/* If there are locked skills ready to be unlocked */}
        {unlockableNext.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {unlockableNext.map((skill) => {
              const prereqIds = (skill.prerequisiteSkillIds || []).map((id) =>
                typeof id === 'object' ? id._id || id : id
              );
              const prereqSkills = skills.filter((s) =>
                prereqIds.some((pId) => pId.toString() === s._id.toString())
              );
              const canUnlock = prereqSkills.every((ps) => ps.userProgress?.isUnlocked);

              return (
                <div
                  key={skill._id}
                  className="p-5 rounded-2xl bg-slate-50/90 border-2 border-slate-200/80 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                          {SKILL_ICONS[skill.name] || <Sparkles className="w-5 h-5 text-blue-500" />}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{skill.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>

                    {prereqSkills.length > 0 && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium pt-1">
                        <span className="text-slate-400">Complete:</span>
                        <span className="font-bold text-blue-700">
                          {prereqSkills.map((ps) => ps.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Earn domain XP by completing verified quests.
                    </span>

                    {canUnlock ? (
                      <button
                        onClick={() => handleUnlockSkill(skill._id)}
                        disabled={unlockingId === skill._id}
                        className="btn-primary text-xs py-1.5 px-4 inline-flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{unlockingId === skill._id ? 'Unlocking...' : 'Unlock Skill →'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedSkill(skill)}
                        className="text-xs text-blue-600 font-bold hover:underline font-mono inline-flex items-center gap-1 shrink-0"
                      >
                        <span>View Skill →</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Recommends active skills based on real XP & level progression */
          <div className="grid sm:grid-cols-2 gap-4">
            {activeRecommendations.slice(0, 2).map((skill) => (
              <div
                key={skill._id}
                className="p-5 rounded-2xl bg-slate-50/90 border-2 border-slate-200/80 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {SKILL_ICONS[skill.name] || <Sparkles className="w-5 h-5 text-blue-500" />}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{skill.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LVL {skill.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {skill.name === 'Productivity & Habits'
                      ? 'Build daily consistency, deep work rituals, and focus management to level up your character discipline.'
                      : skill.name === 'Data Structures & Algorithms'
                      ? 'Sharpen your algorithmic thinking and solve coding challenges in the sandbox to earn problem-solving mastery.'
                      : skill.name === 'Web Fundamentals'
                      ? 'Master responsive layouts, HTML5/CSS3, and DOM manipulation to unlock advanced frontend & backend specializations.'
                      : skill.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Earn domain XP by completing verified quests.
                  </span>

                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="text-xs text-blue-600 font-bold hover:underline font-mono inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Inspect Skill →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Standardized Skill Node Card Component with Equal Visual Importance
 */
function SkillNodeCard({
  skill,
  allSkills = [],
  isSelected,
  onSelect,
  onUnlock,
  isUnlocking,
}) {
  const state = getSkillState(skill);
  const xp = skill.userProgress?.xp || 0;
  const { level, xpInLevel, neededInLevel, percent } = getSkillLevelInfo(xp);
  const theme = DOMAIN_THEMES[skill.name] || DOMAIN_THEMES['Web Fundamentals'];

  // Discover actual prerequisite names from data
  const prereqIds = (skill.prerequisiteSkillIds || []).map((id) =>
    typeof id === 'object' ? id._id || id : id
  );
  const prereqSkills = allSkills.filter((s) =>
    prereqIds.some((pId) => pId.toString() === s._id.toString())
  );
  const prereqName = prereqSkills.map((s) => s.name).join(', ');

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 shadow-xs hover:-translate-y-0.5 ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 bg-white ' + theme.borderUnlocked
          : state !== 'LOCKED'
          ? 'bg-white ' + theme.borderUnlocked
          : 'bg-slate-50/80 border-slate-200/80 opacity-85 hover:opacity-100 hover:border-slate-300'
      }`}
    >
      {/* Node Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${
              state !== 'LOCKED'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {SKILL_ICONS[skill.name] || <span className="text-lg">⭐</span>}
          </div>

          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
              {skill.name}
            </h3>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              {skill.category}
            </span>
          </div>
        </div>

        {state !== 'LOCKED' ? (
          <span
            className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-lg border shadow-2xs shrink-0 ${theme.badgeBg}`}
          >
            LVL {level}
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 shrink-0">
            <Lock className="w-3 h-3" />
            LOCKED
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {skill.description}
      </p>

      {/* Progress & State Section */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        {state !== 'LOCKED' ? (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold">
              {state === 'IN_PROGRESS' ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ● IN PROGRESS
                </span>
              ) : state === 'MASTERED' ? (
                <span className="text-purple-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  ★ MASTERED
                </span>
              ) : (
                <span className="text-blue-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  ● UNLOCKED
                </span>
              )}

              <span className="text-slate-600">
                {xpInLevel} / {neededInLevel} XP <span className="text-blue-600">({percent}%)</span>
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full transition-all duration-500 shadow-xs`}
                style={{ width: `${Math.max(state === 'IN_PROGRESS' ? 6 : 0, percent)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-500 font-medium">
              {prereqName ? `Requires ${prereqName}` : 'Locked Node'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnlock();
              }}
              disabled={isUnlocking}
              className="text-xs text-blue-600 font-bold hover:underline font-mono inline-flex items-center gap-1"
            >
              <Unlock className="w-3 h-3" />
              <span>{isUnlocking ? 'Unlocking...' : 'Unlock →'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Detailed Skill Inspector Panel Component
 */
function SkillInspectorPanel({ skill, allSkills = [], onUnlock, isUnlocking }) {
  const state = getSkillState(skill);
  const xp = skill.userProgress?.xp || 0;
  const { level, xpInLevel, neededInLevel, percent } = getSkillLevelInfo(xp);
  const theme = DOMAIN_THEMES[skill.name] || DOMAIN_THEMES['Web Fundamentals'];

  const prereqIds = (skill.prerequisiteSkillIds || []).map((id) =>
    typeof id === 'object' ? id._id || id : id
  );
  const prereqSkills = allSkills.filter((s) =>
    prereqIds.some((pId) => pId.toString() === s._id.toString())
  );
  const canUnlock = prereqSkills.every((ps) => ps.userProgress?.isUnlocked);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
            {SKILL_ICONS[skill.name] || <Sparkles className="w-6 h-6 text-blue-600" />}
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900">{skill.name}</h4>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              {skill.category} Mastery
            </span>
          </div>
        </div>

        {/* State Tag */}
        {state === 'IN_PROGRESS' ? (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            IN PROGRESS
          </span>
        ) : state === 'MASTERED' ? (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            MASTERED
          </span>
        ) : state === 'UNLOCKED' ? (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            UNLOCKED
          </span>
        ) : (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
            LOCKED
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        {skill.description}
      </p>

      {/* Level & XP Progression HUD */}
      <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-slate-700 uppercase">
            LEVEL {level} SPECIALIST
          </span>
          <span className="font-mono font-bold text-amber-600">
            {xp.toLocaleString()} Total XP
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
          <div
            className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full transition-all duration-500 shadow-xs`}
            style={{ width: `${Math.max(state === 'IN_PROGRESS' ? 5 : 0, percent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{xpInLevel} / {neededInLevel} XP to Level {level + 1}</span>
          <span className="font-bold text-blue-600">{percent}%</span>
        </div>
      </div>

      {/* Prerequisites Section (Only if prerequisites exist) */}
      {prereqSkills.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-slate-700 uppercase font-mono">
            Prerequisites:
          </div>
          <div className="space-y-1">
            {prereqSkills.map((ps) => (
              <div
                key={ps._id}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span className="font-medium text-slate-800">{ps.name}</span>
                {ps.userProgress?.isUnlocked ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2">
        {state !== 'LOCKED' ? (
          <div className="space-y-2">
            <Link
              to="/quests"
              className="btn-primary w-full text-xs py-2.5 justify-center inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Find {skill.name} Quests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/coding"
              className="btn-secondary w-full text-xs py-2 justify-center inline-flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Practice in Coding Academy</span>
            </Link>
          </div>
        ) : (
          <button
            onClick={onUnlock}
            disabled={!canUnlock || isUnlocking}
            className={`w-full text-xs py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              canUnlock
                ? 'btn-primary'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>
              {isUnlocking
                ? 'Unlocking Node...'
                : canUnlock
                ? 'Unlock Skill Node'
                : 'Prerequisites Needed'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
