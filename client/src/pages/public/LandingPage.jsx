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
import { CrtBackground } from '../../shaders/crt/CrtBackground';
import { QuestBoardLogo } from '../../components/QuestBoardLogo';
import '../../shaders/threeui.css';

export function LandingPage() {
  return (
    <div className="relative min-h-screen text-text-primary selection:bg-brand-primary selection:text-white">
      {/* CRT Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <CrtBackground
          variant="nintendo"
          speed={1.00}
          motion={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
          opacity={1.00}
        />
      </div>

      {/* Atmospheric / Readability Overlay Layer */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(248, 250, 252, 0.40) 0%, rgba(241, 245, 249, 0.75) 100%)',
        }}
      />

      {/* Existing Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center group select-none transition-transform hover:scale-[1.02]">
              <QuestBoardLogo variant="full" size="md" showGlow />
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all">
                Begin Adventure
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-20 pb-28 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Gamified Productivity & Developer Learning Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Turn Real-World Goals Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                RPG-Style Quests
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              Replace boring checklists with an authentic progression system. Complete verified quests,
              solve sandboxed coding challenges, earn XP + Coins, level up skills, and unlock achievements.
            </p>

            <div className="flex items-center justify-center">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all text-base">
                <span>Start Your Journey Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-1">100%</div>
                <div className="text-xs text-slate-500 font-medium">Server-Verified XP</div>
              </div>
              <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-black text-amber-500 mb-1">Sandboxed</div>
                <div className="text-xs text-slate-500 font-medium">Real Code Execution</div>
              </div>
              <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">Live RPG</div>
                <div className="text-xs text-slate-500 font-medium">Skills & Level Trees</div>
              </div>
              <div className="p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-black text-purple-600 mb-1">Shop</div>
                <div className="text-xs text-slate-500 font-medium">Virtual Coin Economy</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Systems Showcase */}
        <section className="py-20 px-6 bg-slate-50/90 backdrop-blur-md border-y border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Engineered for Real Mastery
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                QuestBoard integrates verified proof of work across three distinct verification vectors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Self-Verified Habits</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Log deep work hours, book reading, fitness milestones, and daily rituals with
                    idempotent XP tracking and streak protection.
                  </p>
                </div>
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span>Daily Streaks & Bonuses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-5">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Knowledge Quizzes</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Test your conceptual mastery on JavaScript, algorithms, frameworks, and architecture.
                    Answers are evaluated 100% server-side.
                  </p>
                </div>
                <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  <span>Cheat-Proof Scoring Engine</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-5">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sandboxed Code Verification</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Write solutions in Monaco Editor and execute against hidden automated test cases
                    in an isolated execution container.
                  </p>
                </div>
                <div className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <span>Multi-language Compiler</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-10 px-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <span>⚔️ QuestBoard Platform</span>
            </div>
            <div>Built with React, Express, MongoDB Atlas & Tailwind CSS.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

