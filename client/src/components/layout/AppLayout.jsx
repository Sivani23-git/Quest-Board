import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { useAuth } from '../../contexts/AuthContext';

const SIDEBAR_STORAGE_KEY = 'questboard-sidebar-open';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('[AppLayout] Failed to read sidebar preference:', err);
    }
    // Default for first-time user: OPEN on desktop, drawer closed on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return false;
    }
    return true;
  });

  const { levelUpData, clearLevelUp } = useAuth();

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('[AppLayout] Failed to save sidebar preference:', err);
      }
      return next;
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(false));
    } catch (err) {
      console.warn('[AppLayout] Failed to save sidebar preference:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full relative z-10">
        {/* Left Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out relative ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
        >
          <div className="w-full animate-fade-in relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Level-Up Celebration Modal */}
      {levelUpData && <LevelUpModal levelData={levelUpData} onClose={clearLevelUp} />}
    </div>
  );
}
