import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Achievement } from '../models/Achievement.js';
import { Quest } from '../models/Quest.js';
import { Quiz } from '../models/Quiz.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { Challenge } from '../models/Challenge.js';
import { seedCodingChallenges } from './seedCodingChallenges.js';

export async function seedDatabase() {
  try {
    const adminExists = await User.findOne({ email: 'admin@questboard.io' });
    let adminUser = adminExists;

    if (!adminExists) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('AdminPass123!', salt);
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@questboard.io',
        passwordHash,
        role: 'admin',
        bio: 'QuestBoard Headmaster and Realm Architect',
        level: 10,
        totalXP: 9500,
        coinBalance: 1200,
      });
      console.log('[Seed] Admin user created: admin@questboard.io / AdminPass123!');
    }

    // 1. Seed Skills
    const skillCount = await Skill.countDocuments();
    let webDevSkill, dsaSkill, reactSkill, nodeSkill;

    if (skillCount === 0) {
      webDevSkill = await Skill.create({
        name: 'Web Fundamentals',
        description: 'Core building blocks: HTML5, CSS3, DOM manipulation, responsive layouts.',
        category: 'programming',
        icon: 'globe',
        color: '#00D4FF',
      });

      reactSkill = await Skill.create({
        name: 'React Ecosystem',
        description: 'Modern component architectures, hooks, state management, and SPAs.',
        category: 'programming',
        icon: 'atom',
        color: '#61DAFB',
        prerequisiteSkillIds: [webDevSkill._id],
      });

      nodeSkill = await Skill.create({
        name: 'Node.js & Backend',
        description: 'REST APIs, authentication, Express, middleware, asynchronous patterns.',
        category: 'programming',
        icon: 'server',
        color: '#22D3A0',
        prerequisiteSkillIds: [webDevSkill._id],
      });

      dsaSkill = await Skill.create({
        name: 'Data Structures & Algorithms',
        description: 'Problem solving, array manipulation, graph algorithms, and time complexity.',
        category: 'programming',
        icon: 'cpu',
        color: '#F59E0B',
      });

      await Skill.create({
        name: 'Productivity & Habits',
        description: 'Daily consistency, time-blocking, deep work rituals, and focus management.',
        category: 'productivity',
        icon: 'zap',
        color: '#8B5CF6',
      });

      console.log('[Seed] Default Skills created.');
    } else {
      webDevSkill = await Skill.findOne({ name: 'Web Fundamentals' });
      reactSkill = await Skill.findOne({ name: 'React Ecosystem' });
      dsaSkill = await Skill.findOne({ name: 'Data Structures & Algorithms' });
      nodeSkill = await Skill.findOne({ name: 'Node.js & Backend' });
    }

    // 2. Seed Quizzes
    let arrayQuiz;
    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      arrayQuiz = await Quiz.create({
        title: 'JavaScript Array Methods Mastery',
        description: 'Test your understanding of map, filter, reduce, and immutability.',
        skillId: webDevSkill?._id || null,
        passingScore: 70,
        timeLimit: 300,
        createdBy: adminUser._id,
        questions: [
          {
            text: 'Which array method returns a brand new array with transformed elements without mutating the original?',
            options: ['forEach()', 'map()', 'push()', 'splice()'],
            correctIndex: 1,
            explanation: 'map() creates a new array populated with the results of calling a provided function on every element in the calling array.',
          },
          {
            text: 'What is the return value of [1, 2, 3, 4].filter(x => x % 2 === 0)?',
            options: ['[1, 3]', '[2, 4]', '[true, false]', '4'],
            correctIndex: 1,
            explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.',
          },
          {
            text: 'What will [1, 2, 3].reduce((acc, curr) => acc + curr, 10) evaluate to?',
            options: ['6', '16', '10', 'undefined'],
            correctIndex: 1,
            explanation: 'With an initial accumulator of 10, adding 1 + 2 + 3 gives 16.',
          },
        ],
      });
      console.log('[Seed] Default Quizzes created.');
    } else {
      arrayQuiz = await Quiz.findOne();
    }

    // 3. Seed Coding Challenges for All Supported Language Learning Paths
    await seedCodingChallenges(adminUser._id);
    const twoSumChallenge = await CodingChallenge.findOne({ title: 'Two Sum with Hash Map', language: 'python' }) ||
      await CodingChallenge.findOne({ language: 'python' });

    // 4. Seed Official Quests
    const questCount = await Quest.countDocuments({ isOfficial: true });
    if (questCount === 0) {
      await Quest.create([
        {
          title: 'Master JavaScript Array Functions',
          description: 'Solidify your knowledge of map, filter, reduce, and immutable array operations by passing the certification quiz.',
          category: 'learning',
          difficulty: 'medium',
          xpReward: 100,
          coinReward: 25,
          associatedSkillId: webDevSkill?._id,
          verificationType: 'quiz',
          quizId: arrayQuiz?._id,
          creatorId: adminUser._id,
          isOfficial: true,
          isPublic: true,
          tags: ['javascript', 'arrays', 'quiz'],
        },
        {
          title: 'Solve the Two Sum Algorithm',
          description: 'Implement an optimal hash map solution to find pair indices summing to the target value and pass all test cases.',
          category: 'coding',
          difficulty: 'easy',
          xpReward: 100,
          coinReward: 25,
          associatedSkillId: dsaSkill?._id,
          verificationType: 'coding',
          codingChallengeId: twoSumChallenge?._id,
          creatorId: adminUser._id,
          isOfficial: true,
          isPublic: true,
          tags: ['dsa', 'algorithms', 'arrays'],
        },
        {
          title: 'Execute 45 Minutes of Deep Coding Practice',
          description: 'Focus with zero social media or messaging tabs open. Build meaningful code on your portfolio project.',
          category: 'productivity',
          difficulty: 'medium',
          xpReward: 100,
          coinReward: 25,
          verificationType: 'self',
          creatorId: adminUser._id,
          isOfficial: true,
          isPublic: true,
          tags: ['deep-work', 'habit', 'focus'],
        },
        {
          title: 'Architect a Clean Express REST API',
          description: 'Design modular route controllers, middleware verification, and Mongoose document models with error handling.',
          category: 'coding',
          difficulty: 'hard',
          xpReward: 200,
          coinReward: 50,
          associatedSkillId: nodeSkill?._id,
          verificationType: 'self',
          creatorId: adminUser._id,
          isOfficial: true,
          isPublic: true,
          tags: ['backend', 'express', 'architecture'],
        },
      ]);
      console.log('[Seed] Official Quests created.');
    }

    // 5. Seed Achievements
    const achCount = await Achievement.countDocuments();
    if (achCount === 0) {
      await Achievement.create([
        {
          name: 'First Steps',
          description: 'Complete your first quest in the realm of QuestBoard.',
          icon: 'footprints',
          rarity: 'common',
          xpReward: 50,
          coinReward: 15,
          requirements: { type: 'quest_count', threshold: 1 },
        },
        {
          name: 'Consistent Adept',
          description: 'Maintain a 3-day active streak.',
          icon: 'flame',
          rarity: 'rare',
          xpReward: 150,
          coinReward: 35,
          requirements: { type: 'streak', threshold: 3 },
        },
        {
          name: 'Warrior of Productivity',
          description: 'Complete 10 verified quests.',
          icon: 'shield',
          rarity: 'epic',
          xpReward: 300,
          coinReward: 75,
          requirements: { type: 'quest_count', threshold: 10 },
        },
        {
          name: 'Code Slayer',
          description: 'Solve 5 programming sandbox challenges.',
          icon: 'terminal',
          rarity: 'epic',
          xpReward: 350,
          coinReward: 80,
          requirements: { type: 'coding_count', threshold: 5 },
        },
        {
          name: 'Legendary Master',
          description: 'Ascend to Level 5 and beyond.',
          icon: 'crown',
          rarity: 'legendary',
          xpReward: 500,
          coinReward: 150,
          requirements: { type: 'level', threshold: 5 },
        },
      ]);
      console.log('[Seed] Default Achievements created.');
    }

    // 6. Seed Challenges
    const chalCount = await Challenge.countDocuments();
    if (chalCount === 0) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await Challenge.create({
        title: 'Weekly Quest Sprint',
        description: 'Complete 5 verified quests before the weekly reset to earn the Champion badge.',
        type: 'quest_count',
        requirement: { target: 5 },
        xpReward: 300,
        coinReward: 75,
        startDate: now,
        endDate: nextWeek,
        isOfficial: true,
        createdBy: adminUser._id,
      });
      console.log('[Seed] Weekly Community Challenge created.');
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
}
