import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Shield, User, Lock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export function SettingsPage() {
  const { user, updateUserMetrics } = useAuth();
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isOptedOut, setIsOptedOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setIsPublic(user.isPublic !== undefined ? user.isPublic : true);
      setIsOptedOut(user.isOptedOutLeaderboard || false);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await api.put('/users/me', {
        bio,
        isPublic,
        isOptedOutLeaderboard: isOptedOut,
      });

      updateUserMetrics(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-blue-600" />
          <span>Account Settings & Privacy</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your character identity, leaderboard visibility, and privacy boundaries.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
            Character Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share your learning focus or current adventure..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Privacy Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Privacy Boundaries</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">Public RPG Profile</div>
              <div className="text-[11px] text-slate-500">
                Allow other adventurers to inspect your level, badges, and public activity feed.
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">Opt-Out of Global Leaderboards</div>
              <div className="text-[11px] text-slate-500">
                Hide your character ranking from global, weekly, and monthly leaderboards.
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOptedOut}
              onChange={(e) => setIsOptedOut(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full btn-primary py-3 text-sm font-semibold">
          {saving ? 'Saving Settings...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
