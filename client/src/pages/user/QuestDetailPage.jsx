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
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quest Board</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-bg-card border border-bg-border space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bg-border">
          <div className="flex items-center gap-2">
            <span className={`badge-${quest.difficulty}`}>{quest.difficulty}</span>
            <span className="text-xs text-text-muted font-bold uppercase">{quest.category}</span>
            {quest.isOfficial && (
              <span className="text-xs bg-brand-primary/20 text-brand-accent px-2.5 py-0.5 rounded-full font-bold">
                Official Quest
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!quest.isOfficial && quest.status !== 'completed' && (
              <button
                onClick={handleDelete}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Delete quest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{quest.title}</h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-wrap">
            {quest.description}
          </p>
        </div>

        {/* Rewards & Associations Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-bg-border">
          <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
            <div className="text-xs text-text-muted mb-1">XP Bounty</div>
            <div className="text-xl font-bold text-brand-accent">+{quest.xpReward} XP</div>
          </div>

          <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
            <div className="text-xs text-text-muted mb-1">Coin Bounty</div>
            <div className="text-xl font-bold text-yellow-400">+{quest.coinReward} Coins</div>
          </div>

          <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
            <div className="text-xs text-text-muted mb-1">Verification Method</div>
            <div className="text-sm font-bold text-white capitalize">
              {quest.verificationType} Verification
            </div>
          </div>
        </div>

        {/* Verification Trigger Section */}
        <div className="p-6 rounded-xl bg-bg-surface border border-bg-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-white">Completion Verification</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {quest.verificationType === 'self'
                ? 'Mark this real-world task complete to record progress and earn bounties.'
                : quest.verificationType === 'quiz'
                ? 'Complete the associated knowledge quiz to verify your comprehension.'
                : 'Solve the programming challenge in the coding sandbox to pass test cases.'}
            </p>
          </div>

          {quest.status === 'completed' ? (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
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
