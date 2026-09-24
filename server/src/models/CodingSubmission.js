import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  passed: { type: Boolean, required: true },
  isHidden: { type: Boolean, default: false },
  input: { type: String, default: '' },
  expected: { type: String, default: '' },
  actual: { type: String, default: '' },
  runtime: { type: Number, default: 0 },
});

const codingSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingChallenge',
      required: true,
      index: true,
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      default: null,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'passed', 'failed', 'error', 'timeout'],
      default: 'pending',
    },
    testResults: [testResultSchema],
    totalTests: { type: Number, default: 0 },
    passedTests: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
    xpAwarded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

codingSubmissionSchema.index({ userId: 1, challengeId: 1 });

export const CodingSubmission = mongoose.model('CodingSubmission', codingSubmissionSchema);
