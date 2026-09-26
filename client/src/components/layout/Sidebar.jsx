import React from 'react';
import { NavLink } from 'react-router-dom';
import { QuestBoardLogo } from '../QuestBoardLogo';
import {
  LayoutDashboard,
  Sword,
  Target,
  Network,
  Code2,
  HelpCircle,
  Trophy,
  Zap,
  BarChart3,
  Award,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, iconColor: 'text-blue-500' },
  { name: 'Quests', path: '/quests', icon: Sword, iconColor: 'text-indigo-500' },
  { name: 'Goals & Questlines', path: '/goals', icon: Target, iconColor: 'text-emerald-500' },
  { name: 'Skill Tree', path: '/skills', icon: Network, iconColor: 'text-teal-500' },
  { name: 'Coding Academy', path: '/coding', icon: Code2, iconColor: 'text-cyan-500' },
  { name: 'Knowledge Quizzes', path: '/quizzes', icon: HelpCircle, iconColor: 'text-violet-500' },
  { name: 'Achievements', path: '/achievements', icon: Trophy, iconColor: 'text-amber-500' },
  { name: 'Challenges', path: '/challenges', icon: Zap, iconColor: 'text-orange-500' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, iconColor: 'text-sky-500' },
  { name: 'Leaderboard', path: '/leaderboard', icon: Award, iconColor: 'text-purple-500' },
];

export function Sidebar({ isOpen, onClose }) {
  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        aria-label="Main Navigation"
        aria-hidden={!isOpen}
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 p-4 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-full opacity-0 pointer-events-none'
        } flex flex-col justify-between shadow-sm`}
      >
        <div className="space-y-6">
          {/* Mobile Top Brand Header in Sidebar */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-100">
            <QuestBoardLogo variant="full" size="md" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            Navigation
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : item.iconColor
                        }`}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Hint */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Daily Pro-tip</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Complete at least 1 quest every 24 hours to keep your active streak blazing.
          </p>
        </div>
      </aside>
    </>
  );
}
