import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sword,
  Shield,
  Zap,
  Award,
  Code2,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { CrtBackground } from '../../shaders/crt/CrtBackground';
import { QuestBoardLogo } from '../../components/QuestBoardLogo';
import '../../shaders/threeui.css';

/**
 * Interactive 3D Card Tilt Wrapper
 * Applies subtle, physics-based 3D rotation and dynamic shadow on mouse hover.
 * Gracefully degrades on touch screens and prefers-reduced-motion.
 */
function Card3DTilt({
  children,
  className = '',
  maxTilt = 5,
  scale = 1.02,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isTouch || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTilt({ x: rotateX, y: rotateY, isHovered: true });
    },
    [isTouch, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, isHovered: false });
  }, []);

  const transformStyle = tilt.isHovered
    ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateZ(6px) scale(${scale})`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

export function LandingPage() {
  const [revealed, setRevealed] = useState({ hero: false, stats: false, features: false });
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Reveal hero immediately on mount
    setRevealed((prev) => ({ ...prev, hero: true }));

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === statsRef.current) {
            setRevealed((prev) => ({ ...prev, stats: true }));
          }
          if (entry.target === featuresRef.current) {
            setRevealed((prev) => ({ ...prev, features: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.15 });

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      {/* Single Original QuestBoard Pixel-Art Background across Entire Document */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <CrtBackground
          variant="nintendo"
          speed={1.00}
          motion={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
          opacity={1.00}
        />
      </div>

      {/* Content Layer (Directly over the single original background) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header (Transparent - Original pixel background flows behind it) */}
        <header className="sticky top-0 z-50 w-full bg-transparent px-6 py-5 transition-colors pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
            <Link
              to="/"
              className="flex items-center group select-none transition-transform hover:scale-[1.02] bg-white/80 hover:bg-white/90 border border-white/60 px-3.5 py-1.5 rounded-2xl shadow-xs backdrop-blur-xs"
            >
              <QuestBoardLogo variant="full" size="md" showGlow />
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-slate-900 hover:text-blue-600 bg-white/75 hover:bg-white/95 border border-white/60 rounded-xl shadow-xs transition-all backdrop-blur-xs"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-rpg-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 shadow-sm"
              >
                <span>Begin Adventure</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Pixel RPG Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/90 text-blue-700 text-[10px] sm:text-[11px] font-press-start uppercase tracking-wider mb-6 shadow-xs transition-all duration-700 ${
                revealed.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Gamified Productivity & Developer Learning Engine</span>
            </div>

            {/* Main Pixel RPG Hero Heading (Press Start 2P) */}
            <h1
              className={`font-press-start text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.35] mb-6 transition-all duration-700 delay-100 ${
                revealed.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: '#FFF4D6',
                textShadow: '2px 0 #16213E, -2px 0 #16213E, 0 2px #16213E, 0 -2px #16213E, 2px 2px 0 #16213E',
              }}
            >
              Turn Real-World Goals Into <br className="hidden sm:inline" />
              <span
                style={{
                  color: '#FFD84D',
                  textShadow: '2px 0 #16213E, -2px 0 #16213E, 0 2px #16213E, 0 -2px #16213E, 2px 2px 0 #16213E',
                }}
              >
                RPG-Style Quests
              </span>
            </h1>

            {/* Pixel RPG Description (VT323) */}
            <p
              className={`font-vt323 text-xl sm:text-2xl lg:text-[26px] max-w-3xl mx-auto mb-10 leading-relaxed font-normal transition-all duration-700 delay-200 ${
                revealed.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontFamily: '"VT323", monospace',
                color: '#FFF8E7',
                textShadow: '0 2px 0 #16213E, 1px 1px 0 #16213E',
              }}
            >
              Replace boring checklists with an authentic progression system. Complete verified quests,
              solve sandboxed coding challenges, earn XP + Coins, level up skills, and unlock achievements.
            </p>

            {/* CTA Button */}
            <div
              className={`flex items-center justify-center transition-all duration-700 delay-300 ${
                revealed.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link
                to="/register"
                className="btn-rpg-primary w-full sm:w-auto text-sm sm:text-base py-3.5 sm:py-4 px-8 sm:px-10 gap-3 group"
              >
                <span className="font-press-start text-xs sm:text-sm">Start Your Journey Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Quick Stats Banner (White Cards with 3D Tilt interaction) */}
            <div
              ref={statsRef}
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-slate-200/80 transition-all duration-700 ${
                revealed.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Card3DTilt maxTilt={6}>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300/80 transition-all h-full flex flex-col justify-center">
                  <div className="font-pixel text-xl sm:text-2xl font-black text-blue-600 mb-1">100%</div>
                  <div className="font-press-start text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide">
                    Server-Verified XP
                  </div>
                </div>
              </Card3DTilt>

              <Card3DTilt maxTilt={6}>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300/80 transition-all h-full flex flex-col justify-center">
                  <div className="font-pixel text-lg sm:text-2xl font-black text-amber-500 mb-1">Sandboxed</div>
                  <div className="font-press-start text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide">
                    Code Execution
                  </div>
                </div>
              </Card3DTilt>

              <Card3DTilt maxTilt={6}>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300/80 transition-all h-full flex flex-col justify-center">
                  <div className="font-pixel text-lg sm:text-2xl font-black text-emerald-600 mb-1">Live RPG</div>
                  <div className="font-press-start text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide">
                    Skills & Levels
                  </div>
                </div>
              </Card3DTilt>

              <Card3DTilt maxTilt={6}>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300/80 transition-all h-full flex flex-col justify-center">
                  <div className="font-pixel text-xl sm:text-2xl font-black text-purple-600 mb-1">Shop</div>
                  <div className="font-press-start text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wide">
                    Virtual Economy
                  </div>
                </div>
              </Card3DTilt>
            </div>
          </div>
        </section>

        {/* Core Systems Showcase (Transparent section around White Feature Cards) */}
        <section
          ref={featuresRef}
          className={`py-20 px-6 bg-transparent transition-all duration-700 ${
            revealed.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-pixel text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Engineered for Real Mastery
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                QuestBoard integrates verified proof of work across three distinct verification vectors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature Card 1 (White Card) */}
              <Card3DTilt maxTilt={5}>
                <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-pixel text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      Self-Verified Habits
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Log deep work hours, book reading, fitness milestones, and daily rituals with
                      idempotent XP tracking and streak protection.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-press-start text-[10px]">
                    <span>Streaks & XP</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card3DTilt>

              {/* Feature Card 2 (White Card) */}
              <Card3DTilt maxTilt={5}>
                <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-pixel text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                      Knowledge Quizzes
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Test your conceptual mastery on JavaScript, algorithms, frameworks, and architecture.
                      Answers are evaluated 100% server-side.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-press-start text-[10px]">
                    <span>Server-Side</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card3DTilt>

              {/* Feature Card 3 (White Card) */}
              <Card3DTilt maxTilt={5}>
                <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-pixel text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-700 transition-colors">
                      Sandboxed Code Verification
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Write solutions in Monaco Editor and execute against hidden automated test cases
                      in an isolated execution container.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-press-start text-[10px]">
                    <span>Multi-Compiler</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card3DTilt>
            </div>
          </div>
        </section>

        {/* Footer (Transparent over the original background) */}
        <footer className="mt-auto py-10 px-6 bg-transparent border-t border-slate-200/60 text-center text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span>⚔️ QuestBoard Platform</span>
            </div>
            <div>Built with React, Express, MongoDB Atlas & Tailwind CSS.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
