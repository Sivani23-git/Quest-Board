import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      default: null,
    },
    answers: [
      {
        type: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    timeTaken: {
      type: Number, // In seconds
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    xpAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ userId: 1, quizId: 1 });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
