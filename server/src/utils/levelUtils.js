/**
 * Calculates current level from total XP.
 * Formula: Level = floor(1 + sqrt(totalXP / 100))
 */
export function calculateLevel(totalXP = 0) {
  if (totalXP < 0) totalXP = 0;
  return Math.floor(1 + Math.sqrt(totalXP / 100));
}

/**
 * Calculates minimum XP required to reach level N.
 * Formula: XP = 100 * (level - 1)^2
 */
export function getXPForLevel(level) {
  if (level <= 1) return 0;
  return 100 * Math.pow(level - 1, 2);
}

/**
 * Calculates progress info towards next level:
 * - currentLevel
 * - currentLevelXP (XP earned within current level)
 * - nextLevelXP (Total XP needed to reach next level from current level)
 * - progressPercent (0 - 100%)
 */
export function getLevelProgress(totalXP = 0) {
  const currentLevel = calculateLevel(totalXP);
  const currentThreshold = getXPForLevel(currentLevel);
  const nextThreshold = getXPForLevel(currentLevel + 1);

  const xpIntoCurrentLevel = totalXP - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    totalXP,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
  };
}
