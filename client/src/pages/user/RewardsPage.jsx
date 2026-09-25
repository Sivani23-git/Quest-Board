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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-4 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-xl animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Gift className="w-7 h-7 text-amber-500" />
            <span>Reward Shop</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exchange your hard-earned virtual coins for real-world personal rewards.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs sm:text-sm">
          <Plus className="w-4 h-4" />
          <span>Add Custom Reward</span>
        </button>
      </div>

      {/* Coin Balance Banner */}
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-sm border border-amber-200">
            🪙
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Available Vault Balance
            </div>
            <div className="text-2xl font-black text-slate-900">
              {user?.coinBalance?.toLocaleString() || 0} Coins
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : rewards.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-300 rounded-2xl space-y-3 shadow-sm">
          <p className="text-sm text-slate-600">No custom rewards configured yet.</p>
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
                className="quest-card flex flex-col justify-between relative group"
              >
                <button
                  onClick={() => handleDelete(reward._id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete reward"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-2xl mb-2">🎁</div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">{reward.title}</h3>
                  <div className="text-xs text-slate-400">
                    Redeemed {reward.timesRedeemed || 0} times
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 text-sm">
                    <Coins className="w-4 h-4" />
                    <span>{reward.coinCost} Coins</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeemingId === reward._id}
                    className={`text-xs py-2 px-4 rounded-xl font-bold transition-all ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              <span>Create Personal Reward</span>
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Set real-life treats to motivate yourself through quest completions.
            </p>

            <form onSubmit={handleCreateReward} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Artisan Coffee or Gaming Session"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Coin Cost
                </label>
                <input
                  type="number"
                  required
                  min={5}
                  value={coinCost}
                  onChange={(e) => setCoinCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
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
