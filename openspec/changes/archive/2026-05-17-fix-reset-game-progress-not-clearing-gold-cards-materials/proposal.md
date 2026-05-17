## Why

重置游戏进度功能存在严重缺陷：`GameApp.vue` 中的 `handleReset()` 函数使用的是旧的 localStorage 键名（如 `game_player`、`game_progress`、`game_items` 等），而当前 `storage.js` 使用的键名前缀为 `math_game_`（如 `math_game_player`、`math_game_progress`、`math_game_inventory` 等）。这导致重置操作只删除了不存在的旧键，实际的金币、卡牌、材料、关卡进度等数据完全没有被清除。

## What Changes

- 修复 `GameApp.vue` 中 `handleReset()` 函数，使用 `storageManager` 的 `STORAGE_KEYS` 常量来清除正确的 localStorage 键
- 确保重置时保留设置数据（`math_game_settings`），清除所有游戏进度相关数据
- 确保重置后正确重新初始化所有 Pinia store 的默认状态

## Capabilities

### New Capabilities
- `reset-game-progress`: 定义游戏进度重置的完整行为规范，包括保留设置、清除所有进度数据、重新初始化 store

### Modified Capabilities
- `save-data`: 重置操作需要与存档数据结构保持一致，确保所有新增玩法数据（速算、工坊、卡牌、排行榜）也被正确清除

## Impact

- `src/components/GameApp.vue`: 修复 `handleReset()` 函数
- `src/utils/storage.js`: 可能需要提供保留设置的 `resetGame()` 变体
- `src/store/*.js`: 所有 Pinia store 需要在重置后重新初始化
