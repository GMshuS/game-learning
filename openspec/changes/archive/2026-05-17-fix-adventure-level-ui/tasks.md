## 1. 修复 BattleScene.js 回调机制

- [x] 1.1 修改 `BattleScene.js` 的 `init()` 方法，支持接收 `onBattleEnd` 回调函数参数
- [x] 1.2 修改 `BattleScene.js` 的 `endBattle()` 方法，在结束时调用 `onBattleEnd` 回调传递结果数据
- [x] 1.3 验证 `BattleScene.js` 使用 `questionGenerator.generateQuestion()` 而非内联题目生成逻辑

## 2. 修复 WorldMapScene.js 回调机制

- [x] 2.1 修改 `WorldMapScene.js` 的 `enterArea()` 方法，调用 `onAreaSelect` 回调而不是仅 console.log
- [x] 2.2 确保 `onAreaSelect` 回调传递选中的 area 对象

## 3. 重构 BattleGame.vue

- [x] 3.1 移除 `BattleGame.vue` 中的 `createBattleScene` 内联函数定义（第 125-472 行）
- [x] 3.2 修改 `onMounted` 使用 `import BattleScene from '../scenes/BattleScene'` 独立场景类
- [x] 3.3 通过 `game.scene.start('BattleScene', { player, monster, grade, streak, onBattleEnd })` 启动场景
- [x] 3.4 确保 props `player`、`monster`、`grade`、`streak` 正确传递给场景
- [x] 3.5 在 `onBattleEnd` 回调中 emit `battleEnd` 事件给父组件

## 4. 重构 AdventureMap.vue

- [x] 4.1 移除 `AdventureMap.vue` 中的 `createWorldMapScene` 内联函数定义（第 81-176 行）
- [x] 4.2 修改 `onMounted` 使用 `import WorldMapScene from '../scenes/WorldMapScene'` 独立场景类
- [x] 4.3 通过 `game.scene.start('WorldMapScene', { unlockedAreas, currentAreaId, onAreaSelect })` 启动场景

## 5. 创建关卡选择组件 LevelSelect.vue

- [x] 5.1 创建 `src/components/LevelSelect.vue` 文件
- [x] 5.2 实现 props：`area`（区域对象）、`completedLevels`（已完成关卡列表）、`stars`（星级数据）
- [x] 5.3 实现 emits：`levelSelect`（选择关卡）、`back`（返回地图）
- [x] 5.4 渲染关卡网格：每个关卡卡片显示编号、星级、锁定状态
- [x] 5.5 使用区域的 `color` 作为主题色
- [x] 5.6 锁定关卡不可点击，显示锁图标和半透明效果
- [x] 5.7 已完成关卡显示获得的星星（1-3 颗）

## 6. 修改 GameApp.vue 视图路由

- [x] 6.1 导入 `LevelSelect.vue` 组件
- [x] 6.2 添加 `levelSelect` 视图状态到 `currentView`
- [x] 6.3 在模板中添加 `<LevelSelect>` 组件渲染
- [x] 6.4 修改 `startBattle()` 函数签名，接收 `area` 和 `level` 参数
- [x] 6.5 修改 `startBattle()` 根据 area 和 level 计算正确的 monster、grade、player 数据
- [x] 6.6 添加 `showLevelSelect(area)` 函数，从地图切换到关卡选择
- [x] 6.7 添加 `onLevelSelect(area, level)` 函数，从关卡选择进入战斗
- [x] 6.8 维护 `previousView` 链确保返回导航正确

## 7. 更新 AdventureMap.vue 事件处理

- [x] 7.1 修改 `AdventureMap.vue` 的 `onAreaSelect` 回调，不再直接 emit `areaSelect` 触发战斗
- [x] 7.2 改为 emit `areaSelect` 让 GameApp 切换到关卡选择视图

## 8. 完善 LocalStorage 关卡进度存储

- [x] 8.1 确认 `gameStore.completeLevel()` 方法能保存关卡完成状态和星级
- [x] 8.2 在 `onBattleEnd` 处理函数中调用 `completeLevel()` 保存进度
- [x] 8.3 确保关卡选择界面从 gameStore 读取最新的完成状态

## 9. 清理和验证

- [x] 9.1 运行 `npm run dev` 验证冒险模式完整流程：主菜单 → 挑战中心 → 冒险地图 → 关卡选择 → 战斗 → 返回
- [x] 9.2 验证战斗 UI 显示正确的玩家名称、血量、怪物信息
- [x] 9.3 验证关卡选择界面正确显示锁定/解锁状态
- [x] 9.4 验证返回导航在各视图间正常工作
- [x] 9.5 验证战斗结束后关卡进度正确保存
