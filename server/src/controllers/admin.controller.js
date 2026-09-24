import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { Quiz } from '../models/Quiz.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { Achievement } from '../models/Achievement.js';
import { Skill } from '../models/Skill.js';
import { Challenge } from '../models/Challenge.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminStats = asyncHandler(async (req, res, next) => {
  const [totalUsers, totalQuests, totalQuizzes, totalCoding, totalAchievements] = await Promise.all([
    User.countDocuments(),
    Quest.countDocuments(),
    Quiz.countDocuments(),
    CodingChallenge.countDocuments(),
    Achievement.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalQuests,
      totalQuizzes,
      totalCoding,
      totalAchievements,
    },
  });
});

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100);
  res.status(200).json({ success: true, data: users });
});

export const createOfficialQuest = asyncHandler(async (req, res, next) => {
  const quest = await Quest.create({
    ...req.body,
    creatorId: req.user.userId,
    isOfficial: true,
    isPublic: true,
  });
  res.status(201).json({ success: true, message: 'Official quest created!', data: quest });
});

export const createQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  res.status(201).json({ success: true, message: 'Quiz created!', data: quiz });
});

export const createCodingChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await CodingChallenge.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  res.status(201).json({ success: true, message: 'Coding challenge created!', data: challenge });
});

export const createAchievement = asyncHandler(async (req, res, next) => {
  const achievement = await Achievement.create(req.body);
  res.status(201).json({ success: true, message: 'Achievement created!', data: achievement });
});

export const createSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, message: 'Skill created!', data: skill });
});

export const createChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  res.status(201).json({ success: true, message: 'Community challenge created!', data: challenge });
});
