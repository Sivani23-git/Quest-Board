import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sword,
  Target,
  Network,
  Code2,
  HelpCircle,
  Gift,
  Trophy,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Quests', path: '/quests', icon: Sword },
  { name: 'Goals & Questlines', path: '/goals', icon: Target },
  { name: 'Skill Tree', path: '/skills', icon: Network },
  { name: 'Coding Sandbox', path: '/coding', icon: Code2 },
  { name: 'Knowledge Quizzes', path: '/quizzes', icon: HelpCircle },
  { name: 'Reward Shop', path: '/rewards', icon: Gift },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Challenges', path: '/challenges', icon: Zap },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Leaderboard', path: '/leaderboard', icon: Award },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-bg-surface/95 lg:bg-bg-surface/60 backdrop-blur-xl border-r border-bg-border/80 p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Mobile Top Brand Header in Sidebar */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-bg-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <span className="font-bold text-lg text-white">QuestBoard</span>
            </div>
          </div>

          <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3">
            Navigation
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-primary/20 text-brand-accent border border-brand-primary/40 shadow-sm shadow-brand-primary/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Hint */}
        <div className="p-3 rounded-xl bg-bg-card/70 border border-bg-border text-xs text-text-muted">
          <div className="flex items-center gap-1.5 text-brand-accent font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Daily Pro-tip</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Verify at least 1 quest every 24 hours to keep your active streak blazing.
          </p>
        </div>
      </aside>
    </>
  );
}
