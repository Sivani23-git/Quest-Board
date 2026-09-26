import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Plus, CheckCircle2, ArrowRight, X, Sparkles, Compass, Milestone, Award } from 'lucide-react';
import api from '../../services/api';
import { PixelGoalJourneyBackground } from '../../components/pixel/PixelAdventureValleyBackground';
import { PixelScroll, PixelStar } from '../../components/pixel/PixelArt';

export function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('learning');
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/goals');
      setGoals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/goals', { title, description, category });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      fetchGoals();
    } catch (err) {
      alert(err.message || 'Could not create goal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)]">
      {/* ========================================================================= */}
      {/* 1. DEDICATED FULL-PAGE GOAL JOURNEY & ACHIEVEMENT PIXEL-ART BACKGROUND    */}
      {/* Tells the visual story: START -> MILESTONE 1 -> 2 -> 3 -> GOAL SUMMIT     */}
      {/* ========================================================================= */}
      <PixelGoalJourneyBackground />

      {/* ========================================================================= */}
      {/* 2. FOREGROUND GOALS & QUESTLINES CONTENT LAYER                            */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 shadow-md">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider">
                GOAL ROADMAP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Target className="w-7 h-7 text-blue-600" />
              <span>Goals & Questlines</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Organize multi-step learning tracks and career milestones into structured quest sequences.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal Track</span>
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono mt-3">SURVEYING REALM MILESTONES...</p>
          </div>
        ) : goals.length === 0 ? (
          /* Empty State: Themed Adventure Quest Hub */
          <div className="p-8 sm:p-12 text-center bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 rounded-3xl shadow-lg relative overflow-hidden space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>PATHWAY TO MASTERY</span>
            </div>

            {/* Target & Scroll Icon Area */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-2xl rotate-6 border border-blue-200 shadow-xs" />
              <div className="relative w-16 h-16 rounded-xl bg-white border-2 border-blue-400 flex items-center justify-center shadow-sm">
                <PixelScroll className="w-10 h-10" />
              </div>
              <PixelStar className="absolute -top-2 -right-2 w-4 h-4 animate-pulse" color="#FACC15" />
              <PixelStar className="absolute -bottom-1 -left-2 w-3.5 h-3.5 animate-pulse-slow" color="#38BDF8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                No active goals configured
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Establish higher-level goals (like "Become a Full-Stack Engineer") to group your quests into structured adventure tracks.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Goal</span>
              </button>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-150 text-left max-w-2xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Curated Paths</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Group quests sequentially from start to mastery.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Milestone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>XP Milestones</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Earn multi-stage rewards as you complete phases.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Skill Synergy</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Directly level up associated skill tree masteries.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Goals Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal._id}
                className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-slate-200/90 shadow-md hover:shadow-lg transition-all space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono">
                      {goal.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {goal.completedCount} / {goal.totalCount} Quests
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{goal.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{goal.description}</p>
                </div>

                {/* Progress meter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-slate-600 uppercase tracking-wider">Goal Completion</span>
                    <span className="text-blue-600 font-black">{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${Math.min(100, Math.max(0, goal.progress || 0))}%` }}
                    />
                  </div>
                </div>

                {/* Questline list preview */}
                <div className="space-y-2 pt-3 border-t border-slate-150">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Quest Sequence
                  </div>
                  {goal.questline && goal.questline.length > 0 ? (
                    <div className="space-y-2">
                      {goal.questline.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-[10px] font-mono">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800">
                              {item.questId?.title || 'Quest Step'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Add quests to this goal track from the Quest Board.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Create Goal Track</span>
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Define a high-level outcome to connect related quests.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Master Full-Stack Web Development"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will you accomplish upon completing this goal?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="learning">Learning & Technology</option>
                  <option value="career">Career Progression</option>
                  <option value="fitness">Health & Fitness</option>
                  <option value="productivity">Habits & Productivity</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {submitting ? 'Creating...' : 'Initialize Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

