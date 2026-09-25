import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Plus, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';
import api from '../../services/api';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Target className="w-7 h-7 text-blue-600" />
            <span>Goals & Questlines</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize multi-step learning tracks and career milestones into structured quest sequences.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span>New Goal Track</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : goals.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-300 rounded-2xl space-y-3 shadow-sm">
          <Target className="w-10 h-10 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No active goals configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Establish higher-level goals (like "Become a Full-Stack Engineer") to group your quests.
          </p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs py-2 px-4 inline-flex">
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div key={goal._id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {goal.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {goal.completedCount} / {goal.totalCount} Quests
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{goal.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{goal.description}</p>
              </div>

              {/* Progress meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Goal Completion</span>
                  <span className="font-bold text-blue-600">{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Questline list preview */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quest Sequence
                </div>
                {goal.questline && goal.questline.length > 0 ? (
                  <div className="space-y-2">
                    {goal.questline.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">
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
