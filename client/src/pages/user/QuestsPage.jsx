import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Sword,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  X,
} from 'lucide-react';
import api from '../../services/api';

export function QuestsPage() {
  const { user, updateUserMetrics, triggerLevelUp } = useAuth();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('productivity');
  const [difficulty, setDifficulty] = useState('medium');
  const [verificationType, setVerificationType] = useState('self');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/quests?${params.toString()}`);
      setQuests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [statusFilter, categoryFilter, difficultyFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuests();
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/quests', {
        title,
        description,
        category,
        difficulty,
        verificationType,
      });

      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      fetchQuests();
    } catch (err) {
      alert(err.message || 'Could not create quest');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (quest) => {
    if (quest.verificationType !== 'self') return;
    setCompletingId(quest._id);

    try {
      const res = await api.post(`/quests/${quest._id}/complete`, {});
      updateUserMetrics({
        totalXP: (user.totalXP || 0) + res.data.xpAwarded,
        coinBalance: (user.coinBalance || 0) + res.data.coinAwarded,
        currentStreak: res.data.streak?.currentStreak || user.currentStreak,
        progress: res.data.xpProgress,
      });

      if (res.data.levelUp) {
        triggerLevelUp(res.data.levelUp);
      }

      fetchQuests();
    } catch (err) {
      alert(err.message || 'Failed to complete quest');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Sword className="w-7 h-7 text-brand-accent" />
            <span>Quest Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Browse official trials or forge custom quests to earn XP and coins.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span>New Personal Quest</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-bg-card border border-bg-border space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests by keywords..."
              className="w-full bg-bg-surface border border-bg-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-bg-surface border border-bg-border rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-primary"
            >
              <option value="">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-bg-surface border border-bg-border rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-primary"
            >
              <option value="">All Categories</option>
              <option value="coding">Coding</option>
              <option value="learning">Learning</option>
              <option value="productivity">Productivity</option>
              <option value="fitness">Fitness</option>
              <option value="habit">Habit</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-bg-surface border border-bg-border rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-primary"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </form>
      </div>

      {/* Quests List / Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted">Loading quests...</p>
        </div>
      ) : quests.length === 0 ? (
        <div className="py-16 text-center bg-bg-card/40 border border-dashed border-bg-border rounded-2xl space-y-3">
          <p className="text-sm text-text-secondary">No quests found matching your criteria.</p>
          <button
            onClick={() => {
              setStatusFilter('');
              setCategoryFilter('');
              setDifficultyFilter('');
              setSearchQuery('');
            }}
            className="btn-ghost text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => (
            <div
              key={quest._id}
              className={`quest-card flex flex-col justify-between ${
                quest.userStatus === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
                    {quest.isOfficial && (
                      <span className="text-[10px] bg-brand-primary/20 text-brand-accent px-2 py-0.5 rounded-full font-bold">
                        Official
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    {quest.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-1.5 line-clamp-1">
                  {quest.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                  {quest.description}
                </p>
              </div>

              <div className="pt-3 border-t border-bg-border/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted capitalize">
                    {quest.verificationType} verification
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-accent">+{quest.xpReward} XP</span>
                    <span className="text-yellow-400 font-semibold">+{quest.coinReward} Coins</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/quests/${quest._id}`}
                    className="flex-1 btn-secondary text-xs py-2 justify-center"
                  >
                    Details
                  </Link>

                  {quest.userStatus === 'completed' ? (
                    <div className="px-3 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </div>
                  ) : quest.verificationType === 'self' ? (
                    <button
                      onClick={() => handleComplete(quest)}
                      disabled={completingId === quest._id}
                      className="btn-primary text-xs py-2 px-3 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{completingId === quest._id ? 'Verifying...' : 'Complete'}</span>
                    </button>
                  ) : (
                    <Link
                      to={
                        quest.verificationType === 'quiz'
                          ? `/quizzes/${quest.quizId?._id || quest.quizId}`
                          : `/coding/${quest.codingChallengeId?._id || quest.codingChallengeId}`
                      }
                      className="btn-primary text-xs py-2 px-3 shrink-0"
                    >
                      <span>{quest.verificationType === 'quiz' ? 'Take Quiz' : 'Code'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Quest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 bg-bg-card border border-bg-border rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white p-1 rounded-lg hover:bg-bg-hover"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Sword className="w-5 h-5 text-brand-primary" />
              <span>Forge Custom Quest</span>
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Turn a personal task, study goal, or habit into an RPG quest.
            </p>

            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                  Quest Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Read 25 pages of Clean Architecture"
                  className="w-full bg-bg-surface border border-bg-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what constitutes successful completion..."
                  className="w-full bg-bg-surface border border-bg-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-bg-surface border border-bg-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                  >
                    <option value="productivity">Productivity</option>
                    <option value="coding">Coding</option>
                    <option value="learning">Learning</option>
                    <option value="fitness">Fitness</option>
                    <option value="habit">Habit</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                    Difficulty Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-bg-surface border border-bg-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                  >
                    <option value="easy">Easy (50 XP, 10 Coins)</option>
                    <option value="medium">Medium (100 XP, 25 Coins)</option>
                    <option value="hard">Hard (200 XP, 50 Coins)</option>
                    <option value="epic">Epic (350 XP, 100 Coins)</option>
                    <option value="legendary">Legendary (500 XP, 200 Coins)</option>
                  </select>
                </div>
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
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  {submitting ? 'Creating...' : 'Forge Quest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
