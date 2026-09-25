import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  RotateCcw,
  Clock,
  Zap,
  Coins,
  ArrowRight,
} from 'lucide-react';

export const QUIZ_CARD_VARIANTS = {
  cyan: {
    id: 'cyan',
    radialGradient:
      'radial-gradient(circle, rgba(6, 182, 212, 0.9) 0%, rgba(56, 189, 248, 0.6) 45%, rgba(6, 182, 212, 0) 75%)',
    badge: 'text-cyan-800 bg-cyan-50/90 border-cyan-200/90',
    borderHover: 'hover:border-cyan-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(6,182,212,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  purple: {
    id: 'purple',
    radialGradient:
      'radial-gradient(circle, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.6) 45%, rgba(139, 92, 246, 0) 75%)',
    badge: 'text-purple-800 bg-purple-50/90 border-purple-200/90',
    borderHover: 'hover:border-purple-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(139,92,246,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  pink: {
    id: 'pink',
    radialGradient:
      'radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(244, 114, 182, 0.6) 45%, rgba(236, 72, 153, 0) 75%)',
    badge: 'text-pink-800 bg-pink-50/90 border-pink-200/90',
    borderHover: 'hover:border-pink-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(236,72,153,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  orange: {
    id: 'orange',
    radialGradient:
      'radial-gradient(circle, rgba(249, 115, 22, 0.9) 0%, rgba(245, 158, 11, 0.6) 45%, rgba(249, 115, 22, 0) 75%)',
    badge: 'text-amber-900 bg-amber-50/90 border-amber-200/90',
    borderHover: 'hover:border-amber-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(249,115,22,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  green: {
    id: 'green',
    radialGradient:
      'radial-gradient(circle, rgba(16, 185, 129, 0.9) 0%, rgba(52, 211, 153, 0.6) 45%, rgba(16, 185, 129, 0) 75%)',
    badge: 'text-emerald-800 bg-emerald-50/90 border-emerald-200/90',
    borderHover: 'hover:border-emerald-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(16,185,129,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  blue: {
    id: 'blue',
    radialGradient:
      'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(99, 102, 241, 0.6) 45%, rgba(59, 130, 246, 0) 75%)',
    badge: 'text-blue-800 bg-blue-50/90 border-blue-200/90',
    borderHover: 'hover:border-blue-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(59,130,246,0.24),0_4px_12px_rgba(0,0,0,0.04)]',
  },
  yellow: {
    id: 'yellow',
    radialGradient:
      'radial-gradient(circle, rgba(250, 204, 21, 0.9) 0%, rgba(251, 191, 36, 0.6) 45%, rgba(250, 204, 21, 0) 75%)',
    badge: 'text-yellow-900 bg-yellow-50/90 border-yellow-200/90',
    borderHover: 'hover:border-yellow-400/90',
    glowHover: 'hover:shadow-[0_14px_32px_-6px_rgba(234,179,8,0.26),0_4px_12px_rgba(0,0,0,0.04)]',
  },
};

const VARIANT_KEYS = ['cyan', 'purple', 'pink', 'orange', 'green', 'blue', 'yellow'];

/**
 * Deterministically maps a quiz to one of the 7 vibrant aurora color variants.
 */
export function getQuizColorVariant(quiz) {
  const cat = (quiz.category || '').toLowerCase();
  if (cat.includes('python')) return QUIZ_CARD_VARIANTS.cyan;
  if (cat.includes('javascript')) return QUIZ_CARD_VARIANTS.yellow;
  if (cat.includes('java')) return QUIZ_CARD_VARIANTS.orange;
  if (cat.includes('c++')) return QUIZ_CARD_VARIANTS.blue;
  if (cat.includes('data') || cat.includes('algorithm')) return QUIZ_CARD_VARIANTS.purple;
  if (cat.includes('database')) return QUIZ_CARD_VARIANTS.green;
  if (cat.includes('ai') || cat.includes('machine')) return QUIZ_CARD_VARIANTS.pink;

  // Fallback deterministic hash
  const str = String(quiz._id || '') + String(quiz.title || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % VARIANT_KEYS.length;
  return QUIZ_CARD_VARIANTS[VARIANT_KEYS[index]];
}

export function QuizCard({ quiz }) {
  const variant = getQuizColorVariant(quiz);
  const timeMinutes = quiz.timeLimit ? Math.round(quiz.timeLimit / 60) : null;

  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || 'intermediate').toLowerCase();
    if (diff === 'beginner' || diff === 'easy') {
      return (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 shadow-xs">
          Beginner
        </span>
      );
    }
    if (diff === 'advanced' || diff === 'hard') {
      return (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50/90 text-purple-700 border border-purple-200/80 shadow-xs">
          Advanced
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50/90 text-amber-700 border border-amber-200/80 shadow-xs">
        Intermediate
      </span>
    );
  };

  return (
    <div
      className={`group relative rounded-[22px] transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-sm flex flex-col justify-between overflow-hidden border border-slate-200/80 ${variant.borderHover} ${variant.glowHover}`}
    >
      {/* LAYER 1: Animated Colorful Aurora Blob (Behind Card) */}
      <div className="absolute -inset-8 pointer-events-none overflow-hidden rounded-[26px] z-0">
        <div
          className="quiz-aurora-blob absolute w-[260px] h-[260px] rounded-full blur-[42px] opacity-65 group-hover:opacity-95 group-hover:scale-125 group-hover:blur-[34px] group-hover:saturate-150 transition-all duration-300 pointer-events-none"
          style={{ background: variant.radialGradient }}
        />
      </div>

      {/* LAYER 2: Frosted Translucent Inner Glass Surface */}
      <div className="absolute inset-0 rounded-[21px] backdrop-blur-[16px] bg-white/85 group-hover:bg-white/75 border border-white/80 group-hover:border-white/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_4px_16px_rgba(0,0,0,0.02)] pointer-events-none z-0 transition-all duration-300" />

      {/* LAYER 3: Interactive Card Content Layer (Above Both) */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          {/* Top Meta: Category & Status / Difficulty */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${variant.badge}`}
            >
              {quiz.category || 'General'}
            </span>

            <div className="flex items-center gap-1.5">
              {quiz.isPassed ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/90 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Passed ({quiz.bestScore}%)</span>
                </span>
              ) : quiz.status === 'failed' ? (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50/90 border border-rose-200/90 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <RotateCcw className="w-3 h-3 text-rose-600" />
                  <span>Retry ({quiz.bestScore}%)</span>
                </span>
              ) : (
                getDifficultyBadge(quiz.difficulty)
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {quiz.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
              {quiz.description}
            </p>
          </div>

          {/* Quiz Parameters Frosted Strip */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xs text-slate-600 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Questions
              </span>
              <span className="font-bold text-slate-800">
                {quiz.questionCount || 4} Qs
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Est. Time
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{timeMinutes ? `~${timeMinutes}m` : 'Untimed'}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pass Score
              </span>
              <span className="font-bold text-slate-800">
                {quiz.passingScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer Rewards & Action Button */}
        <div className="pt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-xs">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              +{quiz.xpReward || 100} XP
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-200/60 shadow-xs">
              <Coins className="w-3 h-3 text-amber-500" />
              +{quiz.coinReward || 25}
            </span>
          </div>

          <Link
            to={`/quizzes/${quiz._id}`}
            className={`text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
              quiz.isPassed
                ? 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            <span>{quiz.isPassed ? 'Review / Retake' : 'Begin Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
