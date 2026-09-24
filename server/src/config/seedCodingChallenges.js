import { CodingChallenge } from '../models/CodingChallenge.js';
import { pythonChallenges } from './challenges/pythonChallenges.js';
import { javascriptChallenges } from './challenges/javascriptChallenges.js';
import { javaChallenges } from './challenges/javaChallenges.js';
import { cppChallenges } from './challenges/cppChallenges.js';

export async function seedCodingChallenges(adminUserId) {
  try {
    const allLanguageChallenges = [
      ...pythonChallenges,
      ...javascriptChallenges,
      ...javaChallenges,
      ...cppChallenges,
    ];

    console.log(`[Seed Coding] Preparing ${allLanguageChallenges.length} language learning challenges...`);

    for (const challengeData of allLanguageChallenges) {
      await CodingChallenge.findOneAndUpdate(
        {
          title: challengeData.title,
          language: challengeData.language,
        },
        {
          $set: {
            ...challengeData,
            createdBy: adminUserId,
            isOfficial: true,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const counts = {
      python: await CodingChallenge.countDocuments({ language: 'python' }),
      javascript: await CodingChallenge.countDocuments({ language: 'javascript' }),
      java: await CodingChallenge.countDocuments({ language: 'java' }),
      cpp: await CodingChallenge.countDocuments({ language: 'cpp' }),
      total: await CodingChallenge.countDocuments(),
    };

    console.log(`[Seed Coding] Successfully synced language learning paths!`);
    console.log(`  🐍 Python: ${counts.python} challenges`);
    console.log(`  🟨 JavaScript: ${counts.javascript} challenges`);
    console.log(`  ☕ Java: ${counts.java} challenges`);
    console.log(`  ⚡ C++: ${counts.cpp} challenges`);
    console.log(`  🌟 Total Challenges: ${counts.total}`);

    return counts;
  } catch (error) {
    console.error('[Seed Coding Error]:', error.message);
    throw error;
  }
}
