## Why

数学工坊的"答题获取材料"功能虽有完整实现逻辑（题目生成、答案验证、材料奖励），但静态文本缺少点击事件绑定，用户无法触发答题流程，导致整个工坊系统被阻塞——没有材料就不能制作，不能制作就不能上架销售。

## What Changes

- 给材料区"答题获取材料"文本添加 `@click` 事件，使其可点击并弹出答题对话框
- 在 `onMounted` 中调用 `workshopStore.loadData(gameStore.workshop)` 加载已保存数据
- 在每次工坊操作后调用 `gameStore.workshop = store.getSaveData()` 同步数据到 gameStore 以便持久化
- 修复除法题目生成逻辑：生成可整除的题目，确保正确答案匹配被除数和除数

## Capabilities

### New Capabilities
- (none; this is a bug fix for existing capability)

### Modified Capabilities
- `workshop`: 修复"答题获取材料"功能不可点击的问题，修复数据加载/保存中断，修复除法题目逻辑

## Impact

- `src/components/Workshop.vue` — 添加点击事件、数据加载、数据同步、除法题目修复
- `src/store/workshopStore.js` — 无需改动（接口已完整）
- 所有改动向后兼容，不影响已有存档数据
