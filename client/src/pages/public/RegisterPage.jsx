import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { QuestBoardLogo } from '../../components/QuestBoardLogo';
import { PixelAuthBackground } from '../../components/pixel/PixelAuthBackground';
import { PixelAdventurer, PixelStar } from '../../components/pixel/PixelArt';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isHandleValid = username.trim().length >= 2;
  const isEmailValid = email.includes('@') && email.length > 4;
  const isPasswordValid = password.length >= 6;

  const completedSteps = [isHandleValid, isEmailValid, isPasswordValid].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 flex items-center justify-center p-4 overflow-hidden selection:bg-blue-600 selection:text-white font-sans">
      {/* 1. QuestBoard Pixel-Art RPG World Background */}
      <PixelAuthBackground />

      {/* 2. Register Form Card */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white border-2 border-slate-200/90 rounded-3xl shadow-xl relative z-10 animate-fade-in my-6">
        {/* Subtle Decorative Pixel Corner Accents */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-blue-400/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-blue-400/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-blue-400/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-blue-400/60 rounded-br-sm pointer-events-none" />

        {/* Card Header & RPG Character Avatar */}
        <div className="text-center mb-5">
          {/* Character Avatar Visual with Idle Animation & Level Badge */}
          <div className="flex items-center justify-center mb-3">
            <div className="relative p-2 rounded-2xl bg-blue-50/90 border border-blue-200 shadow-2xs hover:scale-105 transition-transform group">
              <div className="animate-float" style={{ animationDuration: '3.5s' }}>
                <PixelAdventurer className="w-10 h-12" />
              </div>
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-press-start text-[7px] shadow-xs uppercase tracking-wider">
                Lv. 1
              </span>
            </div>
          </div>

          <Link to="/" className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105 select-none">
            <QuestBoardLogo variant="full" size="md" showGlow />
          </Link>

          <h1 className="font-pixel text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Forge Your Character
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Begin earning XP, coins, and level advancements today.
          </p>
        </div>

        {/* Character Creation 3-Step Progress Indicator */}
        <div className="mb-5 p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[8px] font-press-start text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span>Character Creation</span>
            <span className="text-blue-600 font-bold">{completedSteps}/3 Done</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[8px] font-press-start">
            <div
              className={`py-1.5 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                isHandleValid
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-2xs'
                  : focusedField === 'username'
                  ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {isHandleValid ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : null}
              <span>① Handle</span>
            </div>

            <div
              className={`py-1.5 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                isEmailValid
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-2xs'
                  : focusedField === 'email'
                  ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {isEmailValid ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : null}
              <span>② Email</span>
            </div>

            <div
              className={`py-1.5 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                isPasswordValid
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-2xs'
                  : focusedField === 'password'
                  ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {isPasswordValid ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : null}
              <span>③ Secret</span>
            </div>
          </div>
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
                Adventurer Handle
              </label>
              {focusedField === 'username' && (
                <span className="text-[10px] font-press-start text-blue-600 animate-fade-in flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  <span>NAME</span>
                </span>
              )}
            </div>
            <div className="relative">
              <User
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === 'username' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <input
                type="text"
                required
                value={username}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="shadow_coder"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              {focusedField === 'email' && (
                <span className="text-[10px] font-press-start text-blue-600 animate-fade-in flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  <span>SCROLL</span>
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
                Password (min. 6 chars)
              </label>
              {focusedField === 'password' && (
                <span className="text-[10px] font-press-start text-amber-600 animate-fade-in flex items-center gap-1">
                  <PixelStar className="w-2.5 h-2.5 text-amber-500" />
                  <span>GUARD</span>
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
                minLength={6}
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
                <span>Creating Character...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Account & Begin</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Sign In Instead</span>
            <span className="font-press-start text-[9px]">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
