import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';

export const LANGUAGE_CHALLENGE_VARIANTS = {
  python: {
    id: 'python',
    name: 'Python',
    cornerBg: 'bg-emerald-500 group-hover:bg-emerald-400',
    gradientBg: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
    cardBorderHover: 'hover:border-emerald-400/80',
    glowHover: 'hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.25)]',
    arrowColor: 'text-white',
    buttonSolvedHover: 'group-hover:bg-white group-hover:text-emerald-900 group-hover:border-white group-hover:shadow-md',
    buttonUnsolvedHover: 'group-hover:bg-white group-hover:text-emerald-950 group-hover:border-white group-hover:shadow-md',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    cornerBg: 'bg-amber-400 group-hover:bg-amber-300',
    gradientBg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600',
    cardBorderHover: 'hover:border-amber-400/80',
    glowHover: 'hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)]',
    arrowColor: 'text-amber-950',
    buttonSolvedHover: 'group-hover:bg-white group-hover:text-amber-950 group-hover:border-white group-hover:shadow-md',
    buttonUnsolvedHover: 'group-hover:bg-white group-hover:text-amber-950 group-hover:border-white group-hover:shadow-md',
  },
  java: {
    id: 'java',
    name: 'Java',
    cornerBg: 'bg-orange-500 group-hover:bg-orange-400',
    gradientBg: 'bg-gradient-to-br from-orange-500 via-rose-500 to-red-600',
    cardBorderHover: 'hover:border-orange-400/80',
    glowHover: 'hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.25)]',
    arrowColor: 'text-white',
    buttonSolvedHover: 'group-hover:bg-white group-hover:text-orange-950 group-hover:border-white group-hover:shadow-md',
    buttonUnsolvedHover: 'group-hover:bg-white group-hover:text-orange-950 group-hover:border-white group-hover:shadow-md',
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    cornerBg: 'bg-blue-600 group-hover:bg-blue-500',
    gradientBg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700',
    cardBorderHover: 'hover:border-blue-400/80',
    glowHover: 'hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.25)]',
    arrowColor: 'text-white',
    buttonSolvedHover: 'group-hover:bg-white group-hover:text-blue-950 group-hover:border-white group-hover:shadow-md',
    buttonUnsolvedHover: 'group-hover:bg-white group-hover:text-blue-950 group-hover:border-white group-hover:shadow-md',
  },
};

export function getLanguageVariant(langKey) {
  const k = (langKey || 'python').toLowerCase();
  if (k.includes('python')) return LANGUAGE_CHALLENGE_VARIANTS.python;
  if (k.includes('javascript') || k.includes('js')) return LANGUAGE_CHALLENGE_VARIANTS.javascript;
  if (k.includes('java') && !k.includes('script')) return LANGUAGE_CHALLENGE_VARIANTS.java;
  if (k.includes('c++') || k.includes('cpp')) return LANGUAGE_CHALLENGE_VARIANTS.cpp;
  return LANGUAGE_CHALLENGE_VARIANTS.python;
}

export function CodingChallengeCard({ challenge, language = 'python', isStageUnlocked = true }) {
  const variant = getLanguageVariant(language);

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between gap-3 overflow-hidden ${
        challenge.isSolved
          ? 'bg-emerald-50/40 border-emerald-200/90 hover:-translate-y-1 hover:shadow-md'
          : isStageUnlocked
          ? `bg-white border-slate-200/90 hover:-translate-y-1 hover:shadow-md ${variant.cardBorderHover} ${variant.glowHover}`
          : 'bg-slate-50/50 border-slate-200/50 opacity-75'
      }`}
    >
      {/* LAYER 1: Expanding Corner Background Animation (The Uiverse concept) */}
      {isStageUnlocked && (
        <div
          className={`absolute -top-12 -right-12 w-24 h-24 rounded-full ${variant.gradientBg} transform scale-100 group-hover:scale-[22] transition-transform duration-500 ease-out pointer-events-none z-0`}
        />
      )}

      {/* LAYER 2: Top-Right Corner Arrow Badge */}
      {isStageUnlocked && (
        <div
          className={`absolute top-0 right-0 w-8 h-8 rounded-bl-2xl rounded-tr-[15px] ${variant.cornerBg} flex items-center justify-center z-10 pointer-events-none transition-colors duration-300 shadow-xs`}
        >
          <ArrowUpRight className={`w-3.5 h-3.5 ${variant.arrowColor} -mt-0.5 -mr-0.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
        </div>
      )}

      {/* LAYER 3: Interactive Card Content Layer */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
        <div>
          {/* Header Metadata: Difficulty, Category, Solved / Locked Status */}
          <div className="flex items-center justify-between gap-2 mb-2.5 pr-7">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full transition-all duration-300 border ${
                  challenge.difficulty === 'easy' || challenge.difficulty === 'beginner'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                    : challenge.difficulty === 'hard' || challenge.difficulty === 'advanced'
                    ? 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                    : 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30'
                }`}
              >
                {challenge.difficulty}
              </span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white/80 uppercase tracking-wider transition-colors duration-300">
                {challenge.category}
              </span>
            </div>

            {challenge.isSolved ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 group-hover:bg-white/25 group-hover:text-white group-hover:border-white/40 transition-all duration-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                <span>Solved</span>
              </span>
            ) : !isStageUnlocked ? (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </span>
            ) : null}
          </div>

          {/* Title & Description */}
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-white mb-1.5 line-clamp-1 transition-colors duration-300">
            {challenge.title}
          </h4>
          <p className="text-xs text-slate-600 group-hover:text-white/90 line-clamp-2 leading-relaxed transition-colors duration-300">
            {challenge.description}
          </p>
        </div>

        {/* Footer: XP, Coins & Action Button */}
        <div className="pt-3 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between gap-3 transition-colors duration-300">
          <div className="text-xs flex items-center gap-2">
            <span className="font-bold text-amber-600 group-hover:text-amber-200 bg-amber-50/80 group-hover:bg-white/15 px-2 py-0.5 rounded-md border border-amber-200/80 group-hover:border-white/25 transition-all duration-300">
              +{challenge.xpReward} XP
            </span>
            <span className="font-semibold text-amber-800 group-hover:text-white bg-amber-50/60 group-hover:bg-white/10 px-2 py-0.5 rounded-md border border-amber-200/60 group-hover:border-white/20 transition-all duration-300">
              +{challenge.coinReward} Coins
            </span>
          </div>

          {isStageUnlocked ? (
            <Link
              to={`/coding/${challenge._id}`}
              className={`text-xs py-1.5 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                challenge.isSolved
                  ? `bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 ${variant.buttonSolvedHover}`
                  : `btn-primary shadow-sm ${variant.buttonUnsolvedHover}`
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{challenge.isSolved ? 'Solve Again' : 'Code Now'}</span>
            </Link>
          ) : (
            <span className="text-xs text-slate-400 font-medium py-1.5 px-3 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Stage Locked</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
