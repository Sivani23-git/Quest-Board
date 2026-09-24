import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'quest_completed',
        'achievement_unlocked',
        'level_up',
        'goal_completed',
        'skill_leveled',
        'challenge_completed',
        'quiz_passed',
        'coding_solved',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    referenceModel: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, isPublic: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
