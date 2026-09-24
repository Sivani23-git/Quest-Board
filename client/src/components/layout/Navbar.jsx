import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LevelBadge } from '../gamification/LevelBadge';
import { XPBar } from '../gamification/XPBar';
import { StreakBadge } from '../gamification/StreakBadge';
import { CoinCounter } from '../gamification/CoinCounter';
import { Bell, Menu, X, LogOut, User, Settings, CheckCheck, Compass } from 'lucide-react';
import api from '../../services/api';

export function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      if (user) {
        try {
          const res = await api.get('/notifications');
          setNotifications(res.data || []);
          setUnreadCount(res.unreadCount || 0);
        } catch (err) {
          // silently catch polling errors
        }
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-surface/90 backdrop-blur-md border-b border-bg-border/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-bg-card transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-primary/25 transition-transform group-hover:scale-105">
              ⚔️
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white hidden sm:inline">
              Quest<span className="text-brand-accent">Board</span>
            </span>
          </Link>
        </div>

        {/* Center: Live XP Progress Bar (Desktop & Tablet) */}
        {user && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="flex items-center gap-3 w-full">
              <LevelBadge level={user.level} size="sm" />
              <XPBar progress={user.progress || {}} showLabel={true} />
            </div>
          </div>
        )}

        {/* Right: Currency, Streak, Notifications & Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {user && (
            <>
              <StreakBadge streak={user.currentStreak || 0} />
              <CoinCounter amount={user.coinBalance || 0} />

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-xl text-text-secondary hover:text-white hover:bg-bg-card transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-bg-card border border-bg-border shadow-2xl p-4 z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-bg-border mb-3">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>Realm Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-brand-primary/30 text-brand-accent px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-text-secondary hover:text-brand-accent flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-text-muted text-center py-6">
                          No alerts at this moment, adventurer.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-3 rounded-xl text-xs transition-colors ${
                              notif.isRead
                                ? 'bg-bg-surface/50 text-text-secondary'
                                : 'bg-brand-primary/10 text-text-primary border border-brand-primary/30'
                            }`}
                          >
                            <div className="font-semibold text-white mb-0.5">{notif.title}</div>
                            <div className="text-text-secondary">{notif.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-card transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white border border-white/10 shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-bg-card border border-bg-border shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-bg-border mb-1">
                      <div className="font-bold text-sm text-white">@{user.username}</div>
                      <div className="text-xs text-text-muted">Level {user.level} Adventurer</div>
                    </div>

                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-bg-surface rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-accent" />
                      RPG Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-bg-surface rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-text-secondary" />
                      Settings & Privacy
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
