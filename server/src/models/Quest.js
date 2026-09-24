import mongoose from 'mongoose';
import {
  QUEST_CATEGORIES,
  QUEST_STATUSES,
  VERIFICATION_TYPES,
  DIFFICULTY_REWARDS,
} from '../config/constants.js';

const questSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [120, 'Quest title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Quest description is required'],
      trim: true,
      maxlength: [2000, 'Quest description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: QUEST_CATEGORIES,
      default: 'productivity',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'epic', 'legendary'],
      default: 'medium',
      index: true,
    },
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
    associatedSkillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      default: null,
      index: true,
    },
    associatedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
      index: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: QUEST_STATUSES,
      default: 'todo',
      index: true,
    },
    verificationType: {
      type: String,
      enum: VERIFICATION_TYPES,
      default: 'self',
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      default: null,
    },
    codingChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingChallenge',
      default: null,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isOfficial: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: [{ type: String, trim: true }],
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast querying
questSchema.index({ creatorId: 1, status: 1 });
questSchema.index({ isOfficial: 1, isPublic: 1 });

export const Quest = mongoose.model('Quest', questSchema);
