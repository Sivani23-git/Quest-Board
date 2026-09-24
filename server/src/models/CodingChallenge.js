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
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic', 'legendary'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      enum: ['arrays', 'strings', 'dp', 'graphs', 'sorting', 'math', 'other'],
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
        default: '// Write your solution here\nfunction solution(input) {\n  \n}\n',
      },
      python: {
        type: String,
        default: '# Write your solution here\ndef solution(input):\n    pass\n',
      },
      java: {
        type: String,
        default: 'class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
      },
      cpp: {
        type: String,
        default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
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
        return DIFFICULTY_REWARDS[this.difficulty]?.xp || 100;
      },
    },
    coinReward: {
      type: Number,
      default: function () {
        return DIFFICULTY_REWARDS[this.difficulty]?.coins || 25;
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

export const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);
