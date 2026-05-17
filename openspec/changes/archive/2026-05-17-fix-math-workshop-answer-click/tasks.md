## 1. 修复"答题获取材料"点击入口

- [x] 1.1 将材料区的 `<div class="empty-msg">` 改为可点击元素，添加 `@click="generateQuestion"` 事件和 `cursor: pointer` 样式
- [x] 1.2 添加按钮样式（hover 效果、过渡动画），使其视觉上可交互

## 2. 修复数据加载与持久化

- [x] 2.1 在 `onMounted` 中调用 `store.loadData(gameStore.workshop)` 以从存档加载数据
- [x] 2.2 在 `handleCraft` 中将 `gameStore.workshop = store.getSaveData()` 放在 `gameStore.saveGame()` 之前
- [x] 2.3 在 `confirmList` 中将 `gameStore.workshop = store.getSaveData()` 放在 `gameStore.saveGame()` 之前
- [x] 2.4 在 `handleWithdraw` 中将 `gameStore.workshop = store.getSaveData()` 放在 `gameStore.saveGame()` 之前
- [x] 2.5 在 `answerQuestion` 中将 `gameStore.workshop = store.getSaveData()` 放在 `gameStore.saveGame()` 之前

## 3. 修复除法题目生成逻辑

- [x] 3.1 修改 `generateQuestion` 中的除法分支：先随机选择除数（低年级 2-5，高年级 2-12），再随机生成整数结果，计算被除数 = 除数 × 结果，确保答案匹配
