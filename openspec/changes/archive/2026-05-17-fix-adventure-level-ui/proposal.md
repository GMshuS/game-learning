## Why

冒险模式从世界地图选择区域后进入战斗关卡时，UI 显示混乱。根本原因：
1. `GameApp.vue` 的 `startBattle()` 没有向 `BattleGame.vue` 传递玩家、怪物、年级等关键参数，导致战斗始终使用默认值
2. `BattleGame.vue` 内联了一个与 `src/scenes/BattleScene.js` 重复的 Phaser 场景，但两者逻辑不一致（伤害计算、题目生成不同），造成行为混乱
3. `AdventureMap.vue` 同样内联了与 `WorldMapScene.js` 重复的场景代码
4. 没有关卡选择界面，从区域选择直接跳到随机战斗，缺少上下文过渡

## What Changes

- 修复 `GameApp.vue` → `BattleGame.vue` 的 props 传递，传入玩家信息、怪物数据、年级、连击数
- 移除 `BattleGame.vue` 中的内联 Phaser 场景定义，统一使用 `src/scenes/BattleScene.js`
- 移除 `AdventureMap.vue` 中的内联 Phaser 场景定义，统一使用 `src/scenes/WorldMapScene.js`
- 在区域选择和战斗之间添加关卡选择过渡界面，显示当前区域的关卡列表和进度
- 统一战斗逻辑：使用 `BattleState` 和 `questionGenerator` 作为唯一来源

## Capabilities

### New Capabilities
- `level-selection`: 区域与战斗之间的关卡选择界面，展示关卡列表、解锁状态、进度星标
- `battle-props-binding`: GameApp 到 BattleGame 的完整数据传递机制（玩家、怪物、年级、连击）

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- `src/components/GameApp.vue` — 修改 `startBattle()` 传递完整参数
- `src/components/BattleGame.vue` — 移除内联场景，改用独立 BattleScene，接收 props
- `src/components/AdventureMap.vue` — 移除内联场景，改用独立 WorldMapScene
- `src/scenes/WorldMapScene.js` — 可能需要微调以适配 Vue 组件调用
- 新增 `src/components/LevelSelect.vue` — 关卡选择界面
