import mongoose from 'mongoose';

const xpTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'XP amount must be positive'],
    },
    source: {
      type: String,
      enum: ['quest', 'achievement', 'quiz', 'coding', 'challenge', 'streak_bonus', 'admin'],
      required: true,
      index: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    referenceModel: {
      type: String,
      enum: ['Quest', 'Achievement', 'Quiz', 'CodingChallenge', 'Challenge', null],
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index for idempotency: prevents awarding XP twice for the exact same event
xpTransactionSchema.index({ userId: 1, referenceId: 1, source: 1 }, { unique: true, sparse: true });
xpTransactionSchema.index({ userId: 1, createdAt: -1 });

export const XPTransaction = mongoose.model('XPTransaction', xpTransactionSchema);
