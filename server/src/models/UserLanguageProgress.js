import mongoose from 'mongoose';

const userLanguageProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: ['python', 'java', 'javascript', 'cpp'],
      required: true,
      index: true,
    },
    currentStage: {
      type: Number,
      default: 1,
      min: 1,
    },
    completedChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingChallenge',
      },
    ],
    languageXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    languageLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userLanguageProgressSchema.index({ userId: 1, language: 1 }, { unique: true });

export const UserLanguageProgress = mongoose.model('UserLanguageProgress', userLanguageProgressSchema);
