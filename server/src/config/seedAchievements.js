import { Achievement } from '../models/Achievement.js';

export const achievementCatalog = [
  // 1. QUEST MASTERY
  {
    name: 'First Steps',
    description: 'Complete your first verified quest in the realm of QuestBoard.',
    category: 'quests',
    rarity: 'common',
    icon: 'footprints',
    xpReward: 50,
    coinReward: 15,
    requirements: { type: 'quest_count', threshold: 1 },
  },
  {
    name: 'Quest Adventurer',
    description: 'Complete 5 verified quests across your journey.',
    category: 'quests',
    rarity: 'rare',
    icon: 'compass',
    xpReward: 150,
    coinReward: 40,
    requirements: { type: 'quest_count', threshold: 5 },
  },
  {
    name: 'Warrior of Productivity',
    description: 'Complete 10 verified quests with unwavering dedication.',
    category: 'quests',
    rarity: 'epic',
    icon: 'shield',
    xpReward: 300,
    coinReward: 75,
    requirements: { type: 'quest_count', threshold: 10 },
  },
  {
    name: 'Quest Master',
    description: 'Complete 25 verified quests and establish your legendary status.',
    category: 'quests',
    rarity: 'legendary',
    icon: 'crown',
    xpReward: 600,
    coinReward: 150,
    requirements: { type: 'quest_count', threshold: 25 },
  },

  // 2. CODING (SANDBOX)
  {
    name: 'First Code',
    description: 'Successfully complete your first coding challenge in the sandbox.',
    category: 'coding',
    rarity: 'common',
    icon: 'code',
    xpReward: 75,
    coinReward: 20,
    requirements: { type: 'coding_count', threshold: 1 },
  },
  {
    name: 'Code Slayer',
    description: 'Solve 5 programming sandbox challenges with passing test suites.',
    category: 'coding',
    rarity: 'rare',
    icon: 'terminal',
    xpReward: 200,
    coinReward: 50,
    requirements: { type: 'coding_count', threshold: 5 },
  },
  {
    name: 'Code Warrior',
    description: 'Solve 25 programming sandbox challenges.',
    category: 'coding',
    rarity: 'epic',
    icon: 'sword',
    xpReward: 500,
    coinReward: 120,
    requirements: { type: 'coding_count', threshold: 25 },
  },
  {
    name: 'Polyglot',
    description: 'Successfully solve challenges in at least 3 different programming languages.',
    category: 'coding',
    rarity: 'legendary',
    icon: 'globe',
    xpReward: 550,
    coinReward: 140,
    requirements: { type: 'coding_languages', threshold: 3 },
  },

  // 3. CODING ACADEMY
  {
    name: 'Language Apprentice',
    description: 'Complete the first stage of any coding language learning path.',
    category: 'academy',
    rarity: 'common',
    icon: 'book-open',
    xpReward: 100,
    coinReward: 25,
    requirements: { type: 'academy_stage', threshold: 1 },
  },
  {
    name: 'Language Master',
    description: 'Complete an entire language learning path across all curriculum stages.',
    category: 'academy',
    rarity: 'legendary',
    icon: 'sparkles',
    xpReward: 600,
    coinReward: 150,
    requirements: { type: 'academy_full_path', threshold: 1 },
  },
  {
    name: 'Polyglot Adventurer',
    description: 'Make meaningful progress in at least 3 distinct language paths.',
    category: 'academy',
    rarity: 'epic',
    icon: 'award',
    xpReward: 450,
    coinReward: 100,
    requirements: { type: 'academy_languages_active', threshold: 3 },
  },

  // 4. QUIZZES
  {
    name: 'Knowledge Seeker',
    description: 'Pass your first server-evaluated Knowledge Trial.',
    category: 'quizzes',
    rarity: 'common',
    icon: 'help-circle',
    xpReward: 75,
    coinReward: 20,
    requirements: { type: 'quiz_count', threshold: 1 },
  },
  {
    name: 'Quiz Master',
    description: 'Pass 10 Knowledge Quizzes to prove your technical depth.',
    category: 'quizzes',
    rarity: 'epic',
    icon: 'zap',
    xpReward: 350,
    coinReward: 80,
    requirements: { type: 'quiz_count', threshold: 10 },
  },
  {
    name: 'Perfect Trial',
    description: 'Score a flawless 100% on any technical Knowledge Trial.',
    category: 'quizzes',
    rarity: 'rare',
    icon: 'target',
    xpReward: 200,
    coinReward: 50,
    requirements: { type: 'quiz_perfect', threshold: 1 },
  },

  // 5. STREAK
  {
    name: 'Consistent Adept',
    description: 'Maintain a 3-day active productivity streak.',
    category: 'streak',
    rarity: 'rare',
    icon: 'flame',
    xpReward: 150,
    coinReward: 35,
    requirements: { type: 'streak', threshold: 3 },
  },
  {
    name: 'Dedicated Adventurer',
    description: 'Maintain a 7-day active productivity streak.',
    category: 'streak',
    rarity: 'epic',
    icon: 'calendar',
    xpReward: 350,
    coinReward: 80,
    requirements: { type: 'streak', threshold: 7 },
  },
  {
    name: 'Unstoppable',
    description: 'Maintain a 30-day active productivity streak.',
    category: 'streak',
    rarity: 'legendary',
    icon: 'sun',
    xpReward: 1000,
    coinReward: 250,
    requirements: { type: 'streak', threshold: 30 },
  },

  // 6. LEVEL
  {
    name: 'Level Up',
    description: 'Ascend to Level 2 in QuestBoard.',
    category: 'level',
    rarity: 'common',
    icon: 'trending-up',
    xpReward: 50,
    coinReward: 15,
    requirements: { type: 'level', threshold: 2 },
  },
  {
    name: 'Veteran Adventurer',
    description: 'Ascend to Level 5 and prove your dedication.',
    category: 'level',
    rarity: 'rare',
    icon: 'shield-check',
    xpReward: 250,
    coinReward: 60,
    requirements: { type: 'level', threshold: 5 },
  },
  {
    name: 'Legendary Master',
    description: 'Ascend to Level 10 and claim mastery of the realm.',
    category: 'level',
    rarity: 'legendary',
    icon: 'crown',
    xpReward: 500,
    coinReward: 150,
    requirements: { type: 'level', threshold: 10 },
  },

  // 7. SKILLS
  {
    name: 'Skill Apprentice',
    description: 'Reach Level 2 in any skill on your Character Skill Map.',
    category: 'skills',
    rarity: 'common',
    icon: 'cpu',
    xpReward: 100,
    coinReward: 25,
    requirements: { type: 'skill_level_any', threshold: 2 },
  },
  {
    name: 'Skill Specialist',
    description: 'Reach Level 5 in any skill through consistent practice.',
    category: 'skills',
    rarity: 'epic',
    icon: 'layers',
    xpReward: 400,
    coinReward: 100,
    requirements: { type: 'skill_level_any', threshold: 5 },
  },
  {
    name: 'Master of Many',
    description: 'Reach Level 3 or higher in 3 different skills.',
    category: 'skills',
    rarity: 'legendary',
    icon: 'star',
    xpReward: 600,
    coinReward: 150,
    requirements: { type: 'skills_multi_level', threshold: 3 },
  },
];

export async function seedAchievements() {
  try {
    console.log(`[Seed Achievements] Syncing ${achievementCatalog.length} curated achievements...`);

    for (const achData of achievementCatalog) {
      await Achievement.findOneAndUpdate(
        { name: achData.name },
        {
          $set: {
            ...achData,
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const count = await Achievement.countDocuments();
    console.log(`[Seed Achievements] Successfully synced ${count} achievements.`);
    return count;
  } catch (error) {
    console.error('[Seed Achievements Error]:', error.message);
    throw error;
  }
}
