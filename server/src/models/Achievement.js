import mongoose from 'mongoose';
import { ACHIEVEMENT_RARITIES } from '../config/constants.js';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'trophy',
    },
    rarity: {
      type: String,
      enum: ACHIEVEMENT_RARITIES,
      default: 'common',
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    coinReward: {
      type: Number,
      default: 25,
    },
    requirements: {
      type: {
        type: String,
        enum: [
          'quest_count',
          'streak',
          'level',
          'xp_total',
          'coding_count',
          'quiz_count',
          'skill_level',
          'coins_spent',
          'quest_in_day',
        ],
        required: true,
      },
      threshold: {
        type: Number,
        required: true,
      },
      skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        default: null,
      },
      category: {
        type: String,
        default: null,
      },
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
