/**
 * 奖励系统配置
 */
export const rewardConfig = {
  // 每日奖励
  dailyRewards: [
    { day: 1, coins: 50, exp: 100, item: null },
    { day: 2, coins: 60, exp: 120, item: null },
    { day: 3, coins: 70, exp: 150, item: { type: 'equipment', id: 'pencil_sword_1' } },
    { day: 4, coins: 80, exp: 180, item: null },
    { day: 5, coins: 100, exp: 200, item: null },
    { day: 6, coins: 120, exp: 250, item: { type: 'currency', id: 'special_coin' } },
    { day: 7, coins: 200, exp: 500, item: { type: 'equipment', id: 'math_badge' } }
  ],

  // 等级奖励
  levelRewards: [
    { level: 1, coins: 100, exp: 0 },
    { level: 5, coins: 200, exp: 100 },
    { level: 10, coins: 500, exp: 200 },
    { level: 15, coins: 800, exp: 300 },
    { level: 20, coins: 1000, exp: 500 },
    { level: 30, coins: 2000, exp: 1000 },
    { level: 40, coins: 3000, exp: 1500 },
    { level: 50, coins: 5000, exp: 2000 }
  ],

  // 连胜奖励
  streakRewards: [
    { streak: 3, coins: 10, exp: 20 },
    { streak: 5, coins: 25, exp: 50 },
    { streak: 10, coins: 50, exp: 100 },
    { streak: 20, coins: 150, exp: 300 },
    { streak: 50, coins: 500, exp: 1000 }
  ],

  // 任务奖励
  questRewards: {
    daily: {
      easy: { coins: 30, exp: 50 },
      medium: { coins: 50, exp: 100 },
      hard: { coins: 100, exp: 200 }
    },
    weekly: {
      easy: { coins: 200, exp: 400 },
      medium: { coins: 400, exp: 800 },
      hard: { coins: 800, exp: 1500 }
    }
  }
};

/**
 * 获取每日奖励
 */
export function getDailyReward(day) {
  const index = (day - 1) % rewardConfig.dailyRewards.length;
  return rewardConfig.dailyRewards[index];
}

/**
 * 获取等级奖励
 */
export function getLevelReward(level) {
  return rewardConfig.levelRewards.find(r => r.level === level);
}

/**
 * 获取连胜奖励
 */
export function getStreakReward(streak) {
  const rewards = rewardConfig.streakRewards.slice().reverse();
  for (const reward of rewards) {
    if (streak >= reward.streak) {
      return reward;
    }
  }
  return null;
}

export default rewardConfig;
