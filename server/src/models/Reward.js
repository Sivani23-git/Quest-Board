import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true,
      maxlength: [80, 'Reward title cannot exceed 80 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    coinCost: {
      type: Number,
      required: [true, 'Coin cost is required'],
      min: [1, 'Coin cost must be at least 1 coin'],
    },
    icon: {
      type: String,
      default: 'gift',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timesRedeemed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Reward = mongoose.model('Reward', rewardSchema);
