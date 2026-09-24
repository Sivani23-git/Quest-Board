import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { StreakBadge } from '../../components/gamification/StreakBadge';
import {
  User,
  Shield,
  Trophy,
  Flame,
  Award,
  Calendar,
  Sparkles,
  UserPlus,
  UserCheck,
  Lock,
} from 'lucide-react';
import api from '../../services/api';

export function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await api.get(`/users/profile/${username}`);
        setProfile(res.data);
        setFollowing(res.data.isFollowing || false);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      if (following) {
        await api.delete(`/social/follow/${profile._id}`);
        setFollowing(false);
      } else {
        await api.post(`/social/follow/${profile._id}`);
        setFollowing(true);
      }
    } catch (err) {
      alert(err.message || 'Follow action failed');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20">Profile not found.</div>;

  if (profile.isPrivate) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-bg-card border border-bg-border text-center space-y-3">
        <Lock className="w-10 h-10 text-text-muted mx-auto" />
        <h2 className="text-lg font-bold text-white">Private Adventurer Profile</h2>
        <p className="text-xs text-text-secondary">
          @{profile.username} has set their character sheet to private.
        </p>
      </div>
    );
  }

  const isSelf = currentUser?._id === profile._id;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Character Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-bg-card border border-bg-border relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-accent flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-brand-primary/30 border border-white/20">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">@{profile.username}</h1>
                <LevelBadge level={profile.level || 1} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-md">
                {profile.bio || 'QuestBoard Adventurer'}
              </p>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={handleFollowToggle}
              className={following ? 'btn-secondary text-xs py-2 px-4' : 'btn-primary text-xs py-2 px-4'}
            >
              {following ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Adventurer</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-bg-border/60">
          <div className="p-3 rounded-xl bg-bg-surface text-center">
            <div className="text-[11px] text-text-muted">Total XP</div>
            <div className="text-lg font-bold text-brand-accent">
              {profile.totalXP?.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-bg-surface text-center">
            <div className="text-[11px] text-text-muted">Current Streak</div>
            <div className="text-lg font-bold text-amber-400">{profile.currentStreak || 0}d</div>
          </div>

          <div className="p-3 rounded-xl bg-bg-surface text-center">
            <div className="text-[11px] text-text-muted">Longest Streak</div>
            <div className="text-lg font-bold text-text-primary">{profile.longestStreak || 0}d</div>
          </div>

          <div className="p-3 rounded-xl bg-bg-surface text-center">
            <div className="text-[11px] text-text-muted">Followers</div>
            <div className="text-lg font-bold text-white">{profile.followerCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Unlocked Badges & Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Unlocked Badges</span>
          </h2>

          <div className="space-y-2">
            {profile.achievements?.length === 0 ? (
              <p className="text-xs text-text-muted py-4">No badges claimed yet.</p>
            ) : (
              profile.achievements?.map((ach) => (
                <div
                  key={ach._id}
                  className="p-3 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🏆</span>
                    <div>
                      <div className="font-bold text-white">{ach.achievementId?.name}</div>
                      <div className="text-text-muted text-[11px]">
                        {ach.achievementId?.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    {ach.achievementId?.rarity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Public Activity Feed */}
        <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span>Activity Log</span>
          </h2>

          <div className="space-y-2">
            {profile.activities?.length === 0 ? (
              <p className="text-xs text-text-muted py-4">No recent public activities.</p>
            ) : (
              profile.activities?.map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-between text-xs"
                >
                  <span className="text-text-secondary font-medium">{act.title}</span>
                  <span className="text-[11px] text-text-muted">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
