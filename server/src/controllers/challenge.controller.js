import { Challenge } from '../models/Challenge.js';
import { ChallengeParticipation } from '../models/ChallengeParticipation.js';
import { ChallengeService } from '../services/ChallengeService.js';
import { seedChallenges } from '../config/seedChallenges.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getChallenges = asyncHandler(async (req, res, next) => {
  let challenges = await Challenge.find().sort({ startDate: 1, endDate: 1 });
  
  if (challenges.length < 6) {
    await seedChallenges();
    challenges = await Challenge.find().sort({ startDate: 1, endDate: 1 });
  }

  // Evaluate user challenges to update real progress and award completed rewards
  const partMap = await ChallengeService.evaluateUserChallenges(req.user.userId);
  const now = new Date();

  const formatted = await Promise.all(
    challenges.map(async (c) => {
      const part = partMap[c._id.toString()];
      const isJoined = Boolean(part);
      
      // Compute user real progress
      let progress = 0;
      if (part) {
        progress = part.currentProgress;
      } else {
        progress = await ChallengeService.calculateProgress(req.user.userId, c);
      }

      const startDate = new Date(c.startDate);
      const endDate = new Date(c.endDate);
      const isActive = now >= startDate && now <= endDate;
      const isUpcoming = now < startDate;
      const isExpired = now > endDate;

      return {
        ...c.toObject(),
        isJoined,
        currentProgress: progress,
        isCompleted: part ? part.isCompleted : false,
        completedAt: part ? part.completedAt : null,
        isActive,
        isUpcoming,
        isExpired,
      };
    })
  );

  res.status(200).json({ success: true, data: formatted });
});

export const joinChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) {
    return next(new AppError('Challenge not found', 404));
  }

  const initialProgress = await ChallengeService.calculateProgress(req.user.userId, challenge);

  const participation = await ChallengeParticipation.findOneAndUpdate(
    { userId: req.user.userId, challengeId: challenge._id },
    {
      $setOnInsert: {
        currentProgress: initialProgress,
        isCompleted: false,
        xpAwarded: false,
        joinedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  // Trigger evaluation
  await ChallengeService.evaluateUserChallenges(req.user.userId);

  res.status(200).json({ success: true, message: 'Joined challenge!', data: participation });
});
