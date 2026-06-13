# Bug 修复结果

## 修复摘要
- **问题**：速算竞技场闪电抢答只有一题 & 生存模式生命值显示不匹配
- **根因**：
  1. 闪电模式 AI 速度计算将秒误作毫秒（`1000/aiTime` → `1/aiTime`）
  2. 生存模式 `startGame()` 错误叠加了 `difficultyScale.speedLivesBonus`（简单难度 +1），导致 4 条命
  3. UI 硬编码 `3` 计算黑心数量，与实际 lives 不匹配
- **状态**：【已修复】

## 修改内容
- **Bug 1 修复**：`updateAI()` 中 `1000/aiTime` 改为 `1/aiTime`，AI 进度从每次跳跃 100~250% 降至 0.1~0.25/次
- **Bug 2 修复**：去掉生存模式生命值的难度加成，固定 3 条命；新增 `maxLives` 状态，UI 动态计算红黑心数量
- 共修改 **2** 个文件，**4** 处改动

## 涉及文件
- `src/store/speedChallengeStore.js` — 3 处改动（去掉 speedLivesBonus、新增 maxLives、修复 AI 速度）
- `src/components/SpeedChallenge.vue` — 1 处改动（黑心计算改为 store.maxLives - store.lives）

## 构建验证结果
- 构建：【通过】命令：`npm run build`（vite build）
- 类型检查：⏭️ 跳过（项目使用纯 JavaScript，无 TS 配置）
- Linter：⏭️ 跳过（项目未配置 Linter）

## 提交信息
详见 `commit-msg.txt`
