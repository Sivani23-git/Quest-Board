import { Skill } from '../models/Skill.js';
import { UserSkill } from '../models/UserSkill.js';
import { SkillService } from '../services/SkillService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSkills = asyncHandler(async (req, res, next) => {
  const allSkills = await Skill.find().sort({ category: 1, name: 1 });
  const userSkills = await UserSkill.find({ userId: req.user.userId });

  const userSkillMap = {};
  userSkills.forEach((us) => {
    userSkillMap[us.skillId.toString()] = {
      xp: us.xp,
      level: us.level,
      isUnlocked: us.isUnlocked,
    };
  });

  const skillsWithProgress = allSkills.map((skill) => {
    const progress = userSkillMap[skill._id.toString()] || {
      xp: 0,
      level: 1,
      isUnlocked: (skill.prerequisiteSkillIds || []).length === 0, // Root skills unlocked by default
    };

    return {
      ...skill.toObject(),
      userProgress: progress,
    };
  });

  res.status(200).json({ success: true, data: skillsWithProgress });
});

export const unlockSkill = asyncHandler(async (req, res, next) => {
  const userSkill = await SkillService.unlockSkill(req.user.userId, req.params.id);
  res.status(200).json({ success: true, message: 'Skill unlocked!', data: userSkill });
});
