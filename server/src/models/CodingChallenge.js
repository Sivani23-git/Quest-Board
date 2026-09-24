import mongoose from 'mongoose';
import { DIFFICULTY_REWARDS } from '../config/constants.js';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expected: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
});

const codingChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 chars'],
    },
    description: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['python', 'java', 'javascript', 'cpp'],
      required: true,
      default: 'python',
      index: true,
    },
    topic: {
      type: String,
      required: true,
      default: 'Fundamentals',
      index: true,
    },
    learningStage: {
      type: Number,
      required: true,
      default: 1,
      index: true,
    },
    stageName: {
      type: String,
      default: 'Fundamentals',
    },
    order: {
      type: Number,
      default: 1,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingChallenge',
      },
    ],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic', 'legendary'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      default: 'arrays',
      index: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      default: null,
    },
    starterCode: {
      javascript: {
        type: String,
        default: '',
      },
      python: {
        type: String,
        default: '',
      },
      java: {
        type: String,
        default: '',
      },
      cpp: {
        type: String,
        default: '',
      },
    },
    testCases: [testCaseSchema],
    constraints: {
      type: String,
      default: '',
    },
    examples: [exampleSchema],
    xpReward: {
      type: Number,
      default: function () {
        return (this?.difficulty && DIFFICULTY_REWARDS[this.difficulty]?.xp) || 100;
      },
    },
    coinReward: {
      type: Number,
      default: function () {
        return (this?.difficulty && DIFFICULTY_REWARDS[this.difficulty]?.coins) || 25;
      },
    },
    isOfficial: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String, trim: true }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

codingChallengeSchema.index({ language: 1, learningStage: 1, order: 1 });

export const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);
