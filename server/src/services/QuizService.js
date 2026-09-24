import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { AppError } from '../utils/AppError.js';
import { ActivityService } from './ActivityService.js';

export class QuizService {
  /**
   * Evaluates submitted quiz answers securely against backend correctIndex.
   */
  static async submitAttempt(userId, quizId, answers = [], questId = null) {
    // Explicitly query +correctIndex for server-side evaluation only
    const quiz = await Quiz.findById(quizId).select('+questions.correctIndex');
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Check attempt limits
    const existingAttempts = await QuizAttempt.countDocuments({ userId, quizId });
    if (existingAttempts >= (quiz.maxAttempts || 3)) {
      throw new AppError(`Maximum attempt limit (${quiz.maxAttempts}) reached for this quiz.`, 400);
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const explanations = [];

    quiz.questions.forEach((q, index) => {
      const selectedOption = answers[index] !== undefined ? answers[index] : null;
      const isCorrect = selectedOption === q.correctIndex;
      if (isCorrect) correctCount++;

      explanations.push({
        questionId: q._id,
        text: q.text,
        selectedOption,
        correctOption: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (quiz.passingScore || 70);

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      questId,
      answers,
      score,
      passed,
      attemptNumber: existingAttempts + 1,
      completedAt: new Date(),
    });

    if (passed) {
      await ActivityService.log(userId, {
        type: 'quiz_passed',
        title: `Passed Quiz: ${quiz.title} (${score}%)`,
        referenceId: quiz._id,
        referenceModel: 'Quiz',
        metadata: { score, totalQuestions },
      });
    }

    return {
      attemptId: attempt._id,
      score,
      passed,
      correctCount,
      totalQuestions,
      attemptNumber: attempt.attemptNumber,
      explanations,
    };
  }
}
