import Joi from 'joi';
import { QUEST_CATEGORIES, VERIFICATION_TYPES } from '../config/constants.js';

export const createQuestSchema = Joi.object({
  title: Joi.string().trim().max(120).required(),
  description: Joi.string().trim().max(2000).required(),
  category: Joi.string().valid(...QUEST_CATEGORIES).default('productivity'),
  difficulty: Joi.string().valid('easy', 'medium', 'hard', 'epic', 'legendary').default('medium'),
  associatedSkillId: Joi.string().hex().length(24).allow(null, ''),
  associatedGoalId: Joi.string().hex().length(24).allow(null, ''),
  deadline: Joi.date().iso().allow(null),
  verificationType: Joi.string().valid(...VERIFICATION_TYPES).default('self'),
  quizId: Joi.string().hex().length(24).allow(null, ''),
  codingChallengeId: Joi.string().hex().length(24).allow(null, ''),
  tags: Joi.array().items(Joi.string().trim()).default([]),
});

export const completeQuestSchema = Joi.object({
  quizAttemptId: Joi.string().hex().length(24).allow(null, ''),
  submissionId: Joi.string().hex().length(24).allow(null, ''),
});
