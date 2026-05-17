## Context

数学工坊是纯 Vue 3 组件，不使用 Phaser 场景。当前"答题获取材料"功能有完整的后端逻辑（题目生成、答案验证、材料奖励），但 UI 入口缺失——材料区的提示文本未绑定点击事件。此外还存在数据加载/保存中断问题（`loadData` 未调用、`getSaveData()` 未同步回 `gameStore`），以及除法题目逻辑错误。

## Goals / Non-Goals

**Goals:**
- 修复"答题获取材料"文本不可点击的问题，点击后弹出答题弹窗
- 修复数据加载：`onMounted` 时从 `gameStore` 加载数据到 `workshopStore`
- 修复数据保存：每次工坊操作后将 `workshopStore` 状态同步回 `gameStore`
- 修复除法题目生成逻辑
- 所有改动局限在 `Workshop.vue` 一个文件中

**Non-Goals:**
- 不修改 `workshopStore.js`（其接口已完整）
- 不修改数据模型或存档格式
- 不涉及 Phaser 场景或其他组件

## Decisions

1. **点击入口：使用 `<div>` 的 `@click` 事件** — 将材料区的静态文本改为可点击元素。启动答题流程前先调用 `generateQuestion()` 生成题目并设置 `showQuestionDialog = true`。

2. **数据加载：在 `onMounted` 中调用 `store.loadData(gameStore.workshop)`** — 与 `CardCollection.vue` 模式一致。如果 `gameStore.workshop` 为 `null`，`loadData` 内部的默认值处理可安全使用默认状态。

3. **数据保存：封装 `syncAndSave` 辅助函数** — 每次操作（答题、制作、上架、撤回）后先执行 `gameStore.workshop = store.getSaveData()` 再执行 `gameStore.saveGame()`。保持与项目中其他模块一致的模式。

4. **除法修复：生成可整除的题目** — 对于除法运算，先随机生成结果（1-10），再乘以除数得到被除数，确保 `a ÷ b = c` 中正确答案 `c` 始终匹配题目。

## Risks / Trade-offs

- **风险：存档数据为 `null`** — 用户首次使用或旧存档可能没有 `gameStore.workshop` 字段。`loadData` 内部有默认值处理，安全。
- **风险：同步开销** — 每次操作都写回 `gameStore` 并调用 `saveGame()`，与项目中其他模块一致，可接受。
- **风险：多层除法调整** — 需要根据年级调整除数范围，确保低年级除数较小（2-5），高年级可较大（2-12），已纳入实现考虑。
