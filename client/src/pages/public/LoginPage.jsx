import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { AnimatedTopDock } from '../../shaders/animated-top-dock/AnimatedTopDock';
import { QuestBoardLogo } from '../../components/QuestBoardLogo';
import '../../shaders/threeui.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-text-primary flex items-center justify-center p-4 overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* 1. AnimatedTopDock Pixel Terminal Background */}
      <div className="auth-terminal-bg fixed inset-0 z-0 pointer-events-none overflow-hidden [filter:hue-rotate(270deg)_saturate(1.15)_brightness(0.85)] [&_.atd-retro\_\_readout]:!hidden [&_.animated-top-dock-component\_\_caption]:!hidden [&_.atd-retro\_\_bar]:!opacity-40 [&_.atd-retro\_\_bar]:!pointer-events-none [&_.atd-retro\_\_bar]:![filter:brightness(0.82)_contrast(0.9)] [&_.atd-retro\_\_bar]:!border-[#6C63FF]/30">
        <AnimatedTopDock
          variant="retro"
          pixelSize={4}
          levels={7}
          noise={1.00}
          scanlines={0.32}
          speed={1.00}
          proximity={132}
          widthGrowth={54}
        />
      </div>

      {/* 2. QuestBoard Atmosphere Overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 75% at 50% 45%, rgba(248, 250, 252, 0.45) 0%, rgba(241, 245, 249, 0.85) 100%)',
        }}
      />

      {/* 3. Auth Form Card */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105 select-none">
            <QuestBoardLogo variant="full" size="lg" showGlow />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your credentials to resume your journey.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@questboard.io"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to QuestBoard'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          New to the realm?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
