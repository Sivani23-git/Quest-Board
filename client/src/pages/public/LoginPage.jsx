import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { QuestBoardLogo } from '../../components/QuestBoardLogo';
import { PixelAuthBackground } from '../../components/pixel/PixelAuthBackground';
import { PixelChest, PixelStar } from '../../components/pixel/PixelArt';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
    <div className="relative min-h-screen text-slate-900 flex items-center justify-center p-4 overflow-hidden selection:bg-blue-600 selection:text-white font-sans">
      {/* 1. QuestBoard Pixel-Art RPG World Background */}
      <PixelAuthBackground />

      {/* 2. Login Card */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white border-2 border-slate-200/90 rounded-3xl shadow-xl relative z-10 animate-fade-in">
        {/* Subtle Decorative Pixel Corner Accents */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-blue-400/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-blue-400/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-blue-400/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-blue-400/60 rounded-br-sm pointer-events-none" />

        {/* Card Header & RPG Visual */}
        <div className="text-center mb-6">
          {/* Small RPG Chest / Resume Quest Visual */}
          <div className="flex items-center justify-center mb-3">
            <div className="relative p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-2xs hover:scale-105 transition-transform group">
              <PixelChest className="w-9 h-9" />
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-press-start text-[7px] shadow-xs uppercase tracking-wider">
                Resume
              </span>
            </div>
          </div>

          <Link to="/" className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105 select-none">
            <QuestBoardLogo variant="full" size="md" showGlow />
          </Link>

          <h1 className="font-pixel text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Your quest awaits. Enter your credentials to resume your journey.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              {focusedField === 'email' && (
                <span className="text-[10px] font-press-start text-blue-600 animate-fade-in flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  <span>IDENTIFY</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Mail
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <input
                type="email"
                required
                value={email}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@questboard.io"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              {focusedField === 'password' && (
                <span className="text-[10px] font-press-start text-amber-600 animate-fade-in flex items-center gap-1">
                  <PixelStar className="w-2.5 h-2.5 text-amber-500" />
                  <span>SECURE</span>
                </span>
              )}
            </div>
            <div className="relative">
              <Lock
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-rpg-primary w-full py-3.5 text-sm font-bold mt-3 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Sign In to QuestBoard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 font-medium">
          New to the realm?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Create an Account</span>
            <span className="font-press-start text-[9px]">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
