import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Award,
  Clock,
  Zap,
  Coins,
  Flame,
  Search,
  Filter,
  BarChart3,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import { QuizCard } from '../../components/quizzes/QuizCard';

const CATEGORIES = [
  'All Trials',
  'Web Fundamentals',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'Data Structures & Algorithms',
  'Databases',
  'AI & Machine Learning',
];

export function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    quizXP: 0,
    quizStreak: 0,
    totalAttempts: 0,
  });
  const [history, setHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Trials');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [quizzesRes, statsRes, historyRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/quizzes/stats').catch(() => ({ data: {} })),
          api.get('/quizzes/history').catch(() => ({ data: [] })),
        ]);

        const quizzesData = quizzesRes?.data || quizzesRes || [];
        setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);

        const statsData = statsRes?.data || statsRes || {};
        if (statsData) {
          setStats({
            quizzesCompleted: statsData.quizzesCompleted || 0,
            averageScore: statsData.averageScore || 0,
            quizXP: statsData.quizXP || 0,
            quizStreak: statsData.quizStreak || 0,
            totalAttempts: statsData.totalAttempts || 0,
          });
        }

        const historyData = historyRes?.data || historyRes || [];
        if (Array.isArray(historyData)) {
          setHistory(historyData);
        }
      } catch (err) {
        console.error('Failed to load quizzes data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory =
      selectedCategory === 'All Trials' ||
      quiz.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });



  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - d) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Server-Evaluated Knowledge Trials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Knowledge Quizzes</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verify technical concepts, algorithms, and engineering patterns through rigorous, server-evaluated technical trials to earn XP and Coins.
          </p>
        </div>

        {/* Action Link to Learning Paths */}
        <Link
          to="/coding"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-sm transition-all hover:border-blue-300 self-start md:self-auto"
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Open Coding Academy</span>
        </Link>
      </div>

      {/* Part 1: Real Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quizzes Completed
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.quizzesCompleted || 0}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Score
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.averageScore ? `${stats.averageScore}%` : '0%'}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quiz XP
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.quizXP || 0} XP
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quiz Streak
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.quizStreak || 0} Days
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Category Filter Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filter by Category:</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trials or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 3: Responsive Quiz Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Knowledge Trials...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Knowledge Trials available in this category yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different topic or clearing your search filter to explore other available technical trials.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Trials');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs px-4 py-2 mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}

      {/* Part 13: Recent Quiz Activity / History Section */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Trial Activity</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {history.length} {history.length === 1 ? 'Attempt' : 'Attempts'} Logged
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-slate-500 space-y-1">
            <p className="text-sm font-medium">
              No quiz attempts yet. Choose a Knowledge Trial above to begin.
            </p>
            <p className="text-xs text-slate-400">
              Your completed trials, scores, and earned XP will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.slice(0, 8).map((attempt) => (
              <div
                key={attempt._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                      attempt.passed
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {attempt.passed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{attempt.quizTitle}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.2 rounded">
                        {attempt.category}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Score: <span className="font-bold text-slate-800">{attempt.score}%</span>{' '}
                      • Attempt #{attempt.attemptNumber || 1}
                      {attempt.timeTaken > 0 && ` • ${attempt.timeTaken}s elapsed`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {attempt.xpEarned > 0 && (
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      +{attempt.xpEarned} XP
                    </span>
                  )}
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      attempt.passed
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-rose-700 bg-rose-50'
                    }`}
                  >
                    {attempt.passed ? '✓ Passed' : '✗ Failed'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {formatRelativeTime(attempt.completedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
