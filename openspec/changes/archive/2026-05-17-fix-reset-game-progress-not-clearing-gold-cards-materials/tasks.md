## 1. StorageManager 新增方法

- [x] 1.1 在 `src/utils/storage.js` 中新增 `resetGameKeepSettings()` 方法，遍历 `STORAGE_KEYS` 删除所有键但跳过 `SETTINGS` 键
- [x] 1.2 导出新增方法，确保可在组件中调用

## 2. 修复 GameApp.vue 重置逻辑

- [x] 2.1 修改 `handleReset()` 函数，移除旧的硬编码 localStorage 键名删除逻辑
- [x] 2.2 改为调用 `storageManager.resetGameKeepSettings()` 清除进度数据
- [x] 2.3 调用 `storageManager.createNewGame()` 创建新的初始存档
- [x] 2.4 重置后调用所有 Pinia store 的 `$reset()` 方法（gameStore、battleStore、shopStore、achievementStore、equipmentStore、speedChallengeStore、cashierStore、saveDataStore、questionStore）
- [x] 2.5 保留现有的确认对话框和错误处理逻辑

## 3. 验证重置功能

- [x] 3.1 确认重置后金币、卡牌、材料等数据归零
- [x] 3.2 确认重置后设置（音量、语言等）保持不变
- [x] 3.3 确认重置后页面刷新，游戏从初始状态开始
