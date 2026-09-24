import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLevelProgress } from '../utils/levelUtils.js';

const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new AppError('An account with this email address already exists.', 409));
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new AppError('This username is already taken. Please choose another.', 409));
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Welcome to QuestBoard!',
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      totalXP: user.totalXP,
      coinBalance: user.coinBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      progress: getLevelProgress(user.totalXP),
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = signToken(user);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      totalXP: user.totalXP,
      coinBalance: user.coinBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      progress: getLevelProgress(user.totalXP),
    },
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new AppError('User account not found.', 404));
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      level: user.level,
      totalXP: user.totalXP,
      coinBalance: user.coinBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      isPublic: user.isPublic,
      isOptedOutLeaderboard: user.isOptedOutLeaderboard,
      progress: getLevelProgress(user.totalXP),
    },
  });
});
