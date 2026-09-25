import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Clock,
  Zap,
  Coins,
  Sparkles,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
} from 'lucide-react';
import api from '../../services/api';

export function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // Core quiz state
  const [quizData, setQuizData] = useState(null);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [hasPassed, setHasPassed] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active quiz session state
  const [quizState, setQuizState] = useState('briefing'); // 'briefing' | 'active' | 'results' | 'review'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const payload = res.data || res;
        const quiz = payload.quiz || (payload.title ? payload : null);
        setQuizData(quiz);
        setPreviousAttempts(payload.previousAttempts || []);
        setHasPassed(payload.hasPassed || false);
        setBestScore(payload.bestScore);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  // Timer countdown hook
  useEffect(() => {
    if (!timerActive || timeLeft === null) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      handleAutoSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    startTimeRef.current = Date.now();

    if (quizData.timeLimit && quizData.timeLimit > 0) {
      setTimeLeft(quizData.timeLimit);
      setTimerActive(true);
    } else {
      setTimeLeft(null);
      setTimerActive(false);
    }

    setQuizState('active');
  };

  const handleSelectOption = (qIndex, optionIndex) => {
    if (quizState !== 'active') return;
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const calculateTimeTaken = () => {
    if (!startTimeRef.current) return 0;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  };

  const submitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalQuestions = quizData.questions.length;
    const formattedAnswers = Array.from({ length: totalQuestions }, (_, idx) =>
      answers[idx] !== undefined ? answers[idx] : null
    );

    const timeTaken = calculateTimeTaken();

    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
        timeTaken,
      });

      const evalData = res.data || res;
      setResult(evalData);
      setQuizState('results');

      // Refresh global user state to reflect newly earned XP / Coins immediately
      if (evalData.passed && refreshUser) {
        refreshUser();
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert(err.response?.data?.message || err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time limit reached! Your trial is being automatically submitted.');
    submitAnswers();
  };

  const formatTimer = (seconds) => {
    if (seconds === null || seconds === undefined) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading Trial Environment...</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Knowledge Trial Not Found</h2>
        <p className="text-xs text-slate-500">The requested quiz trial could not be loaded or does not exist.</p>
        <Link to="/quizzes" className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Knowledge Quizzes</span>
        </Link>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // 1. BRIEFING / START SCREEN
  if (quizState === 'briefing') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Quizzes</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {quizData.category || 'Technical Trial'}
              </span>
              {hasPassed && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Certified ({bestScore}%)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{quizData.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{quizData.description}</p>
          </div>

          {/* Trial Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
              <span className="text-base font-black text-slate-900">{totalQuestions} Total</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Limit</span>
              <span className="text-base font-black text-slate-900">
                {quizData.timeLimit ? `${Math.round(quizData.timeLimit / 60)} min` : 'Untimed'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pass Threshold</span>
              <span className="text-base font-black text-slate-900">{quizData.passingScore}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rewards</span>
              <span className="text-sm font-black text-amber-600 flex items-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                +{quizData.xpReward || 100} XP
              </span>
            </div>
          </div>

          {/* Previous Attempts Info */}
          {previousAttempts.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Previous Attempt History</span>
                <span className="text-slate-500 font-normal">
                  {previousAttempts.length} {previousAttempts.length === 1 ? 'attempt' : 'attempts'} recorded
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {previousAttempts.slice(0, 5).map((att, idx) => (
                  <span
                    key={att._id || idx}
                    className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${
                      att.passed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    Attempt #{att.attemptNumber || idx + 1}: {att.score}% {att.passed ? '✓' : '✗'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions Notice */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Trial Rules & Integrity</span>
            </div>
            <p className="text-blue-800/80 leading-relaxed">
              • Multiple choice questions will be evaluated by the server upon submission.
              <br />
              • You may jump between questions freely using the Question Navigator before final submission.
              <br />
              • The countdown timer (if applicable) will begin once you click "Start Trial".
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Award className="w-4 h-4" />
            <span>{hasPassed ? 'START RETAKE TRIAL' : 'START KNOWLEDGE TRIAL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. RESULTS SCREEN
  if (quizState === 'results' && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Quizzes</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-center">
          {/* Result Banner */}
          <div
            className={`p-8 rounded-2xl border space-y-3 ${
              result.passed
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm bg-white">
              {result.passed ? (
                <Award className="w-9 h-9 text-emerald-600" />
              ) : (
                <RotateCcw className="w-9 h-9 text-rose-600" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                {result.passed ? '🏆 Trial Complete & Passed' : 'Trial Evaluation Complete'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1">
                {result.score}% Score
              </h2>
            </div>

            <p className="text-sm font-semibold max-w-md mx-auto">
              {result.passed
                ? `Outstanding! You answered ${result.correctCount} of ${result.totalQuestions} questions correctly and met the ${result.passingScore}% passing threshold.`
                : `You answered ${result.correctCount} of ${result.totalQuestions} questions correctly. The passing score required is ${result.passingScore}%. Review your answers below and try again!`}
            </p>

            {/* Gamification Rewards Granted */}
            {result.passed && result.xpEarned > 0 && (
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/90 border border-emerald-200 shadow-sm text-xs font-bold text-slate-800 mt-2">
                <span className="flex items-center gap-1 text-amber-600">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  +{result.xpEarned} XP Earned
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-amber-800">
                  <Coins className="w-4 h-4 text-amber-500" />
                  +{result.coinsEarned} Coins Earned
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setQuizState('review')}
              className="btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Answers</span>
            </button>

            <button
              onClick={handleStartQuiz}
              className="btn-secondary py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <Link
              to="/quizzes"
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Back to Quizzes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. ANSWER REVIEW MODE
  if (quizState === 'review' && result?.explanations) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setQuizState('results')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Score: <span className="text-slate-900 font-black">{result.score}%</span>
            </span>
            <button
              onClick={handleStartQuiz}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Comprehensive Answer Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review correct answers and technical explanations for all trial questions.
            </p>
          </div>

          <div className="space-y-6">
            {result.explanations.map((exp, qIdx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={exp.questionId || qIdx}
                  className={`p-5 rounded-2xl border space-y-4 ${
                    exp.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{exp.text}</h3>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                        exp.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {exp.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Options with Highlight */}
                  <div className="grid gap-2 pl-9">
                    {exp.options?.map((optText, optIdx) => {
                      const isUserSelection = exp.selectedOption === optIdx;
                      const isCorrectOption = exp.correctOption === optIdx;

                      let style = 'bg-white border-slate-200 text-slate-600';
                      if (isCorrectOption) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isUserSelection && !exp.isCorrect) {
                        style = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isCorrectOption
                                  ? 'bg-emerald-600 text-white'
                                  : isUserSelection
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {optionLetters[optIdx]}
                            </span>
                            <span>{optText}</span>
                          </div>

                          {isCorrectOption && (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                              <Check className="w-3.5 h-3.5" />
                              <span>Correct Answer</span>
                            </span>
                          )}
                          {isUserSelection && !isCorrectOption && (
                            <span className="text-[11px] font-bold text-rose-600 shrink-0">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  {exp.explanation && (
                    <div className="ml-9 p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px] block">
                        Technical Explanation:
                      </span>
                      <p className="text-slate-700 leading-relaxed">{exp.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setQuizState('results')}
              className="btn-secondary text-xs px-4 py-2.5"
            >
              Back to Score Summary
            </button>

            <Link to="/quizzes" className="btn-primary text-xs px-4 py-2.5">
              Back to All Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. ACTIVE QUIZ INTERFACE (Questions + Navigator + Timer)
  const optionLetters = ['A', 'B', 'C', 'D'];
  const isFinalQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to exit? Your trial progress will not be submitted.')) {
              setQuizState('briefing');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Trial</span>
        </button>

        {/* Real-time Countdown Timer */}
        {timeLeft !== null && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              timeLeft < 60
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)} remaining</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Quiz Meta & Progress Bar */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {quizData.title}
            </span>
            <span className="text-xs font-bold text-slate-600">
              Question <span className="text-slate-900 font-black">{currentQuestionIndex + 1}</span> of{' '}
              <span className="text-slate-900 font-black">{totalQuestions}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Progress: {progressPercent}% answered</span>
              <span>{answeredCount} of {totalQuestions} answered</span>
            </div>
          </div>
        </div>

        {/* Question Navigator Pills */}
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Question Navigator:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quizData.questions.map((_, qIdx) => {
              const isCurrent = currentQuestionIndex === qIdx;
              const isAnswered = answers[qIdx] !== undefined;

              let style = 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100';
              if (isCurrent) {
                style = 'bg-blue-600 text-white font-black border-blue-600 ring-2 ring-blue-400/30';
              } else if (isAnswered) {
                style = 'bg-blue-50 border-blue-300 text-blue-800 font-bold';
              }

              return (
                <button
                  type="button"
                  key={qIdx}
                  onClick={() => setCurrentQuestionIndex(qIdx)}
                  className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Question Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {currentQuestionIndex + 1}
            </span>
            <h3 className="font-bold text-base text-slate-900 leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid gap-2.5 pt-2 pl-0 sm:pl-10">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = answers[currentQuestionIndex] === optIdx;

              return (
                <button
                  type="button"
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span>{optionText}</span>
                  </div>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {!isFinalQuestion ? (
            <button
              type="button"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
              }
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submitAnswers}
              disabled={submitting}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Server-Side...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Trial Answers</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
