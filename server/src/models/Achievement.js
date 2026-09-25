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
    category: {
      type: String,
      enum: ['quests', 'coding', 'academy', 'quizzes', 'streak', 'level', 'skills', 'special'],
      default: 'quests',
      index: true,
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
          'coding_languages',
          'academy_stage',
          'academy_full_path',
          'academy_languages_active',
          'quiz_count',
          'quiz_perfect',
          'skill_level_any',
          'skills_multi_level',
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
