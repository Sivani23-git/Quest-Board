import { Reward } from '../models/Reward.js';
import { CoinTransaction } from '../models/CoinTransaction.js';
import { CoinService } from '../services/CoinService.js';
import { NotificationService } from '../services/NotificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getRewards = asyncHandler(async (req, res, next) => {
  const rewards = await Reward.find({ userId: req.user.userId, isActive: true }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, data: rewards });
});

export const createReward = asyncHandler(async (req, res, next) => {
  const { title, description, coinCost, icon } = req.body;
  const reward = await Reward.create({
    userId: req.user.userId,
    title,
    description,
    coinCost,
    icon: icon || 'gift',
  });
  res.status(201).json({ success: true, message: 'Reward created!', data: reward });
});

export const redeemReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!reward) {
    return next(new AppError('Reward not found', 404));
  }

  // Deduct coins atomically via CoinService
  const deductResult = await CoinService.deduct(
    req.user.userId,
    reward.coinCost,
    'reward_redemption',
    reward._id,
    `Redeemed Reward: ${reward.title}`
  );

  reward.timesRedeemed = (reward.timesRedeemed || 0) + 1;
  await reward.save();

  await NotificationService.create(req.user.userId, {
    type: 'reward_redeemed',
    title: `Reward Redeemed: ${reward.title}`,
    message: `You spent ${reward.coinCost} coins to treat yourself to "${reward.title}". Enjoy!`,
    referenceId: reward._id,
    referenceModel: 'Reward',
  });

  res.status(200).json({
    success: true,
    message: `Successfully redeemed "${reward.title}"! Enjoy your reward.`,
    data: {
      reward,
      coinBalance: deductResult.coinBalance,
    },
  });
});

export const deleteReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  if (!reward) {
    return next(new AppError('Reward not found', 404));
  }
  res.status(200).json({ success: true, message: 'Reward deleted.' });
});

export const getCoinTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await CoinTransaction.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .limit(50);
  res.status(200).json({ success: true, data: transactions });
});
