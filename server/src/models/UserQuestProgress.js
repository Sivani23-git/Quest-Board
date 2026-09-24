import mongoose from 'mongoose';
import { QUEST_STATUSES } from '../config/constants.js';

const userQuestProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: QUEST_STATUSES,
      default: 'todo',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    verificationRef: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    selfVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate progress records for the same user and quest
userQuestProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });
userQuestProgressSchema.index({ userId: 1, status: 1 });

export const UserQuestProgress = mongoose.model('UserQuestProgress', userQuestProgressSchema);
