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
import { CompleteShelfLandingPage } from '../../shaders/landing-pages/LandingPages';
import { CodingChallengeCard } from '../../components/coding/CodingChallengeCard';
import api from '../../services/api';
import '../../shaders/threeui.css';

const LANGUAGE_META = {
  python: {
    name: 'Python',
    icon: '🐍',
    badgeBg: 'bg-sky-50 text-[#3776AB] border-[#3776AB]/30',
    accentColor: '#3776AB',
    secondaryColor: '#FFD43B',
    hoverBorder: 'hover:border-[#3776AB]',
    activeBorder: 'border-[#3776AB]',
    iconBg: 'bg-sky-50 border-[#3776AB]/20 text-[#3776AB]',
    progressBar: 'from-[#3776AB] via-[#3776AB] to-[#FFD43B]',
    textAccent: 'text-[#3776AB]',
    tag: 'Beginner Friendly • General Purpose • DSA',
  },
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
    accentColor: '#F7DF1E',
    secondaryColor: '#111827',
    hoverBorder: 'hover:border-amber-400',
    activeBorder: 'border-amber-400',
    iconBg: 'bg-amber-50 border-amber-300 text-amber-900',
    progressBar: 'from-[#D97706] to-[#FACC15]',
    textAccent: 'text-amber-800',
    tag: 'Web & Fullstack • ES6+ • Dynamic Runtimes',
  },
  java: {
    name: 'Java',
    icon: '☕',
    badgeBg: 'bg-orange-50 text-orange-900 border-orange-300',
    accentColor: '#E76F51',
    secondaryColor: '#5382A1',
    hoverBorder: 'hover:border-[#E76F51]',
    activeBorder: 'border-[#E76F51]',
    iconBg: 'bg-orange-50 border-[#E76F51]/20 text-[#E76F51]',
    progressBar: 'from-[#E76F51] to-[#5382A1]',
    textAccent: 'text-[#E76F51]',
    tag: 'Object-Oriented • Collections • Enterprise',
  },
  cpp: {
    name: 'C++',
    icon: '⚡',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    accentColor: '#2563EB',
    secondaryColor: '#60A5FA',
    hoverBorder: 'hover:border-[#2563EB]',
    activeBorder: 'border-[#2563EB]',
    iconBg: 'bg-blue-50 border-blue-200 text-blue-700',
    progressBar: 'from-[#2563EB] to-[#60A5FA]',
    textAccent: 'text-[#2563EB]',
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

  // Listen for book course selection events from ThreeUI Bookshelf
  useEffect(() => {
    const handleShelfMessage = (e) => {
      if (e.data?.type === 'threeui-shelf-select-course' && e.data?.courseId) {
        handleSelectLanguage(e.data.courseId);
      }
    };
    window.addEventListener('message', handleShelfMessage);
    return () => window.removeEventListener('message', handleShelfMessage);
  }, []);

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
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      accentColor: '#3B82F6',
    };
    const { userProgress, stages } = learningPath;

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBackToAcademy}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:border-blue-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to All Learning Paths</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <span className="text-sm font-bold text-slate-900">{meta.name} Journey</span>
          </div>
        </div>

        {/* Hero Path Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/50 to-blue-50/50 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${meta.badgeBg}`}>
                <span>{meta.icon} {meta.name} Mastery Path</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {meta.name} Learning Journey
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {learningPath.language?.description}
              </p>
            </div>

            {/* Path Stats Card */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0 min-w-[280px]">
              <div className="text-center p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Mastery</div>
                <div className="text-lg font-black text-blue-600 mt-0.5">
                  Lv. {userProgress?.languageLevel || 1}
                </div>
              </div>
              <div className="text-center p-2 border-x border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Language XP</div>
                <div className="text-lg font-black text-amber-600 mt-0.5">
                  {userProgress?.languageXP || 0}
                </div>
              </div>
              <div className="text-center p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Completed</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {userProgress?.completedCount || 0}/{userProgress?.totalChallenges || 32}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600">Overall Path Completion</span>
              <span className="text-slate-900 font-bold">{userProgress?.progressPercent || 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${meta.progressBar} rounded-full transition-all duration-500 shadow-xs`}
                style={{ width: `${userProgress?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stage Roadmap Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Learning Roadmap & Stages</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
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
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${stage.isUnlocked
                      ? 'bg-white border-slate-200/90'
                      : 'bg-slate-50 border-slate-200/50 opacity-80'
                    }`}
                >
                  {/* Stage Header */}
                  <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${stage.isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : stage.isUnlocked
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
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
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Stage {stage.stageNumber}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs font-bold text-blue-600">
                            {stage.topic}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {stage.stageName}
                        </h3>
                      </div>
                    </div>

                    {/* Stage Status / Metric */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {stage.completedChallenges} / {stage.totalChallenges} Solved
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {stage.isCompleted ? 'Stage Mastered 🎉' : stage.isUnlocked ? 'Available to Learn' : 'Locked'}
                        </div>
                      </div>

                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${stagePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stage Challenge List */}
                  <div className="p-4 sm:p-5 grid gap-3 sm:grid-cols-2">
                    {stage.challenges.map((challenge) => (
                      <CodingChallengeCard
                        key={challenge._id}
                        challenge={challenge}
                        language={selectedLanguage}
                        isStageUnlocked={stage.isUnlocked}
                      />
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
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-50/80 via-sky-50/60 to-blue-50/70 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Language-Specific Learning System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Coding Academy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Choose a programming language, embark on a structured step-by-step learning journey,
            solve language-specific algorithmic challenges in a sandboxed runtime, and level up your developer mastery.
          </p>
        </div>
      </div>

      {/* 3D Interactive Bookshelf Course-Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Interactive 3D Course Library</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interact with the 3D volume shelf. Select a language course volume to open its curriculum roadmap.
            </p>
          </div>
        </div>

        <div
          className="w-full rounded-3xl overflow-hidden border border-slate-200 bg-[#0A0F1E] shadow-xl shadow-slate-300/40 relative"
          style={{ width: '100%', height: '640px', minHeight: '600px' }}
        >
          <CompleteShelfLandingPage
            headingFont="iowan-old-style"
            bodyFont="inter"
            headingWeight="400"
            bodyWeight="400"
            primaryColor="#3B82F6"
            headingSize={60}
            bodySize={12}
            headingLetterSpacing={-0.055}
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
            className="w-full h-full rounded-3xl border-0"
          />
        </div>
      </div>

      {/* Learning Paths Section (All 4 Languages with Distinct Visual Identities) */}
      {languages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Available Learning Paths</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium font-mono">
              4 Languages • 128+ Challenges
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {languages.map((lang) => {
              const meta = LANGUAGE_META[lang.id] || {
                name: lang.name,
                icon: lang.icon,
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
                accentColor: '#3B82F6',
                hoverBorder: 'hover:border-blue-400',
                iconBg: 'bg-slate-50 border-slate-200',
                progressBar: 'from-blue-600 to-sky-400',
                textAccent: 'text-blue-600',
              };

              return (
                <div
                  key={lang.id}
                  onClick={() => handleSelectLanguage(lang.id)}
                  className={`p-5 rounded-2xl bg-white border-2 border-slate-200/90 ${meta.hoverBorder} hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4 shadow-xs hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`text-3xl p-2.5 rounded-2xl border ${meta.iconBg} shadow-2xs shrink-0 group-hover:scale-105 transition-transform`}>
                        {lang.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                            {lang.name}
                          </h3>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs font-mono ${meta.badgeBg}`}>
                            Lv. {lang.userProgress?.languageLevel || 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Stage {lang.userProgress?.currentStage || 1} • {lang.userProgress?.completedCount || 0}/{lang.totalChallenges} challenges solved
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 font-mono shrink-0">
                      {lang.userProgress?.progressPercent || 0}%
                    </span>
                  </div>

                  <div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-3">
                      <div
                        className={`h-full bg-gradient-to-r ${meta.progressBar} rounded-full transition-all duration-500 shadow-xs`}
                        style={{ width: `${Math.max(lang.userProgress?.isStarted ? 6 : 0, lang.userProgress?.progressPercent || 0)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-amber-600 font-bold font-mono">
                        +{lang.userProgress?.languageXP || 0} Language XP
                      </span>
                      <span className={`font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${meta.textAccent}`}>
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
    </div>
  );
}
