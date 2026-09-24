import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { useAuth } from '../../contexts/AuthContext';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { levelUpData, clearLevelUp } = useAuth();

  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex flex-col selection:bg-brand-primary selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:pl-64 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Level-Up Celebration Modal */}
      {levelUpData && <LevelUpModal levelData={levelUpData} onClose={clearLevelUp} />}
    </div>
  );
}
