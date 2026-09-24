import { Challenge } from '../models/Challenge.js';
import { ChallengeParticipation } from '../models/ChallengeParticipation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getChallenges = asyncHandler(async (req, res, next) => {
  const challenges = await Challenge.find().sort({ endDate: 1 });
  const participations = await ChallengeParticipation.find({ userId: req.user.userId });

  const partMap = {};
  participations.forEach((p) => {
    partMap[p.challengeId.toString()] = p;
  });

  const formatted = challenges.map((c) => {
    const part = partMap[c._id.toString()];
    return {
      ...c.toObject(),
      isJoined: Boolean(part),
      currentProgress: part ? part.currentProgress : 0,
      isCompleted: part ? part.isCompleted : false,
    };
  });

  res.status(200).json({ success: true, data: formatted });
});

export const joinChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) {
    return next(new AppError('Challenge not found', 404));
  }

  const participation = await ChallengeParticipation.findOneAndUpdate(
    { userId: req.user.userId, challengeId: challenge._id },
    { $setOnInsert: { currentProgress: 0, isCompleted: false, joinedAt: new Date() } },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, message: 'Joined challenge!', data: participation });
});
