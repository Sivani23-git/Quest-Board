import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Gift, Plus, Sparkles, Coins, Trash2, X } from 'lucide-react';
import api from '../../services/api';

export function RewardsPage() {
  const { user, updateUserMetrics } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [coinCost, setCoinCost] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/rewards');
      setRewards(res.data || []);
    } catch (err) {
      console.error('Failed to load rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/rewards', { title, coinCost: Number(coinCost) });
      setShowModal(false);
      setTitle('');
      fetchRewards();
    } catch (err) {
      alert(err.message || 'Could not create reward');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeem = async (reward) => {
    if ((user.coinBalance || 0) < reward.coinCost) {
      alert('Insufficient coins. Complete more verified quests to earn coins!');
      return;
    }

    setRedeemingId(reward._id);
    try {
      const res = await api.post(`/rewards/${reward._id}/redeem`, {});
      updateUserMetrics({ coinBalance: res.data.coinBalance });
      setToast(`Redeemed "${reward.title}"! Enjoy!`);
      fetchRewards();
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      alert(err.message || 'Redemption failed');
    } finally {
      setRedeemingId(null);
    }
  };

  const handleDelete = async (rewardId) => {
    try {
      await api.delete(`/rewards/${rewardId}`);
      fetchRewards();
    } catch (err) {
      alert(err.message || 'Could not delete reward');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-4 rounded-xl bg-yellow-500 text-bg-main font-bold text-sm shadow-2xl animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Gift className="w-7 h-7 text-yellow-400" />
            <span>Reward Shop</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Exchange your hard-earned virtual coins for real-world personal rewards.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span>Add Custom Reward</span>
        </button>
      </div>

      {/* Coin Balance Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-2xl shadow-inner">
            🪙
          </div>
          <div>
            <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
              Available Vault Balance
            </div>
            <div className="text-2xl font-black text-white">
              {user?.coinBalance?.toLocaleString() || 0} Coins
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : rewards.length === 0 ? (
        <div className="py-16 text-center bg-bg-card/40 border border-dashed border-bg-border rounded-2xl space-y-3">
          <p className="text-sm text-text-secondary">No custom rewards configured yet.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2 px-4 inline-flex">
            Create Reward (e.g., Movie Night, Coffee)
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = (user?.coinBalance || 0) >= reward.coinCost;

            return (
              <div
                key={reward._id}
                className="quest-card flex flex-col justify-between border border-bg-border relative group"
              >
                <button
                  onClick={() => handleDelete(reward._id)}
                  className="absolute top-4 right-4 text-text-muted hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete reward"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-2xl mb-2">🎁</div>
                  <h3 className="font-bold text-base text-white mb-1">{reward.title}</h3>
                  <div className="text-xs text-text-muted">
                    Redeemed {reward.timesRedeemed || 0} times
                  </div>
                </div>

                <div className="pt-4 border-t border-bg-border/60 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-400 text-sm">
                    <Coins className="w-4 h-4" />
                    <span>{reward.coinCost} Coins</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeemingId === reward._id}
                    className={`text-xs py-2 px-4 rounded-xl font-bold transition-all ${
                      canAfford
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-bg-main shadow-md'
                        : 'bg-bg-surface text-text-muted border border-bg-border cursor-not-allowed'
                    }`}
                  >
                    {redeemingId === reward._id
                      ? 'Redeeming...'
                      : canAfford
                      ? 'Redeem'
                      : 'Need Coins'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Reward Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-bg-card border border-bg-border rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white p-1 rounded-lg hover:bg-bg-hover"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span>Create Personal Reward</span>
            </h2>
            <p className="text-xs text-text-secondary mb-5">
              Set real-life treats to motivate yourself through quest completions.
            </p>

            <form onSubmit={handleCreateReward} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Artisan Coffee or Gaming Session"
                  className="w-full bg-bg-surface border border-bg-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                  Coin Cost
                </label>
                <input
                  type="number"
                  required
                  min={5}
                  value={coinCost}
                  onChange={(e) => setCoinCost(e.target.value)}
                  className="w-full bg-bg-surface border border-bg-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {submitting ? 'Creating...' : 'Add Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
