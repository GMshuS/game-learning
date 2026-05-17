## Context

当前游戏使用 `storage.js` 中的 `StorageManager` 管理 localStorage 数据，键名统一使用 `math_game_` 前缀（如 `math_game_player`、`math_game_progress`、`math_game_inventory` 等）。但 `GameApp.vue` 中的 `handleReset()` 函数仍使用旧版键名（`game_player`、`game_progress`、`game_items` 等），导致重置操作实际上没有清除任何有效数据。

此外，`storageManager.resetGame()` 会清除所有键包括设置，而 UI 提示明确说"设置将保留"，因此需要一个新的方法或调整现有逻辑。

## Goals / Non-Goals

**Goals:**
- 重置操作正确清除所有游戏进度数据（金币、卡牌、材料、关卡、成就等）
- 重置操作保留用户设置（音量、语言等）
- 重置后所有 Pinia store 恢复到初始状态
- 重置后页面刷新，以新游戏状态重新加载

**Non-Goals:**
- 不修改存档数据结构或存储键名
- 不添加撤销重置功能
- 不修改设置相关的重置逻辑

## Decisions

### Decision 1: 在 storage.js 中新增 `resetGameKeepSettings()` 方法

**方案**: 在 `StorageManager` 中新增一个方法，遍历 `STORAGE_KEYS` 但跳过 `SETTINGS` 键。

**理由**: 
- `resetGame()` 当前清除所有键，但 UI 明确承诺保留设置
- 新增方法比修改现有方法更安全，避免影响其他可能的调用方
- 保持单一职责：`resetGame()` = 全清，`resetGameKeepSettings()` = 保留设置

**备选方案**: 直接修改 `handleReset()` 手动遍历键。缺点：逻辑重复，未来新增键容易遗漏。

### Decision 2: `handleReset()` 改为调用 `storageManager.resetGameKeepSettings()` + 重新初始化 store

**方案**: 
1. 调用 `storageManager.resetGameKeepSettings()` 清除 localStorage
2. 调用所有相关 Pinia store 的 `$reset()` 方法
3. 调用 `storageManager.createNewGame()` 创建新游戏初始存档
4. `location.reload()` 刷新页面

**理由**: 确保 localStorage 和内存中的 store 状态完全一致。

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 新增的 `resetGameKeepSettings()` 方法可能遗漏未来新增的 STORAGE_KEYS | 该方法遍历 `STORAGE_KEYS` 对象的所有值并跳过 SETTINGS，自动适配新增键 |
| Pinia store 的 `$reset()` 可能不完全恢复到初始状态 | 通过 `createNewGame()` 重新创建初始存档，reload 后 store 会从正确的初始数据加载 |
| 如果 localStorage 被禁用或不可用，重置可能报错 | 保留现有的 try/catch 错误处理 |
