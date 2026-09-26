import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LevelBadge } from '../gamification/LevelBadge';
import { XPBar } from '../gamification/XPBar';
import { StreakBadge } from '../gamification/StreakBadge';
import { CoinCounter } from '../gamification/CoinCounter';
import { Bell, Menu, X, LogOut, User, Settings, CheckCheck, Compass, PanelLeftClose } from 'lucide-react';
import { QuestBoardLogo } from '../QuestBoardLogo';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-slate-700" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700" />
            )}
          </button>

          <Link to="/dashboard" className="flex items-center group select-none transition-transform hover:scale-[1.02]">
            {isSidebarOpen ? (
              <QuestBoardLogo variant="full" size="md" className="hidden sm:inline-flex" />
            ) : (
              <QuestBoardLogo variant="icon" size="md" className="hidden sm:inline-flex" />
            )}
            <QuestBoardLogo variant="icon" size="md" className="sm:hidden" />
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
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>Realm Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          No alerts at this moment, adventurer.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-3 rounded-xl text-xs transition-colors ${
                              notif.isRead
                                ? 'bg-slate-50 text-slate-600'
                                : 'bg-blue-50/70 text-slate-900 border border-blue-200'
                            }`}
                          >
                            <div className="font-semibold text-slate-900 mb-0.5">{notif.title}</div>
                            <div className="text-slate-600">{notif.message}</div>
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
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-purple-200 transition-all"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-white">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="font-bold text-sm text-slate-900">@{user.username}</div>
                      <div className="text-xs text-slate-500">Level {user.level} Adventurer</div>
                    </div>

                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      RPG Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      Settings & Privacy
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left mt-1"
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
