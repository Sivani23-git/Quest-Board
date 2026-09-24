import { Goal } from '../models/Goal.js';
import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getGoals = asyncHandler(async (req, res, next) => {
  const goals = await Goal.find({ userId: req.user.userId })
    .populate('questline.questId')
    .sort({ createdAt: -1 });

  // Compute live progress percentage for each goal
  const userQuests = await Quest.find({ creatorId: req.user.userId });
  const officialProgress = await UserQuestProgress.find({ userId: req.user.userId });

  const completedQuestIds = new Set([
    ...userQuests.filter((q) => q.status === 'completed').map((q) => q._id.toString()),
    ...officialProgress.filter((p) => p.status === 'completed').map((p) => p.questId.toString()),
  ]);

  const goalsWithProgress = goals.map((goal) => {
    const total = goal.questline.length;
    if (total === 0) {
      return { ...goal.toObject(), progress: 0, completedCount: 0, totalCount: 0 };
    }

    const completedCount = goal.questline.filter(
      (item) => item.questId && completedQuestIds.has(item.questId._id.toString())
    ).length;

    const progress = Math.round((completedCount / total) * 100);

    return {
      ...goal.toObject(),
      progress,
      completedCount,
      totalCount: total,
    };
  });

  res.status(200).json({ success: true, data: goalsWithProgress });
});

export const createGoal = asyncHandler(async (req, res, next) => {
  const { title, description, category, targetDate, questIds = [] } = req.body;

  const questline = questIds.map((questId, index) => ({
    questId,
    order: index,
  }));

  const goal = await Goal.create({
    userId: req.user.userId,
    title,
    description,
    category: category || 'learning',
    targetDate: targetDate || null,
    questline,
  });

  res.status(201).json({ success: true, message: 'Goal created!', data: goal });
});

export const getGoalById = asyncHandler(async (req, res, next) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.userId }).populate(
    'questline.questId'
  );

  if (!goal) {
    return next(new AppError('Goal not found', 404));
  }

  res.status(200).json({ success: true, data: goal });
});

export const updateGoal = asyncHandler(async (req, res, next) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );

  if (!goal) {
    return next(new AppError('Goal not found', 404));
  }

  res.status(200).json({ success: true, message: 'Goal updated!', data: goal });
});

export const deleteGoal = asyncHandler(async (req, res, next) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  if (!goal) {
    return next(new AppError('Goal not found', 404));
  }
  res.status(200).json({ success: true, message: 'Goal deleted.' });
});
