import mongoose from 'mongoose';

const coinTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true, // Positive for earned, negative for spent
    },
    type: {
      type: String,
      enum: ['earned', 'spent'],
      required: true,
    },
    source: {
      type: String,
      enum: ['quest', 'achievement', 'challenge', 'coding', 'quiz', 'reward_redemption', 'admin'],
      required: true,
      index: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

coinTransactionSchema.index({ userId: 1, createdAt: -1 });

export const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema);
