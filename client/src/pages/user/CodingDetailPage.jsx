import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import api from '../../services/api';

const LANGUAGE_FILENAMES = {
  javascript: 'solution.js',
  python: 'solution.py',
  java: 'Solution.java',
  cpp: 'solution.cpp',
};

export function CodingDetailPage() {
  const { id } = useParams();
  const { user, updateUserMetrics, triggerLevelUp } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [userCodes, setUserCodes] = useState({
    javascript: '',
    python: '',
    java: '',
    cpp: '',
  });
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await api.get(`/coding/${id}`);
        setChallenge(res.data.challenge);
        // Code editor starts completely BLANK with empty string
        setUserCodes({
          javascript: '',
          python: '',
          java: '',
          cpp: '',
        });
      } catch (err) {
        console.error('Failed to load challenge:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, [id]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setValidationError(null);
    // Editor switches language highlighting without inserting any boilerplate
    if (!userCodes[newLang]) {
      setUserCodes((prev) => ({
        ...prev,
        [newLang]: '',
      }));
    }
  };

  const handleCodeChange = (newCode) => {
    setValidationError(null);
    setUserCodes((prev) => ({
      ...prev,
      [language]: newCode || '',
    }));
  };

  const handleRunCode = async () => {
    const currentCode = (userCodes[language] || '').trim();
    if (!currentCode) {
      setValidationError('Please write your solution before running the code.');
      return;
    }

    setValidationError(null);
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await api.post(`/coding/${id}/run`, {
        language,
        code: userCodes[language],
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
    const currentCode = (userCodes[language] || '').trim();
    if (!currentCode) {
      setValidationError('Please write your solution before submitting.');
      return;
    }

    setValidationError(null);
    setExecuting(true);
    setExecutionResult(null);
    try {
      const res = await api.post(`/coding/${id}/submit`, {
        language,
        code: userCodes[language],
      });
      setExecutionResult(res.data);
      setActiveTab('results');

      if (res.data.isAllPassed) {
        updateUserMetrics({
          totalXP: (user.totalXP || 0) + (challenge.xpReward || 100),
          coinBalance: (user.coinBalance || 0) + (challenge.coinReward || 25),
        });
      }
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!challenge) return <div>Challenge not found.</div>;

  const currentEditorCode = userCodes[language] || '';

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/coding"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arena</span>
        </Link>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-bg-card border border-bg-border rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleRunCode}
            disabled={executing}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{executing ? 'Running...' : 'Run Samples'}</span>
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

      {/* Validation Banner if user clicks run/submit with empty code */}
      {validationError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid lg:grid-cols-12 gap-4 h-[75vh]">
        {/* Left Side: Problem Statement & Tabs (5 Cols) */}
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
                      {challenge.category}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
                </div>

                <div className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {challenge.description}
                </div>

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
            <span>{LANGUAGE_FILENAMES[language] || 'solution.txt'}</span>
            <span className="text-[11px] text-brand-accent">Sandboxed Piston Engine</span>
          </div>

          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={currentEditorCode}
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
