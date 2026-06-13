# 修复方案：速算竞技场双 Bug 修复

## Bug 1：闪电抢答只有一题

### 根因
`speedChallengeStore.js` 中 `updateAI()` 方法将 `aiAnswerTime`（单位：秒）误作毫秒处理，`1000 / aiTime` 导致 AI 进度单次跳跃 100~250%，答完第一题游戏即结束。

### 修改
- **`src/store/speedChallengeStore.js`**：第 163 行，`1000 / aiTime` → `1 / aiTime`

## Bug 2：生存模式生命值显示不一致

### 根因
1. `startGame()` 错误地加了 `difficultyScale.speedLivesBonus`，导致生存模式变成 4 条命（简单难度 +1）
2. 模板硬编码 `3` 计算黑心数量，与实际 lives 不匹配

### 修改
- **`src/store/speedChallengeStore.js`**：去掉 `speedLivesBonus` 加成，固定使用 `config.lives`（3 条命）；新增 `maxLives` 状态记录初始值
- **`src/components/SpeedChallenge.vue`**：黑心计算改为 `store.maxLives - store.lives` 动态计算
