## Context

当前冒险模式的架构：
- `GameApp.vue` 作为视图调度器，通过 `currentView` 状态切换不同视图
- `AdventureMap.vue` 嵌入 Phaser 世界地图场景，内联定义了一个与 `WorldMapScene.js` 重复的场景
- `BattleGame.vue` 嵌入 Phaser 战斗场景，内联定义了一个与 `BattleScene.js` 重复的场景
- 从区域选择到战斗没有中间过渡，`startBattle()` 直接切换视图且不传递任何参数
- 战斗逻辑有两套实现：独立场景使用 `BattleState` + `questionGenerator`，内联场景使用硬编码值

约束：
- 纯 JavaScript（无 TypeScript）
- Vue 3 Composition API + Phaser 3
- 保持移动端响应式设计
- 不引入新的外部依赖

## Goals / Non-Goals

**Goals:**
- 消除 Phaser 场景代码重复，统一使用 `src/scenes/` 下的独立场景类
- 修复 props 传递，使战斗场景能接收到正确的玩家、怪物、年级数据
- 新增关卡选择界面作为区域与战斗之间的过渡
- 统一战斗逻辑来源（BattleState + questionGenerator）

**Non-Goals:**
- 不重构整个冒险模式的状态管理（battleStore 暂不启用）
- 不改变现有的 Phaser 渲染方式和 UI 风格
- 不引入后端或持久化层变更
- 不修改成就系统或商店系统

## Decisions

### Decision 1: 移除内联场景，统一使用独立场景类

**选择**: 删除 `BattleGame.vue` 和 `AdventureMap.vue` 中的内联 Phaser 场景定义，改为通过 `game.scene.start()` 启动 `src/scenes/` 下的独立场景类。

**理由**:
- 消除代码重复，维护单一真实来源
- 独立场景类结构更清晰（方法拆分），便于测试和扩展
- `BattleScene.js` 已使用 `BattleState` 和 `questionGenerator`，逻辑更完善

**替代方案**:
- 保留内联场景并同步两套代码 → 维护成本高，已证明会导致不一致
- 将独立场景改为内联 → 失去模块化优势

### Decision 2: 通过 Vue 组件 ref + Phaser scene plugin 传递数据

**选择**: 在 Vue 组件的 `onMounted` 中创建 Phaser Game 实例后，通过 `game.scene.start(sceneKey, data)` 的 data 参数传递玩家、怪物等数据到场景的 `init()` 方法。

**理由**:
- Phaser 原生支持场景间数据传递
- 与现有 `BattleScene.init(data)` 和 `WorldMapScene.init(data)` 的接口一致
- 不需要引入额外的事件总线或全局状态

### Decision 3: 关卡选择使用纯 Vue 组件（非 Phaser）

**选择**: `LevelSelect.vue` 使用纯 Vue + CSS 实现，不嵌入 Phaser。

**理由**:
- 关卡选择是 UI 列表操作，不需要游戏引擎
- 与 `GameHall.vue` 的卡片式布局风格一致
- 减少 Phaser 实例创建/销毁的开销

### Decision 4: 关卡进度使用 LocalStorage 存储

**选择**: 关卡完成状态和星星级别存储在 `gameStore` 的 `progress.completedLevels` 和 `progress.stars` 中，通过 LocalStorage 持久化。

**理由**:
- 项目已有 LocalStorage 存储机制（saveDataStore）
- `GameProgress` 模型已支持 `completedLevels` 和 `stars` 字段
- 无需新增存储层

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| `BattleScene.js` 的 `init()` 接口与内联场景不完全兼容 | 对照内联场景的 props 默认值，确保 `BattleScene` 有合理的 fallback |
| Phaser 场景通过 `game.scene.start()` 启动时，Vue 组件无法直接接收 `battleEnd` 事件 | 在 `init(data)` 中传入回调函数 `onBattleEnd`，场景结束时调用 |
| 移除内联场景后，如果独立场景有 bug 会影响战斗 | 先在独立场景中补齐内联场景缺少的功能（如 `onBattleEnd` 回调触发） |
| 关卡选择界面增加了一个视图层级，可能影响返回导航 | 在 `GameApp.vue` 中正确维护 `previousView` 链 |
