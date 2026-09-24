import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['programming', 'soft-skill', 'productivity', 'design', 'other'],
      default: 'programming',
    },
    icon: {
      type: String,
      default: 'code', // icon identifier
    },
    color: {
      type: String,
      default: '#6C63FF',
    },
    prerequisiteSkillIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model('Skill', skillSchema);
