import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// User Pages
import { DashboardPage } from './pages/user/DashboardPage';
import { QuestsPage } from './pages/user/QuestsPage';
import { QuestDetailPage } from './pages/user/QuestDetailPage';
import { GoalsPage } from './pages/user/GoalsPage';
import { SkillTreePage } from './pages/user/SkillTreePage';
import { CodingPage } from './pages/user/CodingPage';
import { CodingDetailPage } from './pages/user/CodingDetailPage';
import { QuizzesPage } from './pages/user/QuizzesPage';
import { QuizAttemptPage } from './pages/user/QuizAttemptPage';
import { RewardsPage } from './pages/user/RewardsPage';
import { AchievementsPage } from './pages/user/AchievementsPage';
import { ChallengesPage } from './pages/user/ChallengesPage';
import { AnalyticsPage } from './pages/user/AnalyticsPage';
import { LeaderboardPage } from './pages/user/LeaderboardPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { SettingsPage } from './pages/user/SettingsPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Guest Route Guard (redirects logged in users to /dashboard)
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },

  // Authenticated User Routes (under AppLayout)
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/quests', element: <QuestsPage /> },
      { path: '/quests/:id', element: <QuestDetailPage /> },
      { path: '/goals', element: <GoalsPage /> },
      { path: '/skills', element: <SkillTreePage /> },
      { path: '/coding', element: <CodingPage /> },
      { path: '/coding/:id', element: <CodingDetailPage /> },
      { path: '/quizzes', element: <QuizzesPage /> },
      { path: '/quizzes/:id', element: <QuizAttemptPage /> },
      { path: '/rewards', element: <RewardsPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/challenges', element: <ChallengesPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/profile/:username', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
