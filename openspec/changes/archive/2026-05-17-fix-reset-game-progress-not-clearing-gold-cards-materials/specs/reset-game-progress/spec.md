## ADDED Requirements

### Requirement: 重置游戏进度保留设置
系统 SHALL 提供重置游戏进度的功能，该功能清除所有游戏进度数据但保留用户设置。

#### Scenario: 重置后设置保留
- **WHEN** 用户触发重置游戏进度
- **THEN** `math_game_settings` 键的值保持不变

#### Scenario: 重置后进度数据清除
- **WHEN** 用户触发重置游戏进度
- **THEN** `math_game_player`、`math_game_progress`、`math_game_inventory` 键被删除

#### Scenario: 重置后新增玩法数据清除
- **WHEN** 用户触发重置游戏进度
- **THEN** `math_game_speed_challenge`、`math_game_workshop`、`math_game_card_battle`、`math_game_leaderboard`、`math_game_notifications` 键被删除

### Requirement: 重置后重新初始化游戏
系统 SHALL 在重置后创建新的初始游戏存档，确保玩家可以从头开始游戏。

#### Scenario: 重置后创建新存档
- **WHEN** 重置操作完成
- **THEN** 调用 `createNewGame()` 创建包含初始玩家、进度、库存的新存档

### Requirement: 重置后 Store 状态同步
所有 Pinia store SHALL 在重置后恢复到初始状态。

#### Scenario: Store 状态重置
- **WHEN** 重置操作执行
- **THEN** 所有相关 Pinia store 调用 `$reset()` 并重新从 localStorage 加载数据

#### Scenario: 重置后页面刷新
- **WHEN** 重置操作完成
- **THEN** 页面刷新（`location.reload()`），所有状态从新的初始存档加载

### Requirement: 重置操作确认
系统 SHALL 在执行重置前要求用户确认，防止误操作。

#### Scenario: 用户确认重置
- **WHEN** 用户点击"重置游戏进度"按钮
- **THEN** 弹出确认对话框，说明重置不可撤销且设置将保留

#### Scenario: 用户取消重置
- **WHEN** 用户在确认对话框中点击取消
- **THEN** 不执行任何重置操作
