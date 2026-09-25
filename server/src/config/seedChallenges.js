import { Challenge } from '../models/Challenge.js';
import { User } from '../models/User.js';

export async function seedChallenges(adminId = null) {
  try {
    let admin = null;
    if (adminId) {
      admin = await User.findById(adminId);
    }
    if (!admin) {
      admin = (await User.findOne({ role: 'admin' })) || (await User.findOne({ email: 'admin@questboard.io' })) || (await User.findOne());
    }
    if (!admin) {
      console.warn('[Seed Challenges] No user found to assign as challenge creator.');
      return;
    }

    const now = new Date();
    const pastOneHour = new Date(now.getTime() - 60 * 60 * 1000);
    const day = 24 * 60 * 60 * 1000;

    const curatedChallenges = [
      // 1. ACTIVE SPRINT: Weekly Quest Sprint
      {
        title: 'Weekly Quest Sprint',
        description: 'Complete 5 verified quests before the weekly reset to earn the Champion badge.',
        type: 'quest_count',
        category: 'Quests',
        requirement: { target: 5 },
        xpReward: 300,
        coinReward: 75,
        badgeIcon: 'zap',
        badgeName: 'Champion',
        startDate: pastOneHour,
        endDate: new Date(now.getTime() + 7 * day),
        isOfficial: true,
      },
      // 2. ACTIVE SPRINT: Code Rush
      {
        title: 'Code Rush',
        description: 'Solve 5 programming challenges in Coding Academy across any language learning journey.',
        type: 'coding_count',
        category: 'Coding',
        requirement: { target: 5 },
        xpReward: 250,
        coinReward: 60,
        badgeIcon: 'code',
        badgeName: 'Algorithm Master',
        startDate: pastOneHour,
        endDate: new Date(now.getTime() + 7 * day),
        isOfficial: true,
      },
      // 3. ACTIVE SPRINT: Knowledge Master
      {
        title: 'Knowledge Master',
        description: 'Pass 3 Knowledge Quiz trials and prove your technical mastery.',
        type: 'quiz_count',
        category: 'Quizzes',
        requirement: { target: 3 },
        xpReward: 200,
        coinReward: 50,
        badgeIcon: 'book-open',
        badgeName: 'Scholar',
        startDate: pastOneHour,
        endDate: new Date(now.getTime() + 7 * day),
        isOfficial: true,
      },
      // 4. UPCOMING SPRINT: Streak Warrior
      {
        title: 'Streak Warrior',
        description: 'Maintain an active QuestBoard streak for 7 consecutive days through continuous questing and learning.',
        type: 'streak',
        category: 'Streak',
        requirement: { target: 7 },
        xpReward: 250,
        coinReward: 50,
        badgeIcon: 'flame',
        badgeName: 'Streak Titan',
        startDate: new Date(now.getTime() + 3 * day),
        endDate: new Date(now.getTime() + 10 * day),
        isOfficial: true,
      },
      // 5. UPCOMING SPRINT: XP Hunter
      {
        title: 'XP Hunter',
        description: 'Earn 500 XP through verified activities across QuestBoard.',
        type: 'xp_total',
        category: 'XP',
        requirement: { target: 500 },
        xpReward: 350,
        coinReward: 75,
        badgeIcon: 'zap',
        badgeName: 'XP Vanguard',
        startDate: new Date(now.getTime() + 5 * day),
        endDate: new Date(now.getTime() + 12 * day),
        isOfficial: true,
      },
      // 6. UPCOMING SPRINT: Quest Explorer
      {
        title: 'Quest Explorer',
        description: 'Complete verified quests across 3 different categories.',
        type: 'quest_categories',
        category: 'Exploration',
        requirement: { target: 3 },
        xpReward: 225,
        coinReward: 50,
        badgeIcon: 'compass',
        badgeName: 'Wayfarer',
        startDate: new Date(now.getTime() + 7 * day),
        endDate: new Date(now.getTime() + 14 * day),
        isOfficial: true,
      },
    ];

    for (const c of curatedChallenges) {
      await Challenge.findOneAndUpdate(
        { title: c.title },
        {
          $set: {
            ...c,
            createdBy: admin._id,
          },
        },
        { upsert: true, new: true }
      );
    }

    console.log(`[Seed Challenges] Successfully synced ${curatedChallenges.length} Community Challenges.`);
  } catch (error) {
    console.error('[Seed Challenges] Error seeding community challenges:', error.message);
  }
}
