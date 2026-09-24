import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['quest_count', 'xp_target', 'coding_count', 'streak'],
      required: true,
    },
    requirement: {
      target: { type: Number, required: true },
      category: { type: String, default: null },
    },
    xpReward: {
      type: Number,
      default: 250,
    },
    coinReward: {
      type: Number,
      default: 50,
    },
    badgeIcon: {
      type: String,
      default: 'zap',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    isOfficial: {
      type: Boolean,
      default: true,
    },
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

export const Challenge = mongoose.model('Challenge', challengeSchema);
