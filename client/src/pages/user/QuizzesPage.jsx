import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import api from '../../services/api';

export function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data || []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-brand-accent" />
          <span>Knowledge Quizzes</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Verify technical concepts and architectural patterns with server-evaluated tests.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quest-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-brand-accent uppercase bg-brand-primary/20 px-2.5 py-0.5 rounded-full">
                    {quiz.skillId?.name || 'General Skill'}
                  </span>

                  {quiz.isPassed && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 border-t border-bg-border/60 flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  Passing Score: <span className="font-bold text-white">{quiz.passingScore}%</span>
                </div>

                <Link
                  to={`/quizzes/${quiz._id}`}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{quiz.isPassed ? 'Retake Quiz' : 'Begin Trial'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
