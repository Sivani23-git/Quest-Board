import { UserSkill } from '../models/UserSkill.js';
import { Skill } from '../models/Skill.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';

const SKILL_LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export function calculateSkillLevel(xp = 0) {
  for (let i = SKILL_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= SKILL_LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export class SkillService {
  /**
   * Adds skill XP and levels up the user's skill progress.
   */
  static async addSkillXP(userId, skillId, questXP) {
    if (!skillId) return null;

    const skill = await Skill.findById(skillId);
    if (!skill) return null;

    const skillXPAmount = Math.round(questXP * 0.5); // 50% of quest XP awards to skill

    let userSkill = await UserSkill.findOne({ userId, skillId });
    if (!userSkill) {
      userSkill = await UserSkill.create({
        userId,
        skillId,
        xp: 0,
        level: 1,
        isUnlocked: true,
        unlockedAt: new Date(),
      });
    }

    const previousLevel = userSkill.level;
    userSkill.xp += skillXPAmount;
    userSkill.isUnlocked = true;

    const newLevel = calculateSkillLevel(userSkill.xp);
    let leveledUp = false;

    if (newLevel > previousLevel) {
      userSkill.level = newLevel;
      leveledUp = true;

      await NotificationService.create(userId, {
        type: 'achievement_unlocked',
        title: `Skill Level Up: ${skill.name}`,
        message: `Your skill in ${skill.name} reached Level ${newLevel}!`,
        referenceId: skill._id,
        referenceModel: 'Skill',
      });

      await ActivityService.log(userId, {
        type: 'skill_leveled',
        title: `Advanced ${skill.name} to Level ${newLevel}`,
        referenceId: skill._id,
        referenceModel: 'Skill',
        metadata: { skillName: skill.name, level: newLevel },
      });
    }

    await userSkill.save();

    return {
      skillId,
      skillName: skill.name,
      xpAdded: skillXPAmount,
      totalSkillXP: userSkill.xp,
      level: userSkill.level,
      leveledUp,
    };
  }

  /**
   * Unlocks a skill if prerequisites are met.
   */
  static async unlockSkill(userId, skillId) {
    const skill = await Skill.findById(skillId);
    if (!skill) throw new Error('Skill not found');

    // Check prerequisites
    if (skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0) {
      const unlockedPrereqs = await UserSkill.countDocuments({
        userId,
        skillId: { $in: skill.prerequisiteSkillIds },
        isUnlocked: true,
      });

      if (unlockedPrereqs < skill.prerequisiteSkillIds.length) {
        throw new Error('Prerequisite skills have not been unlocked yet.');
      }
    }

    const userSkill = await UserSkill.findOneAndUpdate(
      { userId, skillId },
      { $set: { isUnlocked: true, unlockedAt: new Date() } },
      { upsert: true, new: true }
    );

    return userSkill;
  }
}
