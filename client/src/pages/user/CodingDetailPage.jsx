import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Code2,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  Terminal,
  AlertCircle,
  Trophy,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';

const LANGUAGE_CONFIG = {
  python: {
    name: 'Python',
    icon: '🐍',
    filename: 'solution.py',
    monacoLang: 'python',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    filename: 'solution.js',
    monacoLang: 'javascript',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  java: {
    name: 'Java',
    icon: '☕',
    filename: 'Solution.java',
    monacoLang: 'java',
    badgeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  },
  cpp: {
    name: 'C++',
    icon: '⚡',
    filename: 'solution.cpp',
    monacoLang: 'cpp',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
};

export function CodingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserMetrics } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [nextChallenge, setNextChallenge] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showRewardModal, setShowRewardModal] = useState(false);

  useEffect(() => {
    async function loadChallenge() {
      setLoading(true);
      setExecutionResult(null);
      setShowRewardModal(false);
      try {
        const res = await api.get(`/coding/${id}`);
        const ch = res.data.challenge;
        setChallenge(ch);
        setNextChallenge(res.data.nextChallenge || null);
        setIsSolved(res.data.isSolved || false);
        // Editor starts completely BLANK with NO starter code/boilerplate
        setCode('');
      } catch (err) {
        console.error('Failed to load challenge:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, [id]);

  const handleCodeChange = (newCode) => {
    setValidationError(null);
    setCode(newCode || '');
  };

  const handleRunCode = async () => {
    const trimmedCode = (code || '').trim();
    if (!trimmedCode) {
      setValidationError('Please write your solution before running tests.');
      return;
    }

    setValidationError(null);
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await api.post(`/coding/${id}/run`, {
        language: challenge.language,
        code,
      });
      setExecutionResult(res.data);
      setActiveTab('results');
    } catch (err) {
      alert(err.message || 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    const trimmedCode = (code || '').trim();
    if (!trimmedCode) {
      setValidationError('Please write your solution before submitting.');
      return;
    }

    setValidationError(null);
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await api.post(`/coding/${id}/submit`, {
        language: challenge.language,
        code,
      });
      setExecutionResult(res.data);
      setActiveTab('results');

      if (res.data.isAllPassed) {
        setIsSolved(true);
        setShowRewardModal(true);

        // Update user stats in context if XP was awarded
        if (res.data.xpEarned) {
          updateUserMetrics({
            totalXP: (user?.totalXP || 0) + res.data.xpEarned,
            coinBalance: (user?.coinBalance || 0) + res.data.coinsEarned,
          });
        }
      }
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-text-secondary">Loading sandbox environment...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Coding challenge not found</h2>
        <Link to="/coding" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Coding Academy</span>
        </Link>
      </div>
    );
  }

  const langKey = (challenge.language || 'python').toLowerCase();
  const langConfig = LANGUAGE_CONFIG[langKey] || LANGUAGE_CONFIG.python;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-card p-3.5 rounded-2xl border border-bg-border">
        <div className="flex items-center gap-3">
          <Link
            to={`/coding?lang=${langKey}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-white transition-colors bg-bg-surface border border-bg-border px-3 py-1.5 rounded-xl hover:border-brand-primary/40"
          >
            <ArrowLeft className="w-4 h-4 text-brand-accent" />
            <span>{langConfig.name} Path</span>
          </Link>

          {/* Non-editable Language Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${langConfig.badgeClass}`}
          >
            <span>{langConfig.icon}</span>
            <span>{langConfig.name}</span>
          </div>

          <span className="text-xs text-text-muted hidden md:inline">
            Stage {challenge.learningStage || 1}: {challenge.stageName || challenge.topic}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunCode}
            disabled={executing}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{executing ? 'Executing...' : 'Run Samples'}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={executing}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md shadow-brand-primary/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Victory Reward Banner on Pass */}
      {showRewardModal && executionResult?.isAllPassed && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Challenge Solved!</span>
                {executionResult.isFirstSolve && (
                  <span className="text-[10px] uppercase font-bold text-brand-accent bg-brand-primary/20 px-2 py-0.5 rounded-full">
                    First Solve Bonus
                  </span>
                )}
              </div>
              <div className="text-xs text-emerald-300">
                {executionResult.xpEarned > 0 ? (
                  <span>
                    +{executionResult.xpEarned} XP & +{executionResult.coinsEarned} Coins earned!
                  </span>
                ) : (
                  <span>Challenge mastered! Practice repeated.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextChallenge ? (
              <Link
                to={`/coding/${nextChallenge._id}`}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-brand-primary/30"
              >
                <span>Next Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to={`/coding?lang=${langKey}`}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <span>View Learning Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid lg:grid-cols-12 gap-4 h-[75vh]">
        {/* Left Side: Problem Statement & Results Tab (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-bg-card border border-bg-border overflow-hidden">
          <div className="flex items-center gap-2 p-2 border-b border-bg-border bg-bg-surface/50">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'bg-bg-card text-brand-accent border border-bg-border'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'results'
                  ? 'bg-bg-card text-brand-accent border border-bg-border'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Execution Console {executionResult && '•'}
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeTab === 'description' ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge-${challenge.difficulty}`}>{challenge.difficulty}</span>
                    <span className="text-xs text-text-muted uppercase font-bold">
                      {challenge.topic || challenge.category}
                    </span>
                    {isSolved && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
                </div>

                <div className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {challenge.description}
                </div>

                {challenge.constraints && (
                  <div className="p-3 rounded-xl bg-bg-surface border border-bg-border text-xs space-y-1">
                    <div className="font-bold text-text-muted uppercase text-[10px]">Constraints</div>
                    <div className="text-text-secondary font-mono text-[11px]">{challenge.constraints}</div>
                  </div>
                )}

                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Examples
                    </h4>
                    {challenge.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-bg-surface border border-bg-border text-xs space-y-1 font-mono"
                      >
                        <div>
                          <span className="text-text-muted">Input: </span>
                          <span className="text-text-primary">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Output: </span>
                          <span className="text-brand-accent">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[11px] text-text-secondary pt-1 font-sans">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-bg-border">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-brand-accent" />
                    <span>Test Results</span>
                  </h3>
                  {executionResult && (
                    <span className="text-xs text-text-muted">
                      {executionResult.executionTimeMs}ms runtime
                    </span>
                  )}
                </div>

                {!executionResult ? (
                  <p className="text-xs text-text-muted text-center py-10">
                    Click "Run Samples" or "Submit Solution" to inspect execution results.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                        executionResult.isAllPassed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {executionResult.isAllPassed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>
                          {executionResult.isAllPassed
                            ? 'All Test Cases Passed!'
                            : `${executionResult.passedTests} / ${executionResult.totalTests} Passed`}
                        </span>
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      {executionResult.testResults?.map((test, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl bg-bg-surface border border-bg-border text-xs font-mono space-y-1"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-text-secondary">Case {index + 1}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                test.passed
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {test.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>

                          <div>
                            <span className="text-text-muted">Input: </span>
                            <span className="text-text-primary">{test.input}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Expected: </span>
                            <span className="text-brand-accent">{test.expected}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Output: </span>
                            <span className={test.passed ? 'text-emerald-400' : 'text-rose-400'}>
                              {test.actual}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-bg-card border border-bg-border overflow-hidden flex flex-col">
          <div className="p-3 bg-bg-surface/60 border-b border-bg-border text-xs font-mono text-text-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{langConfig.icon}</span>
              <span className="text-white font-bold">{langConfig.filename}</span>
            </div>
            <span className="text-[11px] text-brand-accent">Isolated Piston Runtime Sandbox</span>
          </div>

          <div className="flex-1 min-h-[420px]">
            <Editor
              height="100%"
              language={langConfig.monacoLang}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'Fira Code', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
