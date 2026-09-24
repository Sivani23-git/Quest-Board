import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [(val) => val.length >= 2 && val.length <= 4, 'Must provide 2 to 4 options'],
  },
  correctIndex: {
    type: Number,
    required: true,
    select: false, // Security: never send correct answer index in default queries
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      default: null,
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      default: 70, // percentage
      min: 1,
      max: 100,
    },
    timeLimit: {
      type: Number, // In seconds (optional)
      default: null,
    },
    maxAttempts: {
      type: Number,
      default: 3,
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

export const Quiz = mongoose.model('Quiz', quizSchema);
