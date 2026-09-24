import { Quest } from '../models/Quest.js';
import { UserSkill } from '../models/UserSkill.js';
import { Goal } from '../models/Goal.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';

export class RecommendationService {
  /**
   * Generates rule-based quest recommendations without AI API overhead.
   */
  static async getRecommendations(userId, limit = 6) {
    // 1. Fetch user's completed quest IDs
    const completedProgress = await UserQuestProgress.find({
      userId,
      status: 'completed',
    }).select('questId');
    const completedIds = completedProgress.map((p) => p.questId);

    // 2. Fetch user's weak or in-progress skills
    const userSkills = await UserSkill.find({ userId }).sort({ level: 1 }).limit(3);
    const weakSkillIds = userSkills.map((s) => s.skillId);

    // 3. Fetch user's active goals
    const activeGoals = await Goal.find({ userId, status: 'active' }).select('_id');
    const activeGoalIds = activeGoals.map((g) => g._id);

    // 4. Find candidate quests
    const candidateQuests = await Quest.find({
      _id: { $nin: completedIds },
      status: { $ne: 'completed' },
      $or: [
        { isOfficial: true },
        { creatorId: userId },
      ],
    })
      .populate('associatedSkillId', 'name icon color')
      .limit(30);

    // 5. Score candidate quests based on match criteria
    const scoredQuests = candidateQuests.map((quest) => {
      let score = 0;

      // Bonus for addressing weak skills
      if (quest.associatedSkillId && weakSkillIds.some((id) => id.equals(quest.associatedSkillId._id))) {
        score += 30;
      }

      // Bonus for contributing to active goal
      if (quest.associatedGoalId && activeGoalIds.some((id) => id.equals(quest.associatedGoalId))) {
        score += 25;
      }

      // Bonus for official curated quests
      if (quest.isOfficial) {
        score += 15;
      }

      // Slight difficulty balancing
      if (quest.difficulty === 'medium' || quest.difficulty === 'easy') {
        score += 10;
      }

      return { quest, score };
    });

    // Sort by score descending and return top matches
    return scoredQuests
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.quest);
  }
}
