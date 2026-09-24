import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sword,
  Shield,
  Zap,
  Award,
  Code2,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-main text-text-primary selection:bg-brand-primary selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-bg-surface/80 backdrop-blur-md border-b border-bg-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-primary/30">
              ⚔️
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Quest<span className="text-brand-accent">Board</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Begin Adventure
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-brand-accent/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gamified Productivity & Developer Learning Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Turn Real-World Goals Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-accent bg-clip-text text-transparent">
              RPG-Style Quests
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
            Replace boring checklists with an authentic progression system. Complete verified quests,
            solve sandboxed coding challenges, earn XP + Coins, level up skills, and unlock achievements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto btn-primary px-8 py-3.5 text-base font-bold">
              <span>Start Your Journey Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-base">
              Explore Demo Account
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-bg-border/60">
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-bg-border/50">
              <div className="text-2xl sm:text-3xl font-black text-brand-accent mb-1">100%</div>
              <div className="text-xs text-text-secondary font-medium">Server-Verified XP</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-bg-border/50">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">Sandboxed</div>
              <div className="text-xs text-text-secondary font-medium">Real Code Execution</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-bg-border/50">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">Live RPG</div>
              <div className="text-xs text-text-secondary font-medium">Skills & Level Trees</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-bg-border/50">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1">Shop</div>
              <div className="text-xs text-text-secondary font-medium">Virtual Coin Economy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Systems Showcase */}
      <section className="py-20 px-6 bg-bg-surface/40 border-y border-bg-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Engineered for Real Mastery
            </h2>
            <p className="text-text-secondary text-sm sm:text-base">
              QuestBoard integrates verified proof of work across three distinct verification vectors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="quest-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Self-Verified Habits</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Log deep work hours, book reading, fitness milestones, and daily rituals with
                  idempotent XP tracking and streak protection.
                </p>
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Daily Streaks & Bonuses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="quest-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-primary/15 text-brand-accent border border-brand-primary/30 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Knowledge Quizzes</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Test your conceptual mastery on JavaScript, algorithms, frameworks, and architecture.
                  Answers are evaluated 100% server-side.
                </p>
              </div>
              <div className="text-xs text-brand-accent font-semibold flex items-center gap-1">
                <span>Cheat-Proof Scoring Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="quest-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sandboxed Code Verification</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Write solutions in Monaco Editor and execute against hidden automated test cases
                  in an isolated execution container.
                </p>
              </div>
              <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <span>Multi-language Compiler</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-bg-border text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-text-secondary">
            <span>⚔️ QuestBoard Platform</span>
          </div>
          <div>Built with React, Express, MongoDB Atlas & Tailwind CSS.</div>
        </div>
      </footer>
    </div>
  );
}
