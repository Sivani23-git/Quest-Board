import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { QuestService } from '../services/QuestService.js';
import { RecommendationService } from '../services/RecommendationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getQuests = asyncHandler(async (req, res, next) => {
  const { status, category, difficulty, search } = req.query;
  const userId = req.user.userId;

  const query = {
    $or: [
      { creatorId: userId, isOfficial: false },
      { isOfficial: true },
    ],
  };

  if (status) query.status = status;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const quests = await Quest.find(query)
    .populate('associatedSkillId', 'name icon color')
    .populate('associatedGoalId', 'title')
    .sort({ createdAt: -1 });

  // Get user's official quest progress map
  const officialProgress = await UserQuestProgress.find({ userId });
  const progressMap = {};
  officialProgress.forEach((p) => {
    progressMap[p.questId.toString()] = p.status;
  });

  const formattedQuests = quests.map((q) => {
    const obj = q.toObject();
    if (q.isOfficial) {
      obj.userStatus = progressMap[q._id.toString()] || 'todo';
    } else {
      obj.userStatus = q.status;
    }
    return obj;
  });

  res.status(200).json({
    success: true,
    data: formattedQuests,
    count: formattedQuests.length,
  });
});

export const getOfficialQuests = asyncHandler(async (req, res, next) => {
  const quests = await Quest.find({ isOfficial: true })
    .populate('associatedSkillId', 'name icon color')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: quests,
  });
});

export const getQuestById = asyncHandler(async (req, res, next) => {
  const quest = await Quest.findById(req.params.id)
    .populate('associatedSkillId', 'name icon color')
    .populate('associatedGoalId', 'title')
    .populate('quizId', 'title description passingScore timeLimit questions')
    .populate('codingChallengeId', 'title description difficulty starterCode examples constraints');

  if (!quest) {
    return next(new AppError('Quest not found', 404));
  }

  res.status(200).json({
    success: true,
    data: quest,
  });
});

export const createQuest = asyncHandler(async (req, res, next) => {
  const questData = {
    ...req.body,
    creatorId: req.user.userId,
    isOfficial: false,
  };

  const quest = await Quest.create(questData);

  res.status(201).json({
    success: true,
    message: 'Quest created successfully.',
    data: quest,
  });
});

export const updateQuest = asyncHandler(async (req, res, next) => {
  const quest = await Quest.findOne({ _id: req.params.id, creatorId: req.user.userId });
  if (!quest) {
    return next(new AppError('Quest not found or you do not have permission to edit it.', 404));
  }

  Object.assign(quest, req.body);
  await quest.save();

  res.status(200).json({
    success: true,
    message: 'Quest updated successfully.',
    data: quest,
  });
});

export const deleteQuest = asyncHandler(async (req, res, next) => {
  const quest = await Quest.findOneAndDelete({ _id: req.params.id, creatorId: req.user.userId });
  if (!quest) {
    return next(new AppError('Quest not found or you do not have permission to delete it.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Quest deleted successfully.',
  });
});

export const completeQuest = asyncHandler(async (req, res, next) => {
  const result = await QuestService.completeQuest(req.user.userId, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: `Quest completed! Earned +${result.xpAwarded} XP and +${result.coinAwarded} Coins.`,
    data: result,
  });
});

export const getRecommendations = asyncHandler(async (req, res, next) => {
  const recommendations = await RecommendationService.getRecommendations(req.user.userId, 6);

  res.status(200).json({
    success: true,
    data: recommendations,
  });
});
