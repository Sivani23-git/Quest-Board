import mongoose from 'mongoose';

const goalQuestItemSchema = new mongoose.Schema({
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  prerequisiteQuestIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
    },
  ],
});

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'Goal title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'learning',
    },
    targetDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    questline: [goalQuestItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model('Goal', goalSchema);
