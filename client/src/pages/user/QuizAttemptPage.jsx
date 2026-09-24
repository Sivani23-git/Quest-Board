import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
} from 'lucide-react';
import api from '../../services/api';

export function QuizAttemptPage() {
  const { id } = useParams();
  const { user, updateUserMetrics } = useAuth();
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuizData(res.data.quiz);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (result) return; // Locked once submitted
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedAnswers = quizData.questions.map((_, idx) =>
      answers[idx] !== undefined ? answers[idx] : null
    );

    try {
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      });
      setResult(res.data);
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!quizData) return <div>Quiz not found.</div>;

  const totalQuestions = quizData.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/quizzes"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Knowledge Quizzes</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-bg-card border border-bg-border space-y-6">
        {/* Quiz Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bg-border">
          <div>
            <div className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">
              Trial Evaluation
            </div>
            <h1 className="text-2xl font-bold text-white">{quizData.title}</h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-text-muted block">Questions</span>
            <span className="text-sm font-bold text-white">
              {answeredCount} / {totalQuestions} Answered
            </span>
          </div>
        </div>

        {/* Score Card if Submitted */}
        {result && (
          <div
            className={`p-6 rounded-2xl border text-center space-y-2 animate-fade-in ${
              result.passed
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
            }`}
          >
            <div className="text-3xl font-black">{result.score}% Score</div>
            <p className="text-sm font-semibold">
              {result.passed
                ? 'Certification Passed! Mastery Verified.'
                : `Trial not passed (Required: ${quizData.passingScore}%). Review explanations below and retry.`}
            </p>
          </div>
        )}

        {/* Questions List Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {quizData.questions.map((q, qIndex) => {
            const explanation = result?.explanations?.[qIndex];

            return (
              <div
                key={q._id || qIndex}
                className="p-5 rounded-xl bg-bg-surface border border-bg-border space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base text-white">{q.text}</h3>
                </div>

                {/* Options List */}
                <div className="grid gap-2 pt-2">
                  {q.options.map((option, optIndex) => {
                    const isSelected = answers[qIndex] === optIndex;
                    let optionStyle =
                      'bg-bg-card hover:bg-bg-hover text-text-secondary border-bg-border';

                    if (isSelected) {
                      optionStyle =
                        'bg-brand-primary/20 text-brand-accent border-brand-primary shadow-sm';
                    }

                    if (result && explanation) {
                      if (optIndex === explanation.correctOption) {
                        optionStyle =
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold';
                      } else if (isSelected && !explanation.isCorrect) {
                        optionStyle = 'bg-rose-500/20 text-rose-300 border-rose-500';
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={optIndex}
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Result Explanation */}
                {explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-bg-card border border-bg-border text-xs space-y-1">
                    <span className="font-bold text-brand-accent uppercase tracking-wider block">
                      Explanation:
                    </span>
                    <p className="text-text-secondary">{explanation.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {!result ? (
            <button
              type="submit"
              disabled={submitting || answeredCount < totalQuestions}
              className="w-full btn-primary py-3.5 text-sm font-semibold"
            >
              {submitting ? 'Evaluating Submission...' : 'Submit Trial Answers'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
              className="w-full btn-secondary py-3 text-sm font-semibold"
            >
              Retake Trial
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
