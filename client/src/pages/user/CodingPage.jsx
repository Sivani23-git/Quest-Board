import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Lock,
  Unlock,
  ChevronRight,
  BookOpen,
  Award,
  Zap,
  Flame,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import api from '../../services/api';

const LANGUAGE_META = {
  python: {
    name: 'Python',
    icon: '🐍',
    gradient: 'from-sky-500/20 via-blue-600/10 to-transparent',
    borderHover: 'hover:border-sky-500/50',
    accentColor: '#38BDF8',
    tag: 'Beginner Friendly • General Purpose • DSA',
  },
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    gradient: 'from-amber-500/20 via-yellow-600/10 to-transparent',
    borderHover: 'hover:border-amber-500/50',
    accentColor: '#FACC15',
    tag: 'Web & Fullstack • ES6+ • Dynamic Runtimes',
  },
  java: {
    name: 'Java',
    icon: '☕',
    gradient: 'from-orange-500/20 via-red-600/10 to-transparent',
    borderHover: 'hover:border-orange-500/50',
    accentColor: '#FB923C',
    tag: 'Object-Oriented • Collections • Enterprise',
  },
  cpp: {
    name: 'C++',
    icon: '⚡',
    gradient: 'from-indigo-500/20 via-purple-600/10 to-transparent',
    borderHover: 'hover:border-indigo-500/50',
    accentColor: '#818CF8',
    tag: 'High Performance • STL • Memory & DSA',
  },
};

export function CodingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLangParam = searchParams.get('lang');

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(selectedLangParam || null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pathLoading, setPathLoading] = useState(false);

  // Load All Languages Overview
  useEffect(() => {
    async function loadLanguages() {
      try {
        const res = await api.get('/coding/languages');
        setLanguages(res.data || []);
      } catch (err) {
        console.error('Failed to load languages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLanguages();
  }, []);

  // Load Specific Language Path if selected
  useEffect(() => {
    if (!selectedLanguage) {
      setLearningPath(null);
      return;
    }

    async function loadPath() {
      setPathLoading(true);
      try {
        const res = await api.get(`/coding/languages/${selectedLanguage}`);
        setLearningPath(res.data);
      } catch (err) {
        console.error('Failed to load learning path:', err);
      } finally {
        setPathLoading(false);
      }
    }
    loadPath();
  }, [selectedLanguage]);

  const handleSelectLanguage = (langId) => {
    setSelectedLanguage(langId);
    setSearchParams({ lang: langId });
  };

  const handleBackToAcademy = () => {
    setSelectedLanguage(null);
    setSearchParams({});
    setLearningPath(null);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-text-secondary">Loading Coding Academy & Learning Paths...</p>
      </div>
    );
  }

  // Render Language Path View (Drilldown)
  if (selectedLanguage && learningPath) {
    const meta = LANGUAGE_META[selectedLanguage] || {
      name: selectedLanguage,
      icon: '💻',
      accentColor: '#38BDF8',
    };
    const { userProgress, stages } = learningPath;

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBackToAcademy}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-white transition-colors bg-bg-card border border-bg-border/80 px-3 py-1.5 rounded-xl hover:border-brand-primary/40"
          >
            <ArrowLeft className="w-4 h-4 text-brand-accent" />
            <span>Back to All Learning Paths</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <span className="text-sm font-bold text-white">{meta.name} Journey</span>
          </div>
        </div>

        {/* Hero Path Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-bg-card via-bg-card to-bg-surface border border-bg-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-[11px] font-bold text-brand-accent uppercase tracking-wider">
                <span>{meta.icon} {meta.name} Mastery Path</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {meta.name} Learning Journey
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {learningPath.language?.description}
              </p>
            </div>

            {/* Path Stats Card */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-bg-surface/80 border border-bg-border shrink-0 min-w-[280px]">
              <div className="text-center p-2">
                <div className="text-[10px] uppercase font-bold text-text-muted">Mastery</div>
                <div className="text-lg font-black text-brand-accent mt-0.5">
                  Lv. {userProgress?.languageLevel || 1}
                </div>
              </div>
              <div className="text-center p-2 border-x border-bg-border/60">
                <div className="text-[10px] uppercase font-bold text-text-muted">Language XP</div>
                <div className="text-lg font-black text-amber-400 mt-0.5">
                  {userProgress?.languageXP || 0}
                </div>
              </div>
              <div className="text-center p-2">
                <div className="text-[10px] uppercase font-bold text-text-muted">Completed</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  {userProgress?.completedCount || 0}/{userProgress?.totalChallenges || 32}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-bg-border/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-text-secondary">Overall Path Completion</span>
              <span className="text-white font-bold">{userProgress?.progressPercent || 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-bg-surface rounded-full overflow-hidden border border-bg-border/50">
              <div
                className="h-full bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${userProgress?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage Roadmap Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-accent" />
              <span>Learning Roadmap & Stages</span>
            </h2>
            <span className="text-xs text-text-muted font-medium">
              8 Progressive Stages • 32 Curated Challenges
            </span>
          </div>

          <div className="space-y-6">
            {stages.map((stage) => {
              const stagePercent = stage.totalChallenges > 0
                ? Math.round((stage.completedChallenges / stage.totalChallenges) * 100)
                : 0;

              return (
                <div
                  key={stage.stageNumber}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    stage.isUnlocked
                      ? 'bg-bg-card border-bg-border'
                      : 'bg-bg-card/40 border-bg-border/40 opacity-75'
                  }`}
                >
                  {/* Stage Header */}
                  <div className="p-5 bg-bg-surface/50 border-b border-bg-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                          stage.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : stage.isUnlocked
                            ? 'bg-brand-primary/20 text-brand-accent border-brand-primary/40'
                            : 'bg-bg-surface text-text-muted border-bg-border'
                        }`}
                      >
                        {stage.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : stage.isUnlocked ? (
                          `S${stage.stageNumber}`
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Stage {stage.stageNumber}
                          </span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs font-bold text-brand-accent">
                            {stage.topic}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {stage.stageName}
                        </h3>
                      </div>
                    </div>

                    {/* Stage Status / Metric */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">
                          {stage.completedChallenges} / {stage.totalChallenges} Solved
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {stage.isCompleted ? 'Stage Mastered 🎉' : stage.isUnlocked ? 'Available to Learn' : 'Locked'}
                        </div>
                      </div>

                      <div className="w-20 h-2 bg-bg-surface rounded-full overflow-hidden border border-bg-border/50 hidden sm:block">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${stagePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stage Challenge List */}
                  <div className="p-4 sm:p-5 grid gap-3 sm:grid-cols-2">
                    {stage.challenges.map((challenge) => (
                      <div
                        key={challenge._id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          challenge.isSolved
                            ? 'bg-emerald-500/[0.04] border-emerald-500/30 hover:border-emerald-500/50'
                            : stage.isUnlocked
                            ? 'bg-bg-surface/60 border-bg-border hover:border-brand-primary/40 hover:bg-bg-surface'
                            : 'bg-bg-surface/30 border-bg-border/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`badge-${challenge.difficulty}`}>
                                {challenge.difficulty}
                              </span>
                              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                {challenge.category}
                              </span>
                            </div>

                            {challenge.isSolved ? (
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Solved</span>
                              </span>
                            ) : !stage.isUnlocked ? (
                              <span className="text-xs text-text-muted flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                <span>Locked</span>
                              </span>
                            ) : null}
                          </div>

                          <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
                            {challenge.title}
                          </h4>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-bg-border/50 flex items-center justify-between">
                          <div className="text-xs">
                            <span className="font-bold text-brand-accent">
                              +{challenge.xpReward} XP
                            </span>
                            <span className="text-yellow-400 font-semibold ml-2">
                              +{challenge.coinReward} Coins
                            </span>
                          </div>

                          <Link
                            to={`/coding/${challenge._id}`}
                            className={`text-xs py-1.5 px-3 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                              challenge.isSolved
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'btn-primary shadow-sm shadow-brand-primary/20'
                            }`}
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>{challenge.isSolved ? 'Solve Again' : 'Code Now'}</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render Academy Landing View (Choose Learning Path)
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-bg-card via-indigo-950/20 to-bg-surface border border-bg-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-xs font-bold text-brand-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Language-Specific Learning System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Coding Academy
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Choose a programming language, embark on a structured step-by-step learning journey,
            solve language-specific algorithmic challenges in a sandboxed runtime, and level up your developer mastery.
          </p>
        </div>
      </div>

      {/* Active Paths Section (If user has started any) */}
      {languages.some((l) => l.userProgress?.isStarted) && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>My Active Learning Paths</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {languages
              .filter((l) => l.userProgress?.isStarted)
              .map((lang) => {
                const meta = LANGUAGE_META[lang.id] || {
                  name: lang.name,
                  icon: lang.icon,
                  gradient: 'from-brand-primary/20 to-transparent',
                  borderHover: 'hover:border-brand-primary/50',
                };

                return (
                  <div
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang.id)}
                    className="p-5 rounded-2xl bg-bg-card border border-bg-border hover:border-brand-primary/50 transition-all cursor-pointer group flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-bg-surface border border-bg-border">
                          {lang.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
                              {lang.name}
                            </h3>
                            <span className="text-xs font-bold text-brand-accent bg-brand-primary/15 px-2.5 py-0.5 rounded-full border border-brand-primary/30">
                              Lv. {lang.userProgress?.languageLevel || 1}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-0.5">
                            Stage {lang.userProgress?.currentStage || 1} • {lang.userProgress?.completedCount || 0}/{lang.totalChallenges} challenges solved
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black text-white bg-bg-surface px-2.5 py-1 rounded-xl border border-bg-border">
                        {lang.userProgress?.progressPercent || 0}%
                      </span>
                    </div>

                    <div>
                      <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-bg-border/40 mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                          style={{ width: `${lang.userProgress?.progressPercent || 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-400 font-bold">
                          +{lang.userProgress?.languageXP || 0} Language XP
                        </span>
                        <span className="text-brand-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Continue Learning</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Choose Your Learning Path Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-accent" />
              <span>Choose Your Learning Path</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Select a language to browse curriculum stages, topics, and challenges.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {languages.map((lang) => {
            const meta = LANGUAGE_META[lang.id] || {
              name: lang.name,
              icon: lang.icon,
              gradient: 'from-brand-primary/20 to-transparent',
              borderHover: 'hover:border-brand-primary/50',
              tag: 'Language Learning Path',
            };
            const hasStarted = lang.userProgress?.isStarted;

            return (
              <div
                key={lang.id}
                className={`p-6 sm:p-7 rounded-3xl bg-bg-card border border-bg-border ${meta.borderHover} transition-all duration-200 flex flex-col justify-between gap-6 relative overflow-hidden group shadow-lg shadow-black/20`}
              >
                <div className="space-y-4">
                  {/* Language Top Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-bg-surface border border-bg-border flex items-center justify-center text-3xl shadow-md">
                        {lang.icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                            {lang.name}
                          </h3>
                          {hasStarted && (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Lv. {lang.userProgress?.languageLevel}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-text-muted">
                          {meta.tag}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-text-muted bg-bg-surface px-3 py-1 rounded-xl border border-bg-border/60">
                      {lang.totalChallenges} Challenges
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {lang.description}
                  </p>

                  {/* Curriculum Breadcrumbs */}
                  <div className="p-3 rounded-xl bg-bg-surface/70 border border-bg-border/60 text-[11px] font-mono text-text-muted space-y-1">
                    <div className="text-[10px] uppercase font-bold text-brand-accent">Curriculum Progression</div>
                    <div className="truncate">{lang.curriculumSummary}</div>
                  </div>
                </div>

                {/* Card Footer Progress & Action */}
                <div className="pt-5 border-t border-bg-border/60 space-y-4">
                  {hasStarted ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-text-secondary">Progress: {lang.userProgress?.progressPercent}%</span>
                        <span className="font-bold text-white">
                          {lang.userProgress?.completedCount} / {lang.totalChallenges} completed
                        </span>
                      </div>
                      <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-bg-border/40">
                        <div
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all"
                          style={{ width: `${lang.userProgress?.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>Status: Not started yet</span>
                      <span>8 Stages • +{lang.totalXP || 3200} Total XP</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleSelectLanguage(lang.id)}
                    className="w-full btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20"
                  >
                    <span>{hasStarted ? 'Continue Learning' : 'Start Learning Journey'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
