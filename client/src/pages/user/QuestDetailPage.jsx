import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Sword,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
  Code2,
  Trash2,
} from 'lucide-react';
import api from '../../services/api';

export function QuestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserMetrics, triggerLevelUp } = useAuth();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadQuest() {
      try {
        const res = await api.get(`/quests/${id}`);
        setQuest(res.data);
      } catch (err) {
        console.error('Failed to load quest:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuest();
  }, [id]);

  const handleComplete = async () => {
    if (quest.verificationType !== 'self') return;
    setCompleting(true);
    try {
      const res = await api.post(`/quests/${id}/complete`, {});
      updateUserMetrics({
        totalXP: (user.totalXP || 0) + res.data.xpAwarded,
        coinBalance: (user.coinBalance || 0) + res.data.coinAwarded,
        currentStreak: res.data.streak?.currentStreak || user.currentStreak,
        progress: res.data.xpProgress,
      });

      if (res.data.levelUp) {
        triggerLevelUp(res.data.levelUp);
      }

      setQuest((prev) => ({ ...prev, status: 'completed' }));
    } catch (err) {
      alert(err.message || 'Failed to complete quest');
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to abandon and delete this quest?')) return;
    try {
      await api.delete(`/quests/${id}`);
      navigate('/quests');
    } catch (err) {
      alert(err.message || 'Could not delete quest');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Quest not found.</p>
        <Link to="/quests" className="btn-secondary text-xs inline-flex mt-4">
          Back to Quest Board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/quests"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quest Board</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
            <span className="text-xs text-slate-400 font-bold uppercase">{quest.category}</span>
            {quest.isOfficial && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                Official Quest
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!quest.isOfficial && quest.status !== 'completed' && (
              <button
                onClick={handleDelete}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete quest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{quest.title}</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
            {quest.description}
          </p>
        </div>

        {/* Rewards & Associations Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1 font-medium">XP Bounty</div>
            <div className="text-xl font-bold text-amber-600">+{quest.xpReward} XP</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1 font-medium">Coin Bounty</div>
            <div className="text-xl font-bold text-yellow-600">+{quest.coinReward} Coins</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1 font-medium">Verification Method</div>
            <div className="text-sm font-bold text-slate-900 capitalize">
              {quest.verificationType} Verification
            </div>
          </div>
        </div>

        {/* Verification Trigger Section */}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Completion Verification</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {quest.verificationType === 'self'
                ? 'Mark this real-world task complete to record progress and earn bounties.'
                : quest.verificationType === 'quiz'
                ? 'Complete the associated knowledge quiz to verify your comprehension.'
                : 'Solve the programming challenge in the coding sandbox to pass test cases.'}
            </p>
          </div>

          {quest.status === 'completed' ? (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Quest Completed</span>
            </div>
          ) : quest.verificationType === 'self' ? (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="btn-primary py-2.5 px-6 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completing ? 'Verifying...' : 'Mark as Completed'}</span>
            </button>
          ) : (
            <Link
              to={
                quest.verificationType === 'quiz'
                  ? `/quizzes/${quest.quizId?._id || quest.quizId}`
                  : `/coding/${quest.codingChallengeId?._id || quest.codingChallengeId}`
              }
              className="btn-primary py-2.5 px-6 shrink-0"
            >
              <span>{quest.verificationType === 'quiz' ? 'Take Verification Quiz' : 'Open Code Sandbox'}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
